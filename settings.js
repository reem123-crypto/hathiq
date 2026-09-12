// Settings Page JavaScript

// Sample orders data
const myOrdersData = [
    {
        id: 1,
        title: 'تصوير حفل زفاف',
        client: 'محمد الشكيلي',
        status: 'in-progress',
        date: '2024-04-15',
        price: 250
    },
    {
        id: 2,
        title: 'تصوير منتجات',
        client: 'فاطمة البلوشية',
        status: 'pending',
        date: '2024-04-18',
        price: 150
    },
    {
        id: 3,
        title: 'مونتاج فيديو ترويجي',
        client: 'سالم الحارثي',
        status: 'completed',
        date: '2024-04-10',
        price: 200
    }
];

document.addEventListener('DOMContentLoaded', async function() {
    initializeSettingsNavigation();
    initializeProfileForm();
    loadMyOrders();
    await hydrateProfileFromSession();
});

async function getCurrentSessionUser() {
    if (typeof window.getSiteCurrentUserFromAppwrite === 'function') {
        try {
            const user = await window.getSiteCurrentUserFromAppwrite();
            if (user) return user;
        } catch (error) {
            console.warn('Failed to load user session:', error);
        }
    }

    try {
        return JSON.parse(localStorage.getItem('site_current_user') || 'null');
    } catch (error) {
        return null;
    }
}

function getRoleLabel(role) {
    const normalizedRole = (role || '').toString().trim().toLowerCase();
    if (normalizedRole === 'admin') return 'إدارة';
    if (normalizedRole === 'talent') return 'موهوب';
    if (normalizedRole === 'client') return 'مستفيد';
    return 'مستخدم';
}

function populateProfileFromSession(user) {
    if (!user) return;

    const avatarPlaceholder = document.querySelector('.user-avatar .avatar-placeholder');
    if (avatarPlaceholder) {
        const avatarText = user.avatar || user.firstName || user.name || '👤';
        avatarPlaceholder.textContent = avatarText.toString().charAt(0) || '👤';
    }

    const userNameElement = document.querySelector('.user-profile-card .user-name');
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'المستخدم';
    }

    const userEmailElement = document.querySelector('.user-profile-card .user-email');
    if (userEmailElement) {
        userEmailElement.textContent = user.email || 'لا يوجد بريد';
    }

    const userBadgeElement = document.querySelector('.user-profile-card .user-badge');
    if (userBadgeElement) {
        userBadgeElement.textContent = getRoleLabel(user.role);
    }

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const bioInput = document.getElementById('bio');
    const categorySelect = document.getElementById('category');
    const locationInput = document.getElementById('location');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    if (firstNameInput) firstNameInput.value = user.firstName || '';
    if (lastNameInput) lastNameInput.value = user.lastName || '';
    if (bioInput) bioInput.value = user.bio || '';
    if (locationInput) locationInput.value = user.city || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (emailInput) emailInput.value = user.email || '';

    if (categorySelect) {
        const categoryValue = (user.category || '').toString().trim().toLowerCase();
        let mappedCategory = '';

        if (['photography', 'تصوير', 'photo'].includes(categoryValue)) {
            mappedCategory = 'photography';
        } else if (['design', 'تصميم'].includes(categoryValue)) {
            mappedCategory = 'design';
        } else if (['writing', 'كتابة'].includes(categoryValue)) {
            mappedCategory = 'writing';
        } else if (['programming', 'برمجة'].includes(categoryValue)) {
            mappedCategory = 'programming';
        } else {
            mappedCategory = categoryValue || 'photography';
        }

        categorySelect.value = mappedCategory;
    }
}

async function hydrateProfileFromSession() {
    const currentUser = await getCurrentSessionUser();
    if (currentUser) {
        populateProfileFromSession(currentUser);
    }
}

// Initialize settings navigation
function initializeSettingsNavigation() {
    const navBtns = document.querySelectorAll('.settings-nav-btn');
    const sections = document.querySelectorAll('.settings-section-new');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            
            // Update active nav button
            navBtns.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Initialize profile form
function initializeProfileForm() {
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                bio: document.getElementById('bio').value,
                category: document.getElementById('category').value,
                city: document.getElementById('location').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value
            };
            
            try {
                const currentUser = await getCurrentSessionUser();
                
                if (!currentUser) {
                    alert('يرجى تسجيل الدخول أولاً');
                    window.location.href = 'login.html';
                    return;
                }
                
                const updatedUser = {
                    ...currentUser,
                    ...formData,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    name: formData.name,
                    bio: formData.bio,
                    category: formData.category,
                    city: formData.city,
                    phone: formData.phone,
                    email: formData.email
                };
                
                if (currentUser.profileId && window.AppwriteHelper) {
                    await window.AppwriteHelper.init();
                    await window.AppwriteHelper.updateDocument('users', currentUser.profileId, {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        type: updatedUser.role,
                        category: formData.category,
                        bio: formData.bio,
                        city: formData.city,
                        experience: updatedUser.experience || 0,
                        updated_at: new Date().toISOString()
                    });
                } else {
                    console.warn('AppwriteHelper not available, saving to localStorage only');
                }
                
                if (typeof window.setSiteCurrentUser === 'function') {
                    window.setSiteCurrentUser(updatedUser);
                } else {
                    localStorage.setItem('site_current_user', JSON.stringify(updatedUser));
                }

                populateProfileFromSession(updatedUser);
                
                alert('تم حفظ التغييرات بنجاح');
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('خطأ في حفظ البيانات: ' + error.message);
            }
        });
    }
}

// Load my orders
function loadMyOrders() {
    const ordersList = document.getElementById('myOrdersList');
    
    if (!ordersList) return;
    
    if (myOrdersData.length === 0) {
        ordersList.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl); color: var(--text-secondary);">
                <p>لا توجد طلبات حالياً</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = myOrdersData.map(order => `
        <div class="order-item">
            <div class="order-info">
                <div class="order-header">
                    <h4 class="order-title">${order.title}</h4>
                    <span class="order-status ${order.status}">
                        ${getStatusText(order.status)}
                    </span>
                </div>
                <div class="order-meta">
                    <div class="order-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>${order.client}</span>
                    </div>
                    <div class="order-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${formatDate(order.date)}</span>
                    </div>
                    <div class="order-meta-item">
                        <span style="font-weight: 600; color: var(--primary-color);">${order.price} ر.ع</span>
                    </div>
                </div>
            </div>
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="viewOrder(${order.id})">
                    عرض التفاصيل
                </button>
                ${order.status === 'pending' ? `
                    <button class="order-action-btn secondary" onclick="acceptOrder(${order.id})">
                        قبول
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Get status text
function getStatusText(status) {
    const statusTexts = {
        'pending': 'قيد الانتظار',
        'in-progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusTexts[status] || status;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
}

// View order details
function viewOrder(orderId) {
    const order = myOrdersData.find(o => o.id === orderId);
    if (order) {
        alert(`تفاصيل الطلب:\n\nالعنوان: ${order.title}\nالعميل: ${order.client}\nالحالة: ${getStatusText(order.status)}\nالتاريخ: ${formatDate(order.date)}\nالسعر: ${order.price} ر.ع`);
    }
}

// Accept order
function acceptOrder(orderId) {
    const order = myOrdersData.find(o => o.id === orderId);
    if (order) {
        order.status = 'in-progress';
        loadMyOrders();
        alert('تم قبول الطلب بنجاح!');
    }
}

// ==================== Settings Navigation (New) ====================
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Theme toggle
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
        });
    });
    
    // Save buttons
    const saveButtons = document.querySelectorAll('.settings-section .btn-primary');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('تم حفظ التغييرات بنجاح', 'success');
        });
    });
});

// ==================== Theme System ====================
function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.style.setProperty('--bg-color', '#0f172a');
        root.style.setProperty('--surface-color', '#1e293b');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--border-color', '#334155');
        
        localStorage.setItem('sayt_theme', 'dark');
        showToast('تم تفعيل الوضع الليلي', 'success');
    } else {
        root.style.setProperty('--bg-color', '#f8fafc');
        root.style.setProperty('--surface-color', '#ffffff');
        root.style.setProperty('--text-primary', '#0f172a');
        root.style.setProperty('--text-secondary', '#475569');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--border-color', '#e2e8f0');
        
        localStorage.setItem('sayt_theme', 'light');
        showToast('تم تفعيل الوضع النهاري', 'success');
    }
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('sayt_theme') || 'light';
    const themeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
    if (themeOption) {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        themeOption.classList.add('active');
        if (savedTheme === 'dark') {
            applyTheme('dark');
        }
    }
});
