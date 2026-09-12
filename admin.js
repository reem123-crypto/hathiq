// ==================== Admin Data ====================
const defaultAdminUsers = [
    { id: 'u_talent_1', firstName: 'أحمد', lastName: 'المعمري', email: 'ahmed@example.com', role: 'talent', status: 'active', joinDate: '2024-01-15', avatar: 'أ' },
    { id: 'u_talent_2', firstName: 'فاطمة', lastName: 'الحارثية', email: 'fatima@example.com', role: 'talent', status: 'active', joinDate: '2024-01-20', avatar: 'ف' },
    { id: 'u_client_1', firstName: 'سالم', lastName: 'البلوشي', email: 'salem@example.com', role: 'client', status: 'active', joinDate: '2024-02-01', avatar: 'س' },
    { id: 'u_talent_3', firstName: 'مريم', lastName: 'الشكيلية', email: 'maryam@example.com', role: 'talent', status: 'pending', joinDate: '2024-02-10', avatar: 'م' },
    { id: 'u_client_2', firstName: 'خالد', lastName: 'الهنائي', email: 'khalid@example.com', role: 'client', status: 'active', joinDate: '2024-02-15', avatar: 'خ' }
];

const adminData = {
    categories: [
        { id: 1, name: 'تصميم جرافيكي', count: 234, icon: 'palette' },
        { id: 2, name: 'برمجة وتطوير', count: 189, icon: 'code' },
        { id: 3, name: 'تصوير', count: 156, icon: 'camera' },
        { id: 4, name: 'كتابة محتوى', count: 145, icon: 'edit' },
        { id: 5, name: 'تسويق رقمي', count: 123, icon: 'trending' },
        { id: 6, name: 'فيديو ومونتاج', count: 98, icon: 'video' }
    ],
    reports: [
        { id: 1, title: 'محتوى غير لائق', description: 'تم الإبلاغ عن محتوى غير لائق في ملف المستخدم', time: 'منذ ساعة', reporter: 'أحمد' },
        { id: 2, title: 'انتهاك حقوق الملكية', description: 'استخدام صور محمية بحقوق الطبع', time: 'منذ 3 ساعات', reporter: 'فاطمة' },
        { id: 3, title: 'سلوك غير مهني', description: 'تعامل غير احترافي مع العميل', time: 'منذ 5 ساعات', reporter: 'سالم' }
    ],
    activities: [
        { id: 1, text: 'انضم مستخدم جديد: مريم الشكيلية', time: 'منذ 10 دقائق', icon: 'user-plus' },
        { id: 2, text: 'تم نشر منتج جديد في المتجر', time: 'منذ 30 دقيقة', icon: 'shopping' },
        { id: 3, text: 'تم تحديث تصنيف التصميم الجرافيكي', time: 'منذ ساعة', icon: 'edit' },
        { id: 4, text: 'تم حذف بلاغ بعد المراجعة', time: 'منذ ساعتين', icon: 'check' }
    ]
};

function getAdminUsers() {
    try {
        const storedUsers = JSON.parse(localStorage.getItem('site_users') || '[]');
        if (storedUsers.length) {
            return storedUsers.map(u => ({
                ...u,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
                type: u.role === 'talent' ? 'موهبة' : u.role === 'admin' ? 'أدمن' : 'عميل'
            }));
        }
    } catch (error) {
        console.warn('Failed to parse stored users', error);
    }
    return defaultAdminUsers.map(u => ({
        ...u,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        type: u.role === 'talent' ? 'موهبة' : u.role === 'admin' ? 'أدمن' : 'عميل'
    }));
}

function saveAdminUsers(users) {
    const normalized = users.map(user => ({
        ...user,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || ''
    }));
    localStorage.setItem('site_users', JSON.stringify(normalized));
}

// ==================== Load Users Table ====================
function loadUsers(filter = 'all') {
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) return;
    
    let users = getAdminUsers();
    
    if (filter !== 'all') {
        if (filter === 'talents') {
            users = users.filter(u => u.type === 'موهبة');
        } else if (filter === 'clients') {
            users = users.filter(u => u.type === 'عميل');
        } else if (filter === 'pending') {
            users = users.filter(u => u.status === 'pending');
        }
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-cell">
                    <div class="user-avatar">${user.avatar || user.name?.charAt(0) || 'م'}</div>
                    <div class="user-info">
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.type}</td>
            <td>
                <span class="status-badge ${user.status}">
                    ${user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'قيد المراجعة' : 'موقوف'}
                </span>
            </td>
            <td>${user.joinDate || 'غير محدد'}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn view" onclick="viewUser('${user.id}')" title="عرض">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-btn edit" onclick="editUser('${user.id}')" title="تعديل">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser('${user.id}')" title="حذف">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== Load Categories ====================
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    if (!grid) return;
    
    const iconMap = {
        'palette': '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
        'code': '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
        'camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
        'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
        'trending': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
        'video': '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'
    };
    
    grid.innerHTML = adminData.categories.map(cat => `
        <div class="category-card-admin" data-id="${cat.id}">
            <div class="category-actions">
                <button class="action-btn edit" onclick="editCategory(${cat.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="deleteCategory(${cat.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            <div class="category-icon-admin">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${iconMap[cat.icon] || iconMap['palette']}
                </svg>
            </div>
            <h4>${cat.name}</h4>
            <div class="category-count-admin">${cat.count} موهبة</div>
        </div>
    `).join('');
}

// ==================== Load Reports ====================
function loadReports() {
    const list = document.getElementById('reportsList');
    
    if (!list) return;
    
    list.innerHTML = adminData.reports.map(report => `
        <div class="report-item" data-id="${report.id}">
            <div class="report-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <div class="report-content">
                <div class="report-header">
                    <div class="report-title">${report.title}</div>
                    <div class="report-time">${report.time}</div>
                </div>
                <div class="report-description">${report.description}</div>
                <div class="report-actions">
                    <button class="btn btn-outline btn-sm" onclick="reviewReport(${report.id})">
                        <span data-ar="مراجعة" data-en="Review">مراجعة</span>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="dismissReport(${report.id})">
                        <span data-ar="رفض" data-en="Dismiss">رفض</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update reports count
    const reportsCount = document.getElementById('reportsCount');
    if (reportsCount) {
        reportsCount.textContent = adminData.reports.length;
    }
}

// ==================== Load Activity ====================
function loadActivity() {
    const list = document.getElementById('adminActivityList');
    
    if (!list) return;
    
    const iconMap = {
        'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
        'shopping': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
        'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
        'check': '<polyline points="20 6 9 17 4 12"></polyline>'
    };
    
    list.innerHTML = adminData.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${iconMap[activity.icon] || iconMap['check']}
                </svg>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// ==================== User Actions ====================
function viewUser(id) {
    const user = adminData.users.find(u => u.id === id);
    if (user) {
        showToast(`عرض ملف: ${user.name}`, 'info');
        // Here you would navigate to user profile or open modal
    }
}

function editUser(id) {
    const user = adminData.users.find(u => u.id === id);
    if (user) {
        showToast(`تعديل: ${user.name}`, 'info');
        // Here you would open edit modal
    }
}

function deleteUser(id) {
    const users = getAdminUsers();
    const user = users.find(u => u.id === id);
    if (user && confirm(`هل أنت متأكد من حذف المستخدم: ${user.name}؟`)) {
        const updatedUsers = users.filter(u => u.id !== id);
        saveAdminUsers(updatedUsers);
        loadUsers();
        showToast('تم حذف المستخدم بنجاح', 'success');
    }
}

// ==================== Category Actions ====================
function editCategory(id) {
    const category = adminData.categories.find(c => c.id === id);
    if (category) {
        showToast(`تعديل تصنيف: ${category.name}`, 'info');
        // Here you would open edit modal
    }
}

function deleteCategory(id) {
    const category = adminData.categories.find(c => c.id === id);
    if (category && confirm(`هل أنت متأكد من حذف التصنيف: ${category.name}؟`)) {
        adminData.categories = adminData.categories.filter(c => c.id !== id);
        loadCategories();
        showToast('تم حذف التصنيف بنجاح', 'success');
    }
}

// ==================== Report Actions ====================
function reviewReport(id) {
    const report = adminData.reports.find(r => r.id === id);
    if (report) {
        showToast(`مراجعة البلاغ: ${report.title}`, 'info');
        // Here you would open review modal
    }
}

function dismissReport(id) {
    if (confirm('هل أنت متأكد من رفض هذا البلاغ؟')) {
        adminData.reports = adminData.reports.filter(r => r.id !== id);
        loadReports();
        showToast('تم رفض البلاغ', 'success');
    }
}

// ==================== Search & Filter ====================
document.addEventListener('DOMContentLoaded', function() {
    // User search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#usersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        }, 300));
    }
    
    // User filter
    const userFilter = document.getElementById('userFilter');
    if (userFilter) {
        userFilter.addEventListener('change', function(e) {
            loadUsers(e.target.value);
        });
    }
    
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showToast('ميزة إضافة مستخدم قريباً', 'info');
            // Here you would open add user modal
        });
    }
    
    // Add category button
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            showToast('ميزة إضافة تصنيف قريباً', 'info');
            // Here you would open add category modal
        });
    }
    
    // Notifications button
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showToast('لديك 5 إشعارات جديدة', 'info');
            // Here you would open notifications panel
        });
    }
    
    // Load all data
    loadUsers();
    loadCategories();
    loadReports();
    loadActivity();
    
    // Update language when changed
    window.addEventListener('languageChanged', function(e) {
        const lang = e.detail.lang;
        updateAdminLanguage(lang);
    });
});

// ==================== Update Admin Language ====================
function updateAdminLanguage(lang) {
    // Update status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        if (badge.classList.contains('active')) {
            badge.textContent = lang === 'ar' ? 'نشط' : 'Active';
        } else if (badge.classList.contains('pending')) {
            badge.textContent = lang === 'ar' ? 'قيد المراجعة' : 'Pending';
        } else if (badge.classList.contains('suspended')) {
            badge.textContent = lang === 'ar' ? 'موقوف' : 'Suspended';
        }
    });
    
    // Update table headers
    const tableHeaders = document.querySelectorAll('.admin-table th');
    tableHeaders.forEach(th => {
        if (th.hasAttribute('data-ar') && th.hasAttribute('data-en')) {
            th.textContent = lang === 'ar' ? th.getAttribute('data-ar') : th.getAttribute('data-en');
        }
    });
    
    // Update user types
    const userTypes = document.querySelectorAll('.admin-table tbody tr td:nth-child(2)');
    userTypes.forEach(type => {
        if (type.textContent === 'موهبة') {
            type.textContent = lang === 'ar' ? 'موهبة' : 'Talent';
        } else if (type.textContent === 'عميل') {
            type.textContent = lang === 'ar' ? 'عميل' : 'Client';
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
