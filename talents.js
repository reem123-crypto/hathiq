// Talents Page JavaScript
// المواهب مش كولكشن منفصل - هي صفوف من كولكشن "users" حيث type = "talent"
// الجزء الخاص بالصلاحيات (توثيق/تعليق/حذف) موجود في talent-roles.js
// يعتمد على window.AppwriteHelper (js/appwrite-helper.js) - لازم يتحمّل قبل الملف ده

const USERS_COLLECTION_ID = "users";

let talentsData = [];
let currentTalentCategory = "all";
let talentSearchQuery = "";

document.addEventListener("DOMContentLoaded", function () {
    fetchTalents();
    initTalentFilters();
    initTalentSearch();
});

/**
 * يجيب كل المواهب النشطين من كولكشن users (type=talent, status=active)
 */
async function fetchTalents() {
    try {
        const Query = window.AppwriteHelper.Query;
        const queries = [
            Query.equal("type", "talent"),
            Query.equal("status", "active"),
        ];
        if (currentTalentCategory !== "all") {
            queries.push(Query.equal("category", currentTalentCategory));
        }

        const response = await window.AppwriteHelper.listDocuments(USERS_COLLECTION_ID, queries);
        talentsData = response.documents;

        renderCategoryTabs();
        loadTalents();
    } catch (err) {
        console.error("فشل جلب المواهب من Appwrite:", err);
        talentsData = [];
        loadTalents();
    }
}

function renderCategoryTabs() {
    const tabsContainer = document.getElementById("categoryTabs");
    if (!tabsContainer) return;

    const uniqueCategories = [...new Set(talentsData.map((t) => t.category).filter(Boolean))];
    const tabs = [{ id: "all", name: "الكل" }, ...uniqueCategories.map((c) => ({ id: c, name: c }))];

    tabsContainer.innerHTML = tabs
        .map(
            (cat) => `
        <button class="filter-tab ${cat.id === currentTalentCategory ? "active" : ""}" data-category="${cat.id}">
            ${cat.name}
        </button>
    `
        )
        .join("");
}

function initTalentFilters() {
    const tabsContainer = document.getElementById("categoryTabs");
    if (!tabsContainer) return;

    tabsContainer.addEventListener("click", function (e) {
        const tab = e.target.closest(".filter-tab");
        if (!tab) return;

        currentTalentCategory = tab.dataset.category;
        fetchTalents();
    });
}

function initTalentSearch() {
    const searchInput = document.getElementById("talentSearchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        talentSearchQuery = this.value.trim().toLowerCase();
        loadTalents();
    });
}

function getFilteredTalents() {
    if (!talentSearchQuery) return talentsData;
    return talentsData.filter(
        (t) =>
            (t.name && t.name.toLowerCase().includes(talentSearchQuery)) ||
            (t.bio && t.bio.toLowerCase().includes(talentSearchQuery)) ||
            (t.city && t.city.toLowerCase().includes(talentSearchQuery))
    );
}

function loadTalents() {
    const grid = document.getElementById("talentsGrid");
    const emptyState = document.getElementById("talentsEmptyState");
    if (!grid) return;

    const filtered = getFilteredTalents();

    if (filtered.length === 0) {
        grid.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = filtered
        .map(
            (t) => `
        <div class="talent-card" data-talent-id="${t.$id}">
            <div class="talent-avatar">
                ${t.avatar ? `<img src="${t.avatar}" alt="${t.name}">` : `<span>${(t.name || "؟").charAt(0)}</span>`}
            </div>
            <div class="talent-info">
                <h3>${t.name} ${t.verified ? `<span class="verified-badge" title="موهوب موثّق">✔</span>` : ""}</h3>
                <p class="talent-category">${t.category || ""}${t.city ? " - " + t.city : ""}</p>
                <p class="talent-bio">${t.bio || ""}</p>
                <div class="talent-rating">
                    ⭐ ${t.rating ? t.rating.toFixed(1) : "0.0"}
                    <span class="reviews-count">(${t.reviews_count || 0} تقييم)</span>
                </div>
                ${t.projects_completed ? `<div class="talent-projects">${t.projects_completed} مشروع منجز</div>` : ""}
                ${t.portfolio ? `<a href="${t.portfolio}" target="_blank" class="portfolio-link">معرض الأعمال</a>` : ""}
            </div>
            <div class="talent-actions" id="talentActions-${t.$id}"></div>
        </div>
    `
        )
        .join("");

    if (typeof refreshTalentActionsVisibility === "function") {
        refreshTalentActionsVisibility();
    }
}