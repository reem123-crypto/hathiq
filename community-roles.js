/**
 * community-roles.js
 * التحكم في صلاحيات صفحة "المجتمع" حسب دور المستخدم
 * الأدوار الفعلية (من حقل type في كولكشن users): 'talent' | 'client' | 'admin'
 *
 * القرار المعتمد:
 * - client و talent: الاثنين ينشروا في أي فئة بدون قيود
 * - admin: يقدر يحذف/يدير أي منشور من أي حد
 * - صاحب المنشور نفسه يقدر يحذف منشوره الشخصي
 *
 * يعتمد على window.AppwriteHelper (js/appwrite-helper.js) - لازم يتحمّل قبل community.js وقبل الملف ده
 */

const USERS_COLLECTION_ID = "users";
const POSTS_COLLECTION_ID = "community_posts";

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

/**
 * هل المستخدم الحالي مسموحله يدير (يحذف) المنشور ده؟
 */
function canManagePost(post) {
    if (currentUserRole === "admin") return true;
    if (currentUserAccountId && post.userId && post.userId === currentUserAccountId) return true;
    return false;
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
 * نسخة جديدة من togglePostMenu بتستبدل النسخة الـ placeholder اللي في community.js
 */
function togglePostMenu(postId) {
    const post = postsData.find((p) => p.id === postId);
    if (!post) return;

    if (!canManagePost(post)) {
        window.showToast("ليس لديك صلاحية لإدارة هذا المنشور", "info");
        return;
    }

    const confirmed = confirm("هل تريد حذف هذا المنشور؟");
    if (confirmed) {
        deletePost(postId);
    }
}

/**
 * حذف منشور - من الواجهة فورًا، وبعدين من Appwrite لو كان محفوظ هناك
 */
async function deletePost(postId) {
    const index = postsData.findIndex((p) => p.id === postId);
    if (index === -1) return;

    const post = postsData[index];
    postsData.splice(index, 1);
    loadPosts();
    window.showToast("تم حذف المنشور", "success");

    try {
        if (post.appwriteDocId) {
            await window.AppwriteHelper.deleteDocument(POSTS_COLLECTION_ID, post.appwriteDocId);
        }
    } catch (err) {
        console.error("فشل حذف المنشور من Appwrite:", err);
        window.showToast("تم الحذف محليًا لكن حصل خطأ في المزامنة مع الخادم", "error");
    }
}

/**
 * إضافة/إخفاء زر الإدارة بجانب كل منشور حسب الصلاحية
 */
function refreshPostMenusVisibility() {
    document.querySelectorAll(".post-card").forEach((card) => {
        const postId = Number(card.dataset.postId);
        const post = postsData.find((p) => p.id === postId);
        const menuBtn = card.querySelector(".post-menu-btn");
        if (!menuBtn || !post) return;
        menuBtn.style.display = canManagePost(post) ? "" : "none";
    });
}

async function initCommunityRoles() {
    await getCurrentUserRole();
    applyRoleVisibility(currentUserRole);
    refreshPostMenusVisibility();
}

document.addEventListener("DOMContentLoaded", initCommunityRoles);