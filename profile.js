// Profile Page JavaScript

const profileData = {
    name: 'المستخدم',
    category: 'مستخدم',
    city: 'غير محدد',
    rating: 4.8,
    reviewsCount: 45,
    bio: 'هذا الملف الشخصي يتم تحديثه تلقائياً بناءً على بيانات الجلسة الحالية.',
    yearsExperience: '0+',
    workType: 'عميل',
    completedProjects: 0,
    portfolio: [
        { id: 1, type: 'photo', title: 'تصوير حفل زفاف', image: '📷' },
        { id: 2, type: 'photo', title: 'تصوير منتجات', image: '📸' },
        { id: 3, type: 'video', title: 'فيديو ترويجي', image: '🎥' },
        { id: 4, type: 'photo', title: 'تصوير طبيعة', image: '🌄' },
        { id: 5, type: 'photo', title: 'تصوير بورتريه', image: '👤' },
        { id: 6, type: 'video', title: 'فيديو إعلاني', image: '📹' }
    ],
    experience: [
        {
            title: 'مصور رئيسي - شركة الإبداع',
            period: '2020 - الآن',
            description: 'إدارة فريق التصوير وتنفيذ مشاريع تصوير كبرى للشركات والمؤسسات'
        },
        {
            title: 'مصور مستقل',
            period: '2018 - 2020',
            description: 'تصوير المناسبات والفعاليات الخاصة والعامة'
        }
    ],
    reviews: [
        {
            name: 'محمد الشكيلي',
            rating: 5,
            date: 'منذ أسبوع',
            text: 'مصور محترف جداً، التزام بالمواعيد وجودة عمل ممتازة. أنصح بالتعامل معه'
        },
        {
            name: 'فاطمة البلوشية',
            rating: 5,
            date: 'منذ أسبوعين',
            text: 'تجربة رائعة، الصور جاءت أفضل من المتوقع. شكراً على الاحترافية'
        },
        {
            name: 'سالم الحارثي',
            rating: 4,
            date: 'منذ شهر',
            text: 'عمل جيد وأسعار مناسبة. سأتعامل معه مرة أخرى بإذن الله'
        }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    await loadCurrentUserProfile();
    loadProfileData();
    initializePortfolio();
    initializeReviews();
    initializeButtons();
});

function formatCategory(category) {
    const normalized = (category || '').toString().trim().toLowerCase();
    if (['photography', 'تصوير', 'photo'].includes(normalized)) return 'التصوير';
    if (['design', 'تصميم'].includes(normalized)) return 'التصميم';
    if (['writing', 'كتابة'].includes(normalized)) return 'الكتابة';
    if (['programming', 'برمجة'].includes(normalized)) return 'البرمجة';
    return category || 'مستخدم';
}

async function loadCurrentUserProfile() {
    try {
        const user = typeof window.getSiteCurrentUserFromAppwrite === 'function'
            ? await window.getSiteCurrentUserFromAppwrite()
            : null;

        const currentUser = user || JSON.parse(localStorage.getItem('site_current_user') || 'null');

        if (currentUser) {
            profileData.name = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'المستخدم';
            profileData.category = formatCategory(currentUser.category || currentUser.role);
            profileData.city = currentUser.city || 'غير محدد';
            profileData.bio = currentUser.bio || 'هذا الملف الشخصي يتم تحديثه تلقائياً بناءً على بيانات الجلسة الحالية.';
            profileData.yearsExperience = currentUser.experience ? `${currentUser.experience}+` : '0+';
            profileData.workType = currentUser.role === 'talent' ? 'فرد' : currentUser.role === 'admin' ? 'مشرف' : 'عميل';
            profileData.completedProjects = currentUser.role === 'talent' ? 24 : 0;

            const avatarElement = document.getElementById('profileAvatar');
            if (avatarElement) {
                avatarElement.textContent = currentUser.avatar || profileData.name.charAt(0) || '👤';
            }
        }
    } catch (error) {
        console.warn('لم يتم جلب بيانات المستخدم من الجلسة:', error);
    }
}

// Load profile data
function loadProfileData() {
    // Load basic info
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileCategory').textContent = profileData.category;
    document.getElementById('profileCity').textContent = profileData.city;
    document.getElementById('profileRating').textContent = profileData.rating;
    document.getElementById('reviewsCount').textContent = profileData.reviewsCount;
    
    // Load stars
    const starsContainer = document.getElementById('profileStars');
    starsContainer.innerHTML = generateStars(profileData.rating);
    
    const reviewStarsLarge = document.getElementById('reviewStarsLarge');
    reviewStarsLarge.innerHTML = generateStars(profileData.rating);
    
    // Load about section
    document.getElementById('profileBio').textContent = profileData.bio;
    document.getElementById('yearsExperience').textContent = profileData.yearsExperience;
    document.getElementById('completedProjects').textContent = profileData.completedProjects;
    
    // Load experience
    loadExperience();
}

// Generate stars HTML
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" opacity="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    
    return starsHTML;
}

// Initialize portfolio
function initializePortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (profileData.portfolio.length === 0) {
        portfolioGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">لا توجد أعمال معروضة حالياً</p>';
        return;
    }
    
    portfolioGrid.innerHTML = profileData.portfolio.map(item => `
        <div class="portfolio-item" data-type="${item.type}" data-id="${item.id}">
            <div class="portfolio-placeholder">${item.image}</div>
        </div>
    `).join('');
    
    // Add click event to portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.dataset.id;
            openPortfolioModal(id);
        });
    });
    
    // Portfolio filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterPortfolio(filter);
        });
    });
}

// Filter portfolio
function filterPortfolio(filter) {
    const items = document.querySelectorAll('.portfolio-item');
    
    items.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Open portfolio modal
function openPortfolioModal(id) {
    const item = profileData.portfolio.find(p => p.id == id);
    if (!item) return;
    
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('portfolioModalContent');
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 8rem; margin-bottom: 1rem;">${item.image}</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${item.title}</h3>
            <span style="color: var(--text-secondary);">${item.type === 'photo' ? 'صورة' : 'فيديو'}</span>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close portfolio modal
document.getElementById('closePortfolioModal')?.addEventListener('click', function() {
    document.getElementById('portfolioModal').classList.remove('active');
});

// Close modal on overlay click
document.querySelector('.modal-overlay')?.addEventListener('click', function() {
    document.getElementById('portfolioModal').classList.remove('active');
});

// Load experience
function loadExperience() {
    const experienceList = document.getElementById('experienceList');
    
    if (profileData.experience.length === 0) {
        experienceList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">لا توجد خبرات مضافة حالياً</p>';
        return;
    }
    
    experienceList.innerHTML = profileData.experience.map(exp => `
        <div class="experience-item">
            <h4>${exp.title}</h4>
            <div class="experience-meta">
                <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${exp.period}
                </span>
            </div>
            <p>${exp.description}</p>
        </div>
    `).join('');
}

// Initialize reviews
function initializeReviews() {
    const reviewsList = document.getElementById('reviewsList');
    
    if (profileData.reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">لا توجد تقييمات حالياً</p>';
        return;
    }
    
    reviewsList.innerHTML = profileData.reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">👤</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Initialize buttons
function initializeButtons() {
    // Chat button
    document.getElementById('chatBtn')?.addEventListener('click', function() {
        window.location.href = 'chat.html';
    });
    
    // Request button
    document.getElementById('requestBtn')?.addEventListener('click', function() {
        window.location.href = 'request.html';
    });
    
    // Favorite button
    let isFavorite = false;
    document.getElementById('favoriteBtn')?.addEventListener('click', function() {
        isFavorite = !isFavorite;
        const svg = this.querySelector('svg path');
        if (isFavorite) {
            svg.setAttribute('fill', 'currentColor');
            this.style.color = '#ef4444';
        } else {
            svg.setAttribute('fill', 'none');
            this.style.color = '';
        }
    });
    
    // Share button
    document.getElementById('shareBtn')?.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: profileData.name,
                text: `تحقق من ملف ${profileData.name} على منصة صيت`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ الرابط');
        }
    });
}


// Initialize collapsible sections
function initializeCollapsibleSections() {
    const collapsibleHeaders = document.querySelectorAll('.section-header-collapsible');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const section = this.dataset.section;
            const content = document.getElementById(`${section}-content`);
            
            // Toggle active class
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
    
    // Open first section by default
    if (collapsibleHeaders.length > 0) {
        collapsibleHeaders[0].classList.add('active');
    }
}


// ==================== Setup Collapsible Sections ====================
function setupCollapsibleSections() {
    const toggleButtons = document.querySelectorAll('.section-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.collapsible-section');
            const isActive = section.classList.contains('active');
            
            // Close all sections
            document.querySelectorAll('.collapsible-section').forEach(s => {
                s.classList.remove('active');
            });
            
            // Open clicked section if it wasn't active
            if (!isActive) {
                section.classList.add('active');
            }
        });
    });
    
    // Open first section by default
    const firstSection = document.querySelector('.collapsible-section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
}

// Initialize collapsible sections on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeCollapsibleSections();
        setupCollapsibleSections();
    });
} else {
    initializeCollapsibleSections();
    setupCollapsibleSections();
}