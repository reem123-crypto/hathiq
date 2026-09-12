// ==================== Mobile Menu Toggle ====================
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const body = document.body;

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const navLinks = mobileMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

function getSiteUsers() {
    try {
        return JSON.parse(localStorage.getItem('site_users') || '[]');
    } catch (error) {
        return [];
    }
}

function setSiteUsers(users) {
    localStorage.setItem('site_users', JSON.stringify(users));
}

function getSiteCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('site_current_user') || 'null');
    } catch (error) {
        return null;
    }
}

function createSessionUser(sourceUser = {}, fallbackUser = null) {
    const baseUser = fallbackUser || {};
    const sourceName = sourceUser.name || sourceUser.fullName || '';
    const nameParts = (sourceName || `${sourceUser.firstName || ''} ${sourceUser.lastName || ''}`.trim())
        .split(/\s+/)
        .filter(Boolean);

    const firstName = sourceUser.firstName || nameParts[0] || baseUser.firstName || '';
    const lastName = sourceUser.lastName || nameParts.slice(1).join(' ') || baseUser.lastName || '';

    return {
        id: sourceUser.id || baseUser.id || '',
        firstName,
        lastName,
        email: sourceUser.email || baseUser.email || '',
        role: normalizeRole(sourceUser.role || baseUser.role || ''),
        phone: sourceUser.phone || baseUser.phone || '',
        category: sourceUser.category || baseUser.category || '',
        bio: sourceUser.bio || baseUser.bio || '',
        experience: sourceUser.experience ?? baseUser.experience ?? '',
        city: sourceUser.city || baseUser.city || '',
        portfolio: sourceUser.portfolio || baseUser.portfolio || '',
        registeredAt: sourceUser.registeredAt || baseUser.registeredAt || '',
        avatar: sourceUser.avatar || baseUser.avatar || '',
        profileId: sourceUser.profileId || baseUser.profileId || null,
        sessionSource: sourceUser.sessionSource || baseUser.sessionSource || '',
        isDefaultProfile: false
    };
}

function saveSessionUser(user) {
    const safeUser = user ? createSessionUser(user, getSiteCurrentUser()) : null;
    localStorage.setItem('site_current_user', JSON.stringify(safeUser));
    localStorage.setItem('site_session', JSON.stringify({
        isLoggedIn: !!safeUser,
        user: safeUser,
        loggedInAt: new Date().toISOString(),
        source: safeUser?.sessionSource || 'default'
    }));
    return safeUser;
}

async function getSiteCurrentUserFromAppwrite() {
    const localUser = getSiteCurrentUser();

    if (!window.AppwriteHelper || !window.AppwriteHelper.isReady()) {
        return localUser ? saveSessionUser(localUser) : null;
    }
    
    try {
        const account = await window.AppwriteHelper.getCurrentAccount();
        if (!account) return localUser ? saveSessionUser(localUser) : null;
        
        // Get user profile from 'users' collection
        const userProfiles = await window.AppwriteHelper.listDocuments('users', [
            window.AppwriteHelper.Query ? window.AppwriteHelper.Query.equal('accountId', account.$id) : null
        ].filter(q => q));
        
        const profile = userProfiles.documents && userProfiles.documents.length > 0 ? userProfiles.documents[0] : null;
        const hydratedUser = createSessionUser({
            id: account.$id,
            name: account.name || '',
            firstName: account.name ? account.name.split(' ')[0] : (account.email || '').split('@')[0],
            lastName: account.name ? account.name.split(' ').slice(1).join(' ') : '',
            email: account.email,
            role: account.prefs?.role || profile?.type || '',
            phone: profile?.phone || account.prefs?.phone || '',
            category: profile?.category || account.prefs?.category || '',
            bio: profile?.bio || account.prefs?.bio || '',
            experience: profile?.experience || account.prefs?.experience || '',
            city: profile?.city || account.prefs?.city || '',
            portfolio: profile?.portfolio || account.prefs?.portfolio || '',
            registeredAt: profile?.created_at || account.prefs?.registeredAt || '',
            avatar: profile?.avatar || (account.name ? account.name.charAt(0) : ''),
            profileId: profile?.$id || null,
            sessionSource: profile ? 'database' : '',
            isDefaultProfile: false
        }, localUser || {});

        return saveSessionUser(hydratedUser);
    } catch (error) {
        console.warn('Failed to get user from Appwrite:', error);
        return localUser ? saveSessionUser(localUser) : null;
    }
}

// Make function globally available
window.getSiteCurrentUserFromAppwrite = getSiteCurrentUserFromAppwrite;
window.createSessionUser = createSessionUser;

function setSiteCurrentUser(user) {
    const safeUser = user ? createSessionUser(user, getSiteCurrentUser()) : null;
    saveSessionUser(safeUser);
    
    // Also update in Appwrite if available
    if (window.AppwriteHelper && safeUser?.profileId) {
        window.AppwriteHelper.updateDocument('users', safeUser.profileId, {
            name: `${safeUser.firstName} ${safeUser.lastName}`,
            email: safeUser.email,
            phone: safeUser.phone,
            type: safeUser.role,
            category: safeUser.category,
            bio: safeUser.bio,
            experience: parseInt(safeUser.experience) || 0,
            city: safeUser.city,
            avatar: safeUser.avatar,
            portfolio: safeUser.portfolio,
            updated_at: new Date().toISOString()
        }).catch(error => console.warn('Failed to update user in Appwrite:', error));
    }
}

function clearSiteCurrentUser() {
    localStorage.removeItem('site_current_user');
    localStorage.removeItem('site_session');
}

function seedDefaultData() {
    if (!localStorage.getItem('site_users')) {
        const defaultUsers = [
            {
                id: 'u_admin',
                firstName: 'عبدالله',
                lastName: 'العماني',
                email: 'admin@hathiq.com',
                phone: '+96891234567',
                password: 'Admin123!',
                role: 'admin',
                category: '',
                bio: 'مشرف عام على منصة حاذق',
                experience: '10',
                city: 'مسقط',
                portfolio: '',
                registeredAt: '2024-01-10',
                avatar: 'أ'
            },
            {
                id: 'u_talent_1',
                firstName: 'سارة',
                lastName: 'الخالدي',
                email: 'sarah.talent@example.com',
                phone: '+96891230001',
                password: 'Talent123!',
                role: 'talent',
                category: 'تصوير',
                bio: 'مصورة محترفة متخصصة في الفعاليات والأفراد.',
                experience: '5',
                city: 'مسقط',
                portfolio: 'https://portfolio.example.com/sarah',
                registeredAt: '2024-02-05',
                avatar: 'س'
            },
            {
                id: 'u_client_1',
                firstName: 'فاطمة',
                lastName: 'الحارثية',
                email: 'fatima.client@example.com',
                phone: '+96891230002',
                password: 'Client123!',
                role: 'client',
                category: '',
                bio: 'أبحث عن أفضل المواهب لتنفيذ مشاريعي.',
                experience: '',
                city: 'العبري',
                portfolio: '',
                registeredAt: '2024-03-01',
                avatar: 'ف'
            }
        ];

        setSiteUsers(defaultUsers);
    }

    if (!localStorage.getItem('unread_notifications')) {
        localStorage.setItem('unread_notifications', '4');
    }
    if (!localStorage.getItem('cart_items_count')) {
        localStorage.setItem('cart_items_count', '2');
    }
}

function normalizeRole(role) {
    const normalized = (role || 'guest').toString().trim().toLowerCase();
    if (['admin', 'administrator', 'superadmin'].includes(normalized)) return 'admin';
    if (['talent', 'موهوب', 'freelancer'].includes(normalized)) return 'talent';
    if (['client', 'beneficiary', 'customer', 'مستفيد'].includes(normalized)) return 'client';
    return 'guest';
}

function getRoleHomePage(role) {
    const normalizedRole = normalizeRole(role);
    if (normalizedRole === 'admin') return 'admin.html';
    if (normalizedRole === 'talent') return 'dashboard.html';
    if (normalizedRole === 'client') return 'beneficiary.html';
    return 'index.html';
}

function getAllowedNavLinksByRole(role) {
    const normalizedRole = normalizeRole(role);
    const roles = {
        guest: ['index.html', 'about.html', 'faq.html', 'contact.html', 'talents.html', 'workshops.html', 'community.html', 'photography-talents.html', 'workshops-photography.html', 'login.html', 'register.html', 'forgot-password.html'],
        admin: ['index.html', 'about.html', 'faq.html', 'contact.html', 'talents.html', 'workshops.html', 'community.html', 'photography-talents.html', 'workshops-photography.html', 'admin.html', 'dashboard.html', 'profile.html', 'my-profile.html', 'notifications.html', 'chat.html', 'settings.html', 'store.html', 'cart.html', 'request.html', 'beneficiary.html', 'talents-list.html', 'workshops-design.html', 'workshops-photography.html'],
        talent: ['index.html', 'about.html', 'faq.html', 'contact.html', 'talents.html', 'workshops.html', 'community.html', 'photography-talents.html', 'workshops-photography.html', 'dashboard.html', 'profile.html', 'my-profile.html', 'notifications.html', 'chat.html', 'settings.html', 'store.html', 'cart.html', 'request.html', 'beneficiary.html', 'talents-list.html', 'workshops-design.html', 'workshops-photography.html'],
        client: ['index.html', 'about.html', 'faq.html', 'contact.html', 'talents.html', 'workshops.html', 'community.html', 'photography-talents.html', 'workshops-photography.html', 'dashboard.html', 'profile.html', 'my-profile.html', 'notifications.html', 'chat.html', 'settings.html', 'store.html', 'cart.html', 'request.html', 'beneficiary.html', 'talents-list.html']
    };
    return roles[normalizedRole] || roles.guest;
}

function getDisplayFullName(user) {
    if (!user) return 'المستخدم';
    const firstName = (user.firstName || '').toString().trim();
    const lastName = (user.lastName || '').toString().trim();
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.name || 'المستخدم';
}

function getDisplayRoleLabel(user) {
    const normalizedRole = normalizeRole(user?.role);
    if (normalizedRole === 'admin') return 'إدارة';
    if (normalizedRole === 'talent') return 'موهوب';
    if (normalizedRole === 'client') return 'مستفيد';
    return 'مستخدم';
}

function applyUserDisplayData(user) {
    if (!user) return;

    const displayName = getDisplayFullName(user);
    const roleLabel = getDisplayRoleLabel(user);
    const avatarText = (user.avatar || displayName.charAt(0) || '👤').toString();

    document.querySelectorAll('.user-name, .user-name-mobile').forEach(element => {
        element.textContent = displayName;
    });

    document.querySelectorAll('.user-email').forEach(element => {
        element.textContent = user.email || 'لا يوجد بريد';
    });

    document.querySelectorAll('.user-badge').forEach(element => {
        element.textContent = roleLabel;
    });

    document.querySelectorAll('.avatar-placeholder').forEach(element => {
        element.textContent = avatarText;
    });

    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) {
        headerUserName.textContent = displayName;
    }

    const mobileUserName = document.getElementById('mobileUserName');
    if (mobileUserName) {
        mobileUserName.textContent = displayName;
    }

    const welcomeHeading = document.querySelector('.welcome-section h1, .admin-welcome h1');
    if (welcomeHeading) {
        welcomeHeading.textContent = `مرحباً، ${displayName}`;
    }

    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = displayName;
    }

    const profileCategory = document.getElementById('profileCategory');
    if (profileCategory) {
        profileCategory.textContent = user.category || (user.role === 'admin' ? 'أدمن' : 'مستخدم');
    }

    const profileCity = document.getElementById('profileCity');
    if (profileCity) {
        profileCity.textContent = user.city || 'غير محدد';
    }

    const profileBio = document.getElementById('profileBio');
    if (profileBio) {
        profileBio.textContent = user.bio || 'هذا الملف مُنشأ تلقائياً. يمكنك تحديث بياناتك في أي وقت.';
    }

    const completedProjects = document.getElementById('completedProjects');
    if (completedProjects) {
        completedProjects.textContent = user.role === 'talent' ? '24' : '0';
    }

    const yearsExperience = document.getElementById('yearsExperience');
    if (yearsExperience) {
        yearsExperience.textContent = user.experience ? `${user.experience}+` : '0+';
    }

    const workType = document.getElementById('workType');
    if (workType) {
        workType.textContent = user.role === 'talent' ? 'فرد' : user.role === 'admin' ? 'مشرف' : 'عميل';
    }

    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.textContent = avatarText;
    }
}

async function updateUserUI() {
    const user = await getSiteCurrentUserFromAppwrite();
    
    // Update header menu
    const userMenu = document.getElementById('userMenu');
    const loginMenu = document.getElementById('loginMenu');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileLoginMenu = document.getElementById('mobileLoginMenu');
    
    if (user) {
        // Show user menu, hide login menu
        if (userMenu) userMenu.style.display = 'flex';
        if (loginMenu) loginMenu.style.display = 'none';
        if (mobileUserMenu) mobileUserMenu.style.display = 'block';
        if (mobileLoginMenu) mobileLoginMenu.style.display = 'none';
    } else {
        // Show login menu, hide user menu
        if (userMenu) userMenu.style.display = 'none';
        if (loginMenu) loginMenu.style.display = 'flex';
        if (mobileUserMenu) mobileUserMenu.style.display = 'none';
        if (mobileLoginMenu) mobileLoginMenu.style.display = 'block';
        return;
    }

    applyUserDisplayData(user);
}

function ensureHeaderUserMenu() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Desktop menu
    if (!headerActions.querySelector('#loginMenu')) {
        const loginMenu = document.createElement('div');
        loginMenu.className = 'login-menu';
        loginMenu.id = 'loginMenu';
        loginMenu.innerHTML = `
            <a href="login.html" class="btn btn-sm btn-outline">تسجيل الدخول</a>
            <a href="register.html" class="btn btn-sm btn-primary">إنشاء حساب</a>
        `;
        headerActions.appendChild(loginMenu);
    }

    if (!headerActions.querySelector('#userMenu')) {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.id = 'userMenu';
        userMenu.style.display = 'none';
        userMenu.innerHTML = `
            <span class="user-name" id="headerUserName"></span>
            <button class="btn btn-sm btn-outline logout-btn" id="logoutBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>تسجيل الخروج</span>
            </button>
        `;
        headerActions.appendChild(userMenu);
    }

    // Mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        const mobileLoginMenu = mobileMenu.querySelector('#mobileLoginMenu');
        const mobileUserMenu = mobileMenu.querySelector('#mobileUserMenu');

        if (!mobileLoginMenu) {
            const actionGroup = document.createElement('div');
            actionGroup.className = 'menu-actions';
            actionGroup.id = 'mobileLoginMenu';
            actionGroup.innerHTML = `
                <a href="login.html" class="btn btn-outline" data-ar="تسجيل الدخول" data-en="Login">تسجيل الدخول</a>
                <a href="register.html" class="btn btn-primary" data-ar="انضم كموهوب" data-en="Join">انضم كموهوب</a>
            `;
            mobileMenu.appendChild(actionGroup);
        }

        if (!mobileUserMenu) {
            const mobileUserActions = document.createElement('div');
            mobileUserActions.className = 'menu-actions';
            mobileUserActions.id = 'mobileUserMenu';
            mobileUserActions.style.display = 'none';
            mobileUserActions.innerHTML = `
                <p class="user-name-mobile" id="mobileUserName"></p>
                <button class="btn btn-outline btn-block logout-btn" id="mobileLogoutBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span data-ar="تسجيل الخروج" data-en="Logout">تسجيل الخروج</span>
                </button>
            `;
            mobileMenu.appendChild(mobileUserActions);
        }
    }
}

async function redirectBasedOnPage() {
    const currentUser = await getSiteCurrentUserFromAppwrite();
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || 'index.html';
    const userRole = normalizeRole(currentUser?.role);
    
    const protectedPages = {
        'admin.html': ['admin'],
        'dashboard.html': ['admin', 'talent', 'client'],
        'profile.html': ['admin', 'talent', 'client'],
        'my-profile.html': ['admin', 'talent', 'client'],
        'notifications.html': ['admin', 'talent', 'client'],
        'chat.html': ['admin', 'talent', 'client'],
        'settings.html': ['admin', 'talent', 'client'],
        'store.html': ['client', 'admin', 'talent'],
        'cart.html': ['client', 'admin', 'talent'],
        'request.html': ['client', 'admin'],
        'beneficiary.html': ['client', 'admin'],
        'talents-list.html': ['admin', 'talent', 'client'],
        'workshops-design.html': ['admin', 'talent', 'client'],
        'workshops-photography.html': ['admin', 'talent', 'client']
    };

    // Auth pages - redirect if user already logged in
    if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'forgot-password.html') {
        if (currentUser) {
            window.location.href = getRoleHomePage(userRole);
        }
        return; // Allow access to auth pages if not logged in
    }

    if (currentPage === '404.html') {
        return; // Always allow the 404 page
    }

    // Protected pages
    if (protectedPages[currentPage]) {
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const allowedRoles = protectedPages[currentPage];
        if (!allowedRoles.includes(userRole)) {
            window.location.href = getRoleHomePage(userRole);
            return;
        }
    } else {
        // If page is not in the known protected list and not a public route, send to 404
        const publicPages = [
            'index.html', 'about.html', 'faq.html', 'contact.html', 'talents.html', 'workshops.html', 'community.html', 'photography-talents.html', 'workshops-photography.html', 'login.html', 'register.html', 'forgot-password.html', '404.html'
        ];
        if (!publicPages.includes(currentPage)) {
            if (!currentUser) {
                window.location.href = 'login.html';
            } else {
                window.location.href = getRoleHomePage(userRole);
            }
        }
    }
}

function getLastLinksActiveHandling(currentPageName) {
    document.querySelectorAll('.nav-link, .nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPageName || (currentPageName === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
    seedDefaultData();
    
    // Get current page name
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || 'index.html';
    
    // Redirect based on page and role
    redirectBasedOnPage();
    updateUserUI();
    applyRoleBasedNavigation();

    // Highlight active nav link
    getLastLinksActiveHandling(currentPage);
});

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== Search Functionality ====================
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

function performSearch(query) {
    if (query.trim()) {
        console.log('Searching for:', query);
        // Here you would implement actual search functionality
        // For now, we'll just redirect to discover page
        window.location.href = `discover.html?search=${encodeURIComponent(query)}`;
    }
}

// ==================== Toast Notifications ====================
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#213851',
        color: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease',
        fontWeight: '500'
    });

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Scroll to Top ====================
let scrollTopBtn = null;

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.innerHTML = '↑';
            scrollTopBtn.className = 'scroll-top-btn';
            Object.assign(scrollTopBtn.style, {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: '100',
                transition: 'all 0.3s ease'
            });
            
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            scrollTopBtn.addEventListener('mouseenter', () => {
                scrollTopBtn.style.transform = 'translateY(-4px)';
                scrollTopBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            });
            
            scrollTopBtn.addEventListener('mouseleave', () => {
                scrollTopBtn.style.transform = 'translateY(0)';
                scrollTopBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            });
            
            document.body.appendChild(scrollTopBtn);
        }
    } else if (scrollTopBtn) {
        scrollTopBtn.remove();
        scrollTopBtn = null;
    }
});

// ==================== Animation on Scroll ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .value-card, .category-card, .story-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ==================== Chat Icon Click ====================
const chatIcon = document.querySelector('.chat-icon');
if (chatIcon) {
    chatIcon.addEventListener('click', () => {
        showToast('ميزة المحادثة قريباً', 'info');
    });
}

// ==================== Utility Functions ====================
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
window.showToast = showToast;
window.formatNumber = formatNumber;
window.debounce = debounce;

// ==================== Language Toggle System ====================
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    
    // Get saved language or default to Arabic
    let currentLang = localStorage.getItem('sayt_lang') || 'ar';
    
    // Apply saved language on page load
    applyLanguage(currentLang);
    
    // Language toggle button click
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            localStorage.setItem('sayt_lang', currentLang);
            applyLanguage(currentLang);
        });
    }
    
    function applyLanguage(lang) {
        // Update HTML attributes
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update button text
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang === 'ar' ? 'EN' : 'ع';
        }
        
        // Update all elements with data-ar and data-en attributes
        document.querySelectorAll('[data-ar][data-en]').forEach(element => {
            const text = lang === 'ar' ? element.getAttribute('data-ar') : element.getAttribute('data-en');
            if (text) {
                // Check if it's an input placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = text;
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // Trigger custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
});

// ==================== Update Notification & Cart Badges ====================
function updateHeaderBadges() {
    // Update notification badge
    const notificationBadge = document.getElementById('headerNotificationBadge');
    const unreadNotifications = parseInt(localStorage.getItem('unread_notifications') || '5');
    
    if (notificationBadge) {
        if (unreadNotifications > 0) {
            notificationBadge.textContent = unreadNotifications;
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    // Update cart badge
    const cartBadge = document.getElementById('headerCartBadge');
    const cartItems = parseInt(localStorage.getItem('cart_items_count') || '3');
    
    if (cartBadge) {
        if (cartItems > 0) {
            cartBadge.textContent = cartItems;
            cartBadge.style.display = 'block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Update badges on page load
window.addEventListener('load', updateHeaderBadges);

// Update badges when storage changes (for multi-tab sync)
window.addEventListener('storage', updateHeaderBadges);

function initializeLogoutLinks() {
    document.querySelectorAll('a').forEach(link => {
        const label = link.textContent.trim().toLowerCase();
        if (label.includes('تسجيل الخروج') || label.includes('logout')) {
            link.addEventListener('click', () => {
                clearSiteCurrentUser();
            });
        }
    });
}

async function getCurrentUserRole() {
    const currentUser = await getSiteCurrentUserFromAppwrite();
    return normalizeRole(currentUser?.role || 'guest');
}

async function applyRoleBasedNavigation() {
    const role = await getCurrentUserRole();
    const allowedHrefs = new Set(getAllowedNavLinksByRole(role));
    document.querySelectorAll('.nav-links a, .mobile-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        if (!allowedHrefs.has(href)) {
            link.style.display = 'none';
        } else {
            link.style.display = '';
        }
    });
}

// ==================== Dark Mode Toggle ====================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle?.querySelector('.sun-icon');
    const moonIcon = themeToggle?.querySelector('.moon-icon');
    const logo = document.querySelector('.logo img');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon and logo based on current theme
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if (logo) logo.src = 'images/logo.png';
    }
    
    themeToggle?.addEventListener('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            if (logo) logo.src = 'images/logo.png';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            if (logo) logo.src = 'images/logo.png';
        }
    });
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.stat-card, .value-card, .category-card, .story-card').forEach(el => {
        observer.observe(el);
    });
}

// ==================== Smooth Scroll for Anchor Links ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==================== Initialize Logout Links ====================
function initializeLogoutLinks() {
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    function handleLogout() {
        clearSiteCurrentUser();
        if (window.AppwriteHelper) {
            window.AppwriteHelper.logout().catch(error => console.warn('Appwrite logout failed:', error));
        }
        showToast('تم تسجيل الخروج بنجاح', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }
}

// ==================== Initialize All ====================
document.addEventListener('DOMContentLoaded', async function() {
    seedDefaultData();
    ensureHeaderUserMenu();
    await redirectBasedOnPage();
    await updateUserUI();
    initializeLogoutLinks();
    initThemeToggle();
    initScrollAnimations();
    initSmoothScroll();
    await applyRoleBasedNavigation();
});
