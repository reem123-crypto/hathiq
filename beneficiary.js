/**
 * Beneficiary Page
 * صفحة المستفيد - عرض فقط لجميع الخدمات والمحتوى
 */

// Sample data for beneficiary page
const featuredTalents = [
    {
        id: 1,
        name: "أحمد بن سالم الراسبي",
        category: "photography",
        rating: 4.9,
        description: "مصور فوتوغرافي محترف متخصص في التصوير الزفاف والمناسبات",
        avatar: "A"
    },
    {
        id: 2,
        name: "فاطمة بنت خالد الزدجالية",
        category: "photography",
        rating: 4.8,
        description: "مصورة فوتوغرافية متخصصة في التصوير الفني والطبيعة",
        avatar: "ف"
    },
    {
        id: 3,
        name: "محمد بن عبدالله الشكيلي",
        category: "photography",
        rating: 4.7,
        description: "مصور فيديو ومونتاج متخصص في الأفلام القصيرة",
        avatar: "م"
    }
];

const upcomingWorkshops = [
    {
        id: 1,
        title: "ورشة التصوير الفوتوغرافي الأساسي",
        instructor: "أحمد بن سالم الراسبي",
        date: "2024-02-15",
        time: "10:00 - 16:00",
        price: 50,
        capacity: 15,
        enrolled: 8
    },
    {
        id: 2,
        title: "مونتاج الفيديو باستخدام برامج احترافية",
        instructor: "محمد بن عبدالله الشكيلي",
        date: "2024-02-20",
        time: "14:00 - 18:00",
        price: 75,
        capacity: 12,
        enrolled: 10
    },
    {
        id: 3,
        title: "تصوير المنتجات التجارية",
        instructor: "سارة بنت محمد الغافرية",
        date: "2024-02-25",
        time: "09:00 - 15:00",
        price: 60,
        capacity: 10,
        enrolled: 6
    }
];

const communityPosts = [
    {
        id: 1,
        author: "علي بن سالم",
        time: "منذ ساعتين",
        content: "ممتاز جداً! تمكنت من حضور ورشة التصوير الفوتوغرافي وكانت تجربة رائعة. المدرب محترف جداً وشرح كل التفاصيل بوضوح.",
        avatar: "ع",
        likes: 12,
        comments: 5
    },
    {
        id: 2,
        author: "مريم بنت أحمد",
        time: "منذ 4 ساعات",
        content: "أبحث عن مصور فوتوغرافي لتصوير حفل زفافي في مسقط. هل يمكنني الحصول على توصيات؟",
        avatar: "م",
        likes: 8,
        comments: 15
    },
    {
        id: 3,
        author: "خالد بن محمد",
        time: "منذ يوم واحد",
        content: "تم الانتهاء من تصوير فيديو ترويجي لمشروعي التجاري. النتيجة كانت مذهلة! شكراً للمنصة على الربط مع مواهب عمانية موهوبة.",
        avatar: "خ",
        likes: 25,
        comments: 8
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedTalents();
    loadUpcomingWorkshops();
    loadCommunityPosts();
    setupEventListeners();
});

/**
 * Load featured talents
 */
function loadFeaturedTalents() {
    const container = document.getElementById('featuredTalents');

    container.innerHTML = featuredTalents.map(talent => `
        <div class="featured-talent-card">
            <div class="talent-header">
                <div class="talent-avatar">${talent.avatar}</div>
                <div class="talent-info">
                    <h4>${talent.name}</h4>
                    <span class="talent-category">📸 التصوير والفيديو</span>
                </div>
            </div>

            <div class="talent-rating">
                <div class="stars">
                    ${generateStars(talent.rating)}
                </div>
                <span>${talent.rating}</span>
            </div>

            <p class="talent-description">${talent.description}</p>

            <div class="talent-actions">
                <a href="photography-talents.html" class="btn btn-primary">عرض الملف</a>
                <button class="btn btn-outline" onclick="contactTalent(${talent.id})">تواصل</button>
            </div>
        </div>
    `).join('');
}

/**
 * Load upcoming workshops
 */
function loadUpcomingWorkshops() {
    const container = document.getElementById('upcomingWorkshops');

    container.innerHTML = upcomingWorkshops.map(workshop => `
        <div class="workshop-preview-card">
            <div class="workshop-image">
                🎓
                <div class="workshop-badge">ورشة</div>
            </div>
            <div class="workshop-content">
                <h3 class="workshop-title">${workshop.title}</h3>
                <div class="workshop-meta">
                    <div class="workshop-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${workshop.instructor}
                    </div>
                    <div class="workshop-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${formatDate(workshop.date)}
                    </div>
                    <div class="workshop-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${workshop.time}
                    </div>
                </div>
                <div class="workshop-price">${workshop.price} ريال</div>
                <div class="workshop-capacity">${workshop.enrolled}/${workshop.capacity} مشترك</div>
                <a href="workshops-photography.html" class="btn btn-primary btn-sm" style="width: 100%; margin-top: 1rem;">عرض التفاصيل</a>
            </div>
        </div>
    `).join('');
}

/**
 * Load community posts
 */
function loadCommunityPosts() {
    const container = document.getElementById('communityPosts');

    container.innerHTML = communityPosts.map(post => `
        <div class="community-post-card">
            <div class="post-header">
                <div class="post-avatar">${post.avatar}</div>
                <div class="post-info">
                    <h4>${post.author}</h4>
                    <span class="post-time">${post.time}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-stats">
                <span>❤️ ${post.likes} إعجاب</span>
                <span>💬 ${post.comments} تعليق</span>
            </div>
        </div>
    `).join('');
}

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }

    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star" style="color: #ddd;">☆</span>';
    }

    return stars;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-OM', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Contact talent
 */
function contactTalent(talentId) {
    // For beneficiary page, just show a message
    window.showToast('يجب تسجيل الدخول أولاً للتواصل مع المواهب', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Add any additional event listeners here
}