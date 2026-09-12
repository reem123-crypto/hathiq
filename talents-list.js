/**
 * Talents List Page
 * صفحة قائمة المواهب - مع الربط بـ Backend API
 */

let allTalents = [];
let filteredTalents = [];
let currentCategory = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category');
    
    // Load talents
    await loadTalents();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Load talents from API or JSON
 */
async function loadTalents() {
    try {
        showLoading(true);
        
        // Build filters
        const filters = { type: 'talent' };
        if (currentCategory) {
            filters.category = currentCategory;
        }
        
        // Fetch from API (with automatic fallback to JSON)
        const response = await API.getUsers(filters);
        
        // Handle response
        if (response.status === 'success') {
            allTalents = response.data.users || response.data;
            filteredTalents = [...allTalents];
            renderTalents();
        } else {
            showError('فشل تحميل المواهب');
        }
        
    } catch (error) {
        console.error('Error loading talents:', error);
        showError('حدث خطأ أثناء تحميل المواهب');
    } finally {
        showLoading(false);
    }
}

/**
 * Render talents to DOM
 */
function renderTalents() {
    const container = document.getElementById('talentsGrid');
    const emptyState = document.getElementById('emptyState');
    const currentLang = localStorage.getItem('sayt_lang') || 'ar';
    
    if (!container) return;
    
    if (filteredTalents.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = filteredTalents.map(talent => `
        <div class="talent-card" data-id="${talent.id}">
            <div class="talent-avatar">
                ${talent.avatar ? 
                    `<img src="${talent.avatar}" alt="${talent.name}">` :
                    `<div class="avatar-placeholder">${talent.name.charAt(0)}</div>`
                }
                ${talent.verified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
            
            <div class="talent-info">
                <h3 class="talent-name">${talent.name}</h3>
                <span class="talent-category">${getCategoryName(talent.category, currentLang)}</span>
                
                ${talent.bio ? `<p class="talent-bio">${talent.bio}</p>` : ''}
                
                <div class="talent-stats">
                    <div class="stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>${talent.rating || 0}</span>
                    </div>
                    <div class="stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span>${talent.projects_completed || 0}</span>
                    </div>
                    <div class="stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        <span>${talent.reviews_count || 0}</span>
                    </div>
                </div>
                
                ${talent.city ? `
                    <div class="talent-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>${talent.city}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="talent-actions">
                <a href="profile.html?id=${talent.id}" class="btn btn-primary btn-sm" data-ar="عرض الملف" data-en="View Profile">
                    ${currentLang === 'en' ? 'View Profile' : 'عرض الملف'}
                </a>
                <button class="btn btn-outline btn-sm" onclick="contactTalent(${talent.id})" data-ar="تواصل" data-en="Contact">
                    ${currentLang === 'en' ? 'Contact' : 'تواصل'}
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Filter talents
 */
function filterTalents(query) {
    if (!query) {
        filteredTalents = [...allTalents];
    } else {
        query = query.toLowerCase();
        filteredTalents = allTalents.filter(talent => 
            talent.name.toLowerCase().includes(query) ||
            (talent.bio && talent.bio.toLowerCase().includes(query)) ||
            (talent.category && talent.category.toLowerCase().includes(query))
        );
    }
    renderTalents();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('talentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', window.debounce((e) => {
            filterTalents(e.target.value);
        }, 300));
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', async (e) => {
            currentCategory = e.target.value || null;
            await loadTalents();
        });
    }
}

/**
 * Contact talent
 */
async function contactTalent(talentId) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('site_current_user');
    if (!currentUser) {
        window.showToast('يجب تسجيل الدخول أولاً', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Redirect to chat
    window.location.href = `chat.html?user=${talentId}`;
}

/**
 * Helper functions
 */
function showLoading(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    if (window.showToast) {
        window.showToast(message, 'error');
    } else {
        alert(message);
    }
}

function getCategoryName(slug, lang = 'ar') {
    const categories = {
        photography: { ar: 'التصوير', en: 'Photography' },
        design: { ar: 'التصميم', en: 'Design' },
        writing: { ar: 'الكتابة', en: 'Writing' },
        video: { ar: 'المونتاج', en: 'Video Editing' },
        programming: { ar: 'البرمجة', en: 'Programming' },
        marketing: { ar: 'التسويق', en: 'Marketing' },
        voice: { ar: 'التعليق الصوتي', en: 'Voice Over' },
        translation: { ar: 'الترجمة', en: 'Translation' }
    };
    
    return categories[slug] ? categories[slug][lang] : slug;
}

// Make functions available globally
window.contactTalent = contactTalent;
window.filterTalents = filterTalents;
