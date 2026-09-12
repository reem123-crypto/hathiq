/**
 * talent-roles.js
 * التحكم في صلاحيات صفحة "المواهب" حسب دور المستخدم
 * المواهب هي صفوف من كولكشن "users" حيث type = "talent" - مفيش كولكشن منفصل
 * الأدوار الفعلية: 'talent' | 'client' | 'admin'
 *
 * القرار المعتمد:
 * - client: يتصفح ويشوف بروفايلات المواهب بس (بدون أي أزرار إدارة)
 * - talent: يعدّل بروفايله هو بس (زر "تعديل بروفايلي" أعلى الصفحة يظهر له فقط)
 * - admin: صلاحية كاملة - توثيق / تعليق / حذف أي حساب موهوب
 *
 * يعتمد على window.AppwriteHelper (js/appwrite-helper.js) - لازم يتحمّل قبل talents.js وقبل الملف ده
 */

const USERS_COLLECTION_ID = "users";

let currentUserRole = null;
let currentUserAccountId = null;

/**
 * يرجع دور المستخدم الحالي: 'client' | 'talent' | 'admin' | null (زائر)
 */
async function getCurrentUserRole() {
    try {
        const user = await window.AppwriteHelper.getCurrentAccount();
        currentUserAccountId = user.$id;

        const result = await window.AppwriteHelper.listDocuments(
            USERS_COLLECTION_ID,
            [window.AppwriteHelper.Query.equal("accountId", user.$id)]
        );

        currentUserRole = result.documents.length > 0 ? (result.documents[0].type || "client") : "client";
        return currentUserRole;
    } catch (err) {
        currentUserRole = null;
        currentUserAccountId = null;
        return null;
    }
}

function applyRoleVisibility(role) {
    const elements = document.querySelectorAll("[data-role-visible]");
    elements.forEach((el) => {
        const allowedRoles = el.getAttribute("data-role-visible")
            .split(",")
            .map((r) => r.trim());
        const isAllowed = role && allowedRoles.includes(role);
        el.style.display = isAllowed ? "" : "none";
    });
}

/**
 * حقن أزرار الإدارة المناسبة داخل كل بطاقة موهوب
 */
function refreshTalentActionsVisibility() {
    if (typeof talentsData === "undefined") return;

    talentsData.forEach((t) => {
        const actionsContainer = document.getElementById(`talentActions-${t.$id}`);
        if (!actionsContainer) return;

        const isOwner = currentUserRole === "talent" && t.accountId === currentUserAccountId;

        if (currentUserRole === "admin") {
            actionsContainer.innerHTML = `
                <button class="btn-icon" onclick="toggleVerifyTalent('${t.$id}')" title="${t.verified ? "إلغاء التوثيق" : "توثيق الحساب"}">
                    ${t.verified ? "إلغاء التوثيق" : "توثيق"}
                </button>
                <button class="btn-icon" onclick="toggleSuspendTalent('${t.$id}')" title="${t.status === "suspended" ? "تفعيل الحساب" : "تعليق الحساب"}">
                    ${t.status === "suspended" ? "تفعيل" : "تعليق"}
                </button>
                <button class="btn-icon btn-danger" onclick="deleteTalent('${t.$id}')" title="حذف الحساب">
                    حذف
                </button>
            `;
        } else if (isOwner) {
            actionsContainer.innerHTML = `<span class="own-profile-badge">هذا بروفايلك</span>`;
        } else {
            actionsContainer.innerHTML = "";
        }
    });
}

/**
 * توثيق / إلغاء توثيق حساب موهوب - أدمن فقط
 */
async function toggleVerifyTalent(talentDocId) {
    if (currentUserRole !== "admin") return;

    const talent = talentsData.find((t) => t.$id === talentDocId);
    if (!talent) return;

    const newValue = !talent.verified;

    try {
        await window.AppwriteHelper.updateDocument(USERS_COLLECTION_ID, talentDocId, { verified: newValue });
        talent.verified = newValue;
        loadTalents();
        window.showToast && window.showToast(newValue ? "تم توثيق الحساب" : "تم إلغاء التوثيق", "success");
    } catch (err) {
        console.error("فشل تحديث حالة التوثيق:", err);
        window.showToast && window.showToast("حصل خطأ أثناء تحديث التوثيق", "error");
    }
}

/**
 * تعليق / تفعيل حساب موهوب - أدمن فقط
 */
async function toggleSuspendTalent(talentDocId) {
    if (currentUserRole !== "admin") return;

    const talent = talentsData.find((t) => t.$id === talentDocId);
    if (!talent) return;

    const newStatus = talent.status === "suspended" ? "active" : "suspended";

    try {
        await window.AppwriteHelper.updateDocument(USERS_COLLECTION_ID, talentDocId, { status: newStatus });
        talent.status = newStatus;
        fetchTalents(); // لو معلّق هيختفي تلقائيًا لأن fetchTalents بيجيب status=active بس
        window.showToast && window.showToast(
            newStatus === "suspended" ? "تم تعليق الحساب" : "تم تفعيل الحساب",
            "success"
        );
    } catch (err) {
        console.error("فشل تحديث حالة الحساب:", err);
        window.showToast && window.showToast("حصل خطأ أثناء تحديث حالة الحساب", "error");
    }
}

/**
 * حذف حساب موهوب - أدمن فقط
 * ملاحظة: ده بيحذف مستند users بالكامل (الحساب نفسه). لو عايز تلغي صفة الموهوب بس
 * من غير حذف الحساب، حدّث type لحاجة تانية بدل الحذف الكامل - قولّي لو محتاجها.
 */
async function deleteTalent(talentDocId) {
    if (currentUserRole !== "admin") return;

    const confirmed = confirm("هل أنت متأكد من حذف حساب هذا الموهوب؟ لا يمكن التراجع عن هذا الإجراء.");
    if (!confirmed) return;

    try {
        await window.AppwriteHelper.deleteDocument(USERS_COLLECTION_ID, talentDocId);
        talentsData = talentsData.filter((t) => t.$id !== talentDocId);
        loadTalents();
        window.showToast && window.showToast("تم حذف حساب الموهوب", "success");
    } catch (err) {
        console.error("فشل حذف حساب الموهوب:", err);
        window.showToast && window.showToast("حصل خطأ أثناء الحذف", "error");
    }
}

async function initTalentRoles() {
    await getCurrentUserRole();
    applyRoleVisibility(currentUserRole);
    refreshTalentActionsVisibility();
}

document.addEventListener("DOMContentLoaded", initTalentRoles);