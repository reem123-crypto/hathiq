
const COMMUNITY_DB_ID = "YOUR_DATABASE_ID";
const POSTS_COLLECTION_ID = "community_posts";
const USERS_COLLECTION_ID = "users";

let currentUserRole = null;
let currentUserId = null;

async function getCurrentUserRole() {
    try {
        const account = window.appwriteAccount;
        const databases = window.appwriteDatabases;

        const user = await account.get();
        currentUserId = user.$id;

        const userDoc = await databases.getDocument(
            COMMUNITY_DB_ID,
            USERS_COLLECTION_ID,
            user.$id
        );
        currentUserRole = userDoc.role || "beneficiary";
        return currentUserRole;
    } catch (err) {
        currentUserRole = null;
        currentUserId = null;
        return null;
    }
}

function canManagePost(post) {
    if (currentUserRole === "admin") return true;
    if (currentUserId && post.userId && post.userId === currentUserId) return true;
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


async function deletePost(postId) {
    const index = postsData.findIndex((p) => p.id === postId);
    if (index === -1) return;

    const post = postsData[index];
    postsData.splice(index, 1);
    loadPosts();
    window.showToast("تم حذف المنشور", "success");

    try {
        if (post.appwriteDocId && window.appwriteDatabases) {
            await window.appwriteDatabases.deleteDocument(
                COMMUNITY_DB_ID,
                POSTS_COLLECTION_ID,
                post.appwriteDocId
            );
        }
    } catch (err) {
        console.error("فشل حذف المنشور من Appwrite:", err);
        window.showToast("تم الحذف محليًا لكن حصل خطأ في المزامنة مع الخادم", "error");
    }
}


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