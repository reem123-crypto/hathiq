/**
 * workshop-roles.js
 * إدارة عرض/إخفاء عناصر صفحة "الورش" حسب دور المستخدم
 * الأدوار الفعلية (من حقل type في كولكشن users): 'talent' | 'client' | 'admin'
 *
 * يعتمد على window.AppwriteHelper (js/appwrite-helper.js) - لازم يتحمّل قبل الملف ده
 */

const WORKSHOPS_COLLECTION_ID = "workshops";
const USERS_COLLECTION_ID = "users";

let currentUserRole = null;
let currentUserAccountId = null;

/**
 * يرجع دور المستخدم الحالي: 'client' | 'talent' | 'admin' | null (زائر غير مسجل)
 * الربط بين account.$id ومستند users بيتم عبر حقل accountId
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
        return null; // زائر غير مسجل دخول
    }
}

/**
 * يطبّق الصلاحيات على عناصر الصفحة اعتمادًا على data-role-visible
 * مثال: <button data-role-visible="talent,admin">إضافة ورشة</button>
 */
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
 * يجلب الورش حسب الدور:
 * - client (وأي زائر): الورش المتاحة فقط (status = 'available')
 * - talent: الورش المتاحة + ورشه هو (instructor_id بتاعه)
 * - admin: كل الورش بدون فلترة
 */
async function fetchWorkshopsForRole(role, accountId) {
    const Query = window.AppwriteHelper.Query;
    let queries = [];

    if (role === "talent" && accountId) {
        queries = [
            Query.or([
                Query.equal("status", "available"),
                Query.equal("instructor_id", accountId),
            ]),
        ];
    } else if (role === "admin") {
        queries = []; // بدون فلترة
    } else {
        // client أو زائر غير مسجل
        queries = [Query.equal("status", "available")];
    }

    const response = await window.AppwriteHelper.listDocuments(WORKSHOPS_COLLECTION_ID, queries);
    return response.documents;
}

/**
 * إضافة ورشة جديدة - talent أو admin فقط
 */
async function createWorkshop(workshopData) {
    const role = await getCurrentUserRole();
    if (role !== "talent" && role !== "admin") {
        throw new Error("ليس لديك صلاحية لإضافة ورشة");
    }

    return window.AppwriteHelper.createDocument(WORKSHOPS_COLLECTION_ID, {
        ...workshopData,
        instructor_id: currentUserAccountId,
        seats_available: workshopData.seats,
        status: role === "admin" ? "available" : "pending_review",
    });
}

/**
 * دالة تشغيل رئيسية: تستدعى عند تحميل صفحة workshops.html
 */
async function initWorkshopsPage() {
    const role = await getCurrentUserRole();
    applyRoleVisibility(role);

    const workshops = await fetchWorkshopsForRole(role, currentUserAccountId);
    renderWorkshops(workshops, role, currentUserAccountId);
}

/**
 * دالة عرض الورش في الصفحة - عدّلها حسب تصميم categoriesGrid عندك
 */
function renderWorkshops(workshops, role, currentUserAccountId) {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    grid.innerHTML = workshops
        .map((w) => {
            const isOwner = role === "talent" && w.instructor_id === currentUserAccountId;
            const adminControls =
                role === "admin" || isOwner
                    ? `<div class="workshop-admin-actions">
                         <button onclick="editWorkshop('${w.$id}')">تعديل</button>
                         ${role === "admin" ? `<button onclick="deleteWorkshop('${w.$id}')">حذف</button>` : ""}
                       </div>`
                    : "";
            const startDate = new Date(w.start_date).toLocaleDateString("ar");
            return `
              <div class="workshop-card" data-status="${w.status}">
                <h3>${w.title}</h3>
                <p>المستوى: ${w.level} | النوع: ${w.type}</p>
                <p>السعر: ${w.price} ر.ع | المقاعد المتاحة: ${w.seats_available}/${w.seats}</p>
                <p>تاريخ البدء: ${startDate}</p>
                ${w.status === "pending_review" ? `<span class="badge-pending">قيد المراجعة</span>` : ""}
                ${adminControls}
              </div>
            `;
        })
        .join("");
}

/**
 * حذف ورشة - أدمن فقط (استدعيها من زر "حذف" في renderWorkshops)
 */
async function deleteWorkshop(workshopId) {
    if (currentUserRole !== "admin") return;
    const confirmed = confirm("هل تريد حذف هذه الورشة؟");
    if (!confirmed) return;

    try {
        await window.AppwriteHelper.deleteDocument(WORKSHOPS_COLLECTION_ID, workshopId);
        initWorkshopsPage();
    } catch (err) {
        console.error("فشل حذف الورشة:", err);
    }
}

document.addEventListener("DOMContentLoaded", initWorkshopsPage);