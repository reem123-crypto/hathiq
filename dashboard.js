// ==================== Dashboard Data ====================
const dashboardData = {
    portfolio: [
        { id: 1, title: 'تصميم شعار', category: 'تصميم', image: '🎨' },
        { id: 2, title: 'موقع إلكتروني', category: 'برمجة', image: '💻' },
        { id: 3, title: 'تصوير فوتوغرافي', category: 'تصوير', image: '📸' },
        { id: 4, title: 'فيديو ترويجي', category: 'فيديو', image: '🎬' }
    ],
    products: [
        { id: 1, title: 'قالب تصميم', price: '50 ر.ع', status: 'active', statusText: 'نشط' },
        { id: 2, title: 'كورس تعليمي', price: '75 ر.ع', status: 'active', statusText: 'نشط' },
        { id: 3, title: 'حزمة أيقونات', price: '30 ر.ع', status: 'draft', statusText: 'مسودة' }
    ],
    workshops: [
        { id: 1, title: 'أساسيات التصميم الجرافيكي', date: '15 يناير 2024', instructor: 'أحمد السالمي' },
        { id: 2, title: 'تطوير المواقع الحديثة', date: '22 يناير 2024', instructor: 'فاطمة الحارثية' },
        { id: 3, title: 'التصوير الاحترافي', date: '5 فبراير 2024', instructor: 'سالم البلوشي' }
    ]
};

// ==================== Load Portfolio ====================
function loadPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!portfolioGrid) return;
    
    if (dashboardData.portfolio.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <h3 data-ar="لا توجد أعمال بعد" data-en="No works yet">لا توجد أعمال بعد</h3>
                <p data-ar="ابدأ بإضافة أعمالك لعرضها للعملاء" data-en="Start adding your works to showcase to clients">ابدأ بإضافة أعمالك لعرضها للعملاء</p>
            </div>
        `;
        return;
    }
    
    portfolioGrid.innerHTML = dashboardData.portfolio.map(item => `
        <div class="portfolio-item" data-id="${item.id}">
            <div class="portfolio-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>${item.title}</span>
            </div>
            <div class="portfolio-item-actions">
                <button class="item-action-btn edit" onclick="editPortfolioItem(${item.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="item-action-btn delete" onclick="deletePortfolioItem(${item.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== Load Products ====================
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    if (dashboardData.products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h3 data-ar="لا توجد منتجات بعد" data-en="No products yet">لا توجد منتجات بعد</h3>
                <p data-ar="أضف منتجاتك للبيع في المتجر" data-en="Add your products to sell in the store">أضف منتجاتك للبيع في المتجر</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = dashboardData.products.map(product => `
        <div class="product-item" data-id="${product.id}">
            <div class="product-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </div>
            <div class="product-info">
                <h4>${product.title}</h4>
                <div class="product-price">${product.price}</div>
                <span class="product-status ${product.status}">${product.statusText}</span>
            </div>
        </div>
    `).join('');
}

// ==================== Load Workshops ====================
function loadWorkshops() {
    const workshopsList = document.getElementById('workshopsList');
    
    if (!workshopsList) return;
    
    if (dashboardData.workshops.length === 0) {
        workshopsList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <h3 data-ar="لم تحضر أي ورش بعد" data-en="No workshops attended yet">لم تحضر أي ورش بعد</h3>
                <p data-ar="تصفح الورش المتاحة وسجل في ورشة" data-en="Browse available workshops and register">تصفح الورش المتاحة وسجل في ورشة</p>
            </div>
        `;
        return;
    }
    
    workshopsList.innerHTML = dashboardData.workshops.map(workshop => `
        <div class="workshop-item" data-id="${workshop.id}">
            <div class="workshop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            </div>
            <div class="workshop-info">
                <h4>${workshop.title}</h4>
                <div class="workshop-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${workshop.date}</span>
                    <span>•</span>
                    <span>${workshop.instructor}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== Portfolio Actions ====================
function editPortfolioItem(id) {
    const item = dashboardData.portfolio.find(p => p.id === id);
    if (item) {
        showToast(`تعديل: ${item.title}`, 'info');
        // Here you would open a modal or navigate to edit page
    }
}

function deletePortfolioItem(id) {
    if (confirm('هل أنت متأكد من حذف هذا العمل؟')) {
        dashboardData.portfolio = dashboardData.portfolio.filter(p => p.id !== id);
        loadPortfolio();
        showToast('تم حذف العمل بنجاح', 'success');
    }
}

// ==================== Add Work Button ====================
document.addEventListener('DOMContentLoaded', function() {
    const addWorkBtn = document.getElementById('addWorkBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    
    if (addWorkBtn) {
        addWorkBtn.addEventListener('click', function() {
            showToast('ميزة إضافة عمل قريباً', 'info');
            // Here you would open a modal to add new work
        });
    }
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            showToast('ميزة إضافة منتج قريباً', 'info');
            // Here you would open a modal to add new product
        });
    }
    
    // Load all data
    loadPortfolio();
    loadProducts();
    loadWorkshops();
    
    // Update language when changed
    window.addEventListener('languageChanged', function(e) {
        const lang = e.detail.lang;
        updateDashboardLanguage(lang);
    });
});

// ==================== Update Dashboard Language ====================
function updateDashboardLanguage(lang) {
    // Update product status text
    const productStatuses = document.querySelectorAll('.product-status');
    productStatuses.forEach(status => {
        if (status.classList.contains('active')) {
            status.textContent = lang === 'ar' ? 'نشط' : 'Active';
        } else if (status.classList.contains('draft')) {
            status.textContent = lang === 'ar' ? 'مسودة' : 'Draft';
        }
    });
    
    // Update empty states
    const emptyStates = document.querySelectorAll('.empty-state');
    emptyStates.forEach(state => {
        const h3 = state.querySelector('h3');
        const p = state.querySelector('p');
        if (h3 && h3.hasAttribute('data-ar') && h3.hasAttribute('data-en')) {
            h3.textContent = lang === 'ar' ? h3.getAttribute('data-ar') : h3.getAttribute('data-en');
        }
        if (p && p.hasAttribute('data-ar') && p.hasAttribute('data-en')) {
            p.textContent = lang === 'ar' ? p.getAttribute('data-ar') : p.getAttribute('data-en');
        }
    });
}

// ==================== Stats Animation ====================
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/,/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    });
}

// Animate stats on page load
window.addEventListener('load', () => {
    setTimeout(animateStats, 300);
});
