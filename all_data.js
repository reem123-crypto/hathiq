/**
 * seed-all-data.js
 * إضافة كل البيانات التجريبية لمنصة "حاذق" إلى Appwrite دفعة واحدة
 * مع ربط العلاقات (seller_id, instructor_id, buyer_id, ...) بمعرّفات Appwrite الحقيقية
 *
 * التشغيل:
 *   1) npm install node-appwrite
 *   2) عبّي القيم في APPWRITE_CONFIG تحت
 *   3) node seed-all-data.js
 *
 * ملاحظات مهمة قبل التشغيل:
 * - هينشئ حساب Auth حقيقي لكل مستخدم بكلمة سر افتراضية (DEFAULT_PASSWORD تحت) - غيّرها بعدين.
 * - reviews.json فيه order_id (5, 8) مش موجودين في orders.json الأصلي - هيتسجلوا بـ order_id فاضي مع تحذير في الـ log.
 * - community_posts.json عنده حقل "images" (array) لكن الكولكشن عندك فيه حقل "image" (واحد بس) - هناخد أول صورة بس.
 *   التعليقات (comments) جوه community.json مش هتتخزن لأن مفيش كولكشن comments في الـ schema بتاعك.
 * - requests.json فيه budget_min/budget_max لكن الكولكشن service_requests فيه حقل "budget" واحد - هنستخدم budget_max.
 *   حقول location/requirements/proposals_count مش موجودة في الـ schema فهتتجاهل.
 * - settings.json معملتش له حاجة لأنه مفيش كولكشن ليه في الـ schema اللي بعتها - قولّي لو عايز نضيفه.
 */

const { Client, Databases, Users, ID, Permission, Role } = require("node-appwrite");

// ============ عدّل القيم دي ============
const APPWRITE_CONFIG = {
    endpoint: "https://fra.cloud.appwrite.io/v1", // project-fra يعني السيرفر في فرانكفورت
    projectId: "6a01a17c0019070903f1",
    apiKey: "standard_6691b2ad9ab1992c314ef0eb3889567a360573d19f326b9de9f0076a654bea887379aa41787803b242e8a152eaeaaffd5ce433e6130e65ddcb9cf58c69067acdbeb65e6c9e3c8ae20274530a4275f07bb0914c5e65c1430b1f85ef1f0bb7cbb574168ec5834fa3e903c98b99f851c5dc9d43af1090376e1b907b978e5b8c770c", // لسه ناقص - Appwrite Console -> Overview -> Integrations -> API Keys
    databaseId: "6a01a20a0000dfd5ae2c",
};
const DEFAULT_PASSWORD = "Talent@12345"; // كلمة سر مؤقتة لكل الحسابات المُنشأة - غيّرها بعد الاختبار
// =======================================

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setKey(APPWRITE_CONFIG.apiKey);

const databases = new Databases(client);
const usersService = new Users(client);
const DB = APPWRITE_CONFIG.databaseId;

// ============ البيانات ============

const usersData = [
    { id: 1, name: "أحمد المعمري", email: "ahmed@example.com", phone: "+968 9123 4567", type: "talent", category: "photography", bio: "مصور فوتوغرافي محترف متخصص في تصوير الفعاليات والمناسبات", experience: 5, city: "مسقط", rating: 4.8, reviews_count: 45, projects_completed: 120, avatar: "images/avatars/user1.jpg", portfolio: "https://portfolio.example.com", verified: true, status: "active" },
    { id: 2, name: "فاطمة الحارثية", email: "fatima@example.com", phone: "+968 9234 5678", type: "talent", category: "design", bio: "مصممة جرافيك مبدعة متخصصة في تصميم الهويات البصرية", experience: 3, city: "صلالة", rating: 4.9, reviews_count: 67, projects_completed: 89, avatar: "images/avatars/user2.jpg", portfolio: "https://portfolio.example.com", verified: true, status: "active" },
    { id: 3, name: "سالم البلوشي", email: "salem@example.com", phone: "+968 9345 6789", type: "talent", category: "writing", bio: "كاتب محتوى إبداعي متخصص في كتابة المقالات والمحتوى التسويقي", experience: 4, city: "نزوى", rating: 4.7, reviews_count: 34, projects_completed: 156, avatar: "images/avatars/user3.jpg", portfolio: "https://portfolio.example.com", verified: true, status: "active" },
    { id: 4, name: "مريم الشحية", email: "maryam@example.com", phone: "+968 9456 7890", type: "client", category: "", bio: "مديرة تسويق تبحث عن مواهب إبداعية", experience: 0, city: "مسقط", rating: 0, reviews_count: 0, projects_completed: 0, avatar: "images/avatars/user4.jpg", portfolio: "", verified: true, status: "active" },
    { id: 5, name: "خالد الهنائي", email: "khaled@example.com", phone: "+968 9567 8901", type: "talent", category: "video", bio: "مونتير فيديو محترف متخصص في المونتاج الإبداعي", experience: 6, city: "صحار", rating: 4.9, reviews_count: 52, projects_completed: 98, avatar: "images/avatars/user5.jpg", portfolio: "https://portfolio.example.com", verified: true, status: "active" },
];

const categoriesData = [
    { name: "التصوير", name_en: "Photography", slug: "photography", icon: "camera", description: "تصوير فوتوغرافي احترافي للفعاليات والمناسبات", talents_count: 320, color: "#5DCCB4" },
    { name: "التصميم", name_en: "Design", slug: "design", icon: "palette", description: "تصميم جرافيك وهويات بصرية احترافية", talents_count: 450, color: "#1B3A52" },
    { name: "الكتابة", name_en: "Writing", slug: "writing", icon: "pen", description: "كتابة محتوى إبداعي وتسويقي", talents_count: 280, color: "#3FBAA3" },
    { name: "المونتاج", name_en: "Video Editing", slug: "video", icon: "video", description: "مونتاج فيديو وموشن جرافيك", talents_count: 190, color: "#2A9B87" },
    { name: "البرمجة", name_en: "Programming", slug: "programming", icon: "code", description: "تطوير مواقع وتطبيقات", talents_count: 210, color: "#4AB89E" },
    { name: "التسويق", name_en: "Marketing", slug: "marketing", icon: "megaphone", description: "تسويق رقمي وإدارة حسابات", talents_count: 165, color: "#7FD9C5" },
    { name: "التعليق الصوتي", name_en: "Voice Over", slug: "voice", icon: "mic", description: "تعليق صوتي احترافي", talents_count: 95, color: "#6FCDB9" },
    { name: "الترجمة", name_en: "Translation", slug: "translation", icon: "globe", description: "ترجمة احترافية متعددة اللغات", talents_count: 140, color: "#2D5270" },
];

const productsData = [
    { id: 1, title: "تصوير فوتوغرافي احترافي", description: "جلسة تصوير فوتوغرافي احترافية للفعاليات والمناسبات", category: "photography", seller_id: 1, price: 150, currency: "OMR", delivery_time: 3, delivery_unit: "days", rating: 4.8, reviews_count: 45, orders_count: 120, image: "images/products/product1.jpg", images: ["images/products/product1-1.jpg", "images/products/product1-2.jpg", "images/products/product1-3.jpg"], features: ["تصوير احترافي", "معالجة الصور", "تسليم سريع", "جودة عالية"], status: "active" },
    { id: 2, title: "تصميم شعار احترافي", description: "تصميم شعار احترافي مع 3 مفاهيم مختلفة", category: "design", seller_id: 2, price: 80, currency: "OMR", delivery_time: 5, delivery_unit: "days", rating: 4.9, reviews_count: 67, orders_count: 89, image: "images/products/product2.jpg", images: ["images/products/product2-1.jpg", "images/products/product2-2.jpg"], features: ["3 مفاهيم مختلفة", "تعديلات مجانية", "ملفات مفتوحة المصدر", "جاهز للطباعة"], status: "active" },
    { id: 3, title: "كتابة محتوى تسويقي", description: "كتابة محتوى تسويقي احترافي لوسائل التواصل الاجتماعي", category: "writing", seller_id: 3, price: 50, currency: "OMR", delivery_time: 2, delivery_unit: "days", rating: 4.7, reviews_count: 34, orders_count: 156, image: "images/products/product3.jpg", images: ["images/products/product3-1.jpg"], features: ["محتوى حصري", "SEO محسّن", "تعديلات مجانية", "تسليم سريع"], status: "active" },
    { id: 4, title: "مونتاج فيديو احترافي", description: "مونتاج فيديو احترافي مع موشن جرافيك", category: "video", seller_id: 5, price: 200, currency: "OMR", delivery_time: 7, delivery_unit: "days", rating: 4.9, reviews_count: 52, orders_count: 98, image: "images/products/product4.jpg", images: ["images/products/product4-1.jpg", "images/products/product4-2.jpg"], features: ["مونتاج احترافي", "موشن جرافيك", "تصحيح ألوان", "مؤثرات صوتية"], status: "active" },
];

const workshopsData = [
    { id: 1, title: "أساسيات التصوير الفوتوغرافي", description: "ورشة عمل شاملة لتعلم أساسيات التصوير الفوتوغرافي الاحترافي", instructor_id: 1, category: "photography", level: "beginner", duration: 8, duration_unit: "hours", price: 75, currency: "OMR", seats: 20, seats_available: 5, rating: 4.8, reviews_count: 28, students_count: 145, image: "images/workshops/workshop1.jpg", start_date: "2024-04-15", end_date: "2024-04-17", schedule: "السبت والأحد 4-8 مساءً", location: "مسقط - مركز التدريب", type: "in-person", topics: ["مقدمة في التصوير", "إعدادات الكاميرا", "التكوين والإضاءة", "معالجة الصور"], requirements: ["كاميرا DSLR أو Mirrorless", "حاسوب محمول", "شغف بالتصوير"], status: "upcoming" },
    { id: 2, title: "تصميم الهوية البصرية", description: "تعلم كيفية تصميم هوية بصرية متكاملة للشركات والعلامات التجارية", instructor_id: 2, category: "design", level: "intermediate", duration: 12, duration_unit: "hours", price: 95, currency: "OMR", seats: 15, seats_available: 3, rating: 4.9, reviews_count: 35, students_count: 98, image: "images/workshops/workshop2.jpg", start_date: "2024-04-20", end_date: "2024-04-24", schedule: "الأربعاء والخميس 6-9 مساءً", location: "صلالة - مركز الإبداع", type: "in-person", topics: ["مبادئ الهوية البصرية", "تصميم الشعار", "اختيار الألوان والخطوط", "دليل الهوية البصرية"], requirements: ["معرفة أساسية بالتصميم", "Adobe Illustrator", "حاسوب محمول"], status: "upcoming" },
    { id: 3, title: "كتابة المحتوى التسويقي", description: "ورشة متخصصة في كتابة المحتوى التسويقي الفعال", instructor_id: 3, category: "writing", level: "beginner", duration: 6, duration_unit: "hours", price: 60, currency: "OMR", seats: 25, seats_available: 12, rating: 4.7, reviews_count: 22, students_count: 76, image: "images/workshops/workshop3.jpg", start_date: "2024-04-25", end_date: "2024-04-26", schedule: "الجمعة والسبت 5-8 مساءً", location: "أونلاين - Zoom", type: "online", topics: ["أساسيات كتابة المحتوى", "فهم الجمهور المستهدف", "تقنيات الإقناع", "SEO للمحتوى"], requirements: ["لا يوجد متطلبات مسبقة", "اتصال إنترنت جيد"], status: "upcoming" },
    { id: 4, title: "مونتاج الفيديو باحترافية", description: "تعلم مونتاج الفيديو الاحترافي باستخدام Adobe Premiere Pro", instructor_id: 5, category: "video", level: "intermediate", duration: 16, duration_unit: "hours", price: 120, currency: "OMR", seats: 12, seats_available: 2, rating: 4.9, reviews_count: 31, students_count: 67, image: "images/workshops/workshop4.jpg", start_date: "2024-05-01", end_date: "2024-05-08", schedule: "الأحد والثلاثاء 6-10 مساءً", location: "صحار - استوديو الإبداع", type: "in-person", topics: ["واجهة Premiere Pro", "تقنيات المونتاج", "تصحيح الألوان", "المؤثرات والانتقالات", "التصدير والنشر"], requirements: ["معرفة أساسية بالحاسوب", "Adobe Premiere Pro مثبت", "حاسوب محمول قوي"], status: "upcoming" },
];

const ordersData = [
    { id: 1, order_number: "ORD-2024-001", buyer_id: 4, seller_id: 1, product_id: 1, quantity: 1, price: 150, total: 150, currency: "OMR", status: "completed", payment_status: "paid", payment_method: "credit_card", delivery_date: "2024-03-20" },
    { id: 2, order_number: "ORD-2024-002", buyer_id: 4, seller_id: 2, product_id: 2, quantity: 1, price: 80, total: 80, currency: "OMR", status: "in_progress", payment_status: "paid", payment_method: "bank_transfer", delivery_date: "2024-03-25" },
    { id: 3, order_number: "ORD-2024-003", buyer_id: 4, seller_id: 3, product_id: 3, quantity: 5, price: 50, total: 250, currency: "OMR", status: "pending", payment_status: "pending", payment_method: "credit_card", delivery_date: "2024-03-28" },
];

const reviewsData = [
    { talent_id: 1, reviewer_id: 4, order_id: 1, rating: 5, comment: "عمل احترافي ممتاز! التصوير كان رائع والتسليم في الوقت المحدد. أنصح بالتعامل معه.", helpful_count: 12 },
    { talent_id: 1, reviewer_id: 5, order_id: 5, rating: 5, comment: "مصور محترف جداً، الصور جاءت أفضل من المتوقع. شكراً جزيلاً!", helpful_count: 8 },
    { talent_id: 2, reviewer_id: 4, order_id: 2, rating: 5, comment: "تصميم رائع وإبداعي! فاطمة مصممة موهوبة جداً وتفهم متطلبات العميل بشكل ممتاز.", helpful_count: 15 },
    { talent_id: 3, reviewer_id: 4, order_id: 8, rating: 4, comment: "محتوى جيد ومناسب، لكن كان يمكن أن يكون أكثر إبداعاً. بشكل عام راضية عن العمل.", helpful_count: 6 },
];

const conversationsData = [
    { messages: [
        { sender_id: 4, receiver_id: 1, message: "مرحباً أحمد، أريد حجز جلسة تصوير لفعالية الشركة", read: true, timestamp: "2024-03-22T10:30:00Z" },
        { sender_id: 1, receiver_id: 4, message: "أهلاً وسهلاً! متى موعد الفعالية؟", read: true, timestamp: "2024-03-22T10:35:00Z" },
        { sender_id: 4, receiver_id: 1, message: "الفعالية يوم السبت القادم في الساعة 5 مساءً", read: true, timestamp: "2024-03-22T10:40:00Z" },
        { sender_id: 1, receiver_id: 4, message: "شكراً لك، سأبدأ العمل فوراً", read: true, timestamp: "2024-03-22T10:45:00Z" },
    ]},
    { messages: [
        { sender_id: 4, receiver_id: 2, message: "مرحباً فاطمة، هل يمكنك تصميم شعار لشركتنا؟", read: true, timestamp: "2024-03-21T15:00:00Z" },
        { sender_id: 2, receiver_id: 4, message: "بالتأكيد! سأرسل لك 3 مفاهيم مختلفة خلال 5 أيام", read: true, timestamp: "2024-03-21T15:10:00Z" },
        { sender_id: 4, receiver_id: 2, message: "ممتاز! في انتظار التصاميم", read: false, timestamp: "2024-03-21T15:20:00Z" },
    ]},
];

const notificationsData = [
    { user_id: 1, type: "order", title: "طلب جديد", message: "لديك طلب جديد من مريم الشحية", link: "/orders/1", read: false, created_at: "2024-03-22T10:30:00Z" },
    { user_id: 1, type: "review", title: "تقييم جديد", message: "حصلت على تقييم 5 نجوم من أحمد", link: "/reviews/1", read: false, created_at: "2024-03-22T09:15:00Z" },
    { user_id: 1, type: "message", title: "رسالة جديدة", message: "لديك رسالة جديدة من فاطمة", link: "/chat/2", read: true, created_at: "2024-03-21T14:20:00Z" },
    { user_id: 1, type: "payment", title: "تم استلام الدفعة", message: "تم تحويل 150 ريال عماني إلى حسابك", link: "/wallet", read: true, created_at: "2024-03-20T16:45:00Z" },
    { user_id: 1, type: "system", title: "تحديث المنصة", message: "تم إضافة ميزات جديدة للمنصة", link: "/updates", read: true, created_at: "2024-03-19T08:00:00Z" },
];

const communityPostsData = [
    { author_id: 1, content: "نصيحة اليوم: استخدم الإضاءة الطبيعية قدر الإمكان في التصوير الفوتوغرافي. النتائج ستكون أكثر طبيعية وجمالاً! 📸", images: ["images/posts/post1.jpg"], likes_count: 45, comments_count: 12, created_at: "2024-03-22T09:00:00Z" },
    { author_id: 2, content: "شاركوني آرائكم في هذا التصميم الجديد! 🎨 #تصميم #جرافيك", images: ["images/posts/post2.jpg", "images/posts/post2-2.jpg"], likes_count: 67, comments_count: 23, created_at: "2024-03-21T14:30:00Z" },
    { author_id: 3, content: "5 نصائح لكتابة محتوى تسويقي فعال:\n1. اعرف جمهورك\n2. استخدم لغة بسيطة\n3. ركز على الفوائد\n4. أضف دعوة للعمل\n5. راجع وحرر دائماً ✍️", images: [], likes_count: 34, comments_count: 8, created_at: "2024-03-20T11:00:00Z" },
    { author_id: 5, content: "انتهيت للتو من مونتاج هذا الفيديو الترويجي! ما رأيكم؟ 🎬", images: ["images/posts/post4.jpg"], likes_count: 52, comments_count: 15, created_at: "2024-03-19T16:45:00Z" },
];

const requestsData = [
    { client_id: 4, title: "تصوير فعالية شركة", description: "نحتاج مصور محترف لتصوير فعالية إطلاق منتج جديد. الفعالية ستكون في فندق 5 نجوم وتستمر لمدة 4 ساعات.", category: "photography", budget_min: 150, budget_max: 250, currency: "OMR", deadline: "2024-04-15", status: "open" },
    { client_id: 4, title: "تصميم موقع إلكتروني", description: "نبحث عن مصمم ومطور لإنشاء موقع إلكتروني لشركتنا. الموقع يجب أن يكون responsive ومتوافق مع جميع الأجهزة.", category: "programming", budget_min: 500, budget_max: 800, currency: "OMR", deadline: "2024-05-01", status: "open" },
    { client_id: 4, title: "كتابة محتوى لموقع الشركة", description: "نحتاج كاتب محتوى محترف لكتابة محتوى موقع الشركة (حوالي 10 صفحات). المحتوى يجب أن يكون SEO optimized.", category: "writing", budget_min: 200, budget_max: 350, currency: "OMR", deadline: "2024-04-20", status: "in_progress" },
];

// ============ خرائط الربط (old id -> new $id) ============
const userMap = {};    // old user id -> { docId, accountId }
const productMap = {}; // old product id -> new $id
const orderMap = {};   // old order id -> new $id

const now = () => new Date().toISOString();

// ============ دوال الإضافة ============

async function seedCategories() {
    console.log("\n=== إضافة categories ===");
    for (const cat of categoriesData) {
        try {
            await databases.createDocument(DB, "categories", ID.unique(), {
                ...cat,
            }, [Permission.read(Role.any())]);
            console.log(`✅ ${cat.name}`);
        } catch (err) {
            console.warn(`⚠️  تخطي ${cat.name}: ${err.message}`);
        }
    }
}

async function seedUsers() {
    console.log("\n=== إضافة users (Auth + Profile) ===");
    for (const u of usersData) {
        try {
            // 1) إنشاء حساب Auth حقيقي
            const account = await usersService.create(
                ID.unique(),
                u.email,
                undefined, // phone (اختياري - سيبناه فاضي)
                DEFAULT_PASSWORD,
                u.name
            );

            // 2) إنشاء مستند البروفايل في كولكشن users
            const profileDoc = await databases.createDocument(
                DB,
                "users",
                ID.unique(),
                {
                    accountId: account.$id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    type: u.type,
                    category: u.category || "",
                    bio: u.bio || "",
                    experience: u.experience || 0,
                    city: u.city || "",
                    rating: u.rating || 0,
                    reviews_count: u.reviews_count || 0,
                    projects_completed: u.projects_completed || 0,
                    avatar: u.avatar || "",
                    portfolio: u.portfolio || "",
                    verified: u.verified || false,
                    status: u.status || "active",
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(account.$id)),
                    Permission.update(Role.team("admins")),
                    Permission.delete(Role.team("admins")),
                ]
            );

            userMap[u.id] = { docId: profileDoc.$id, accountId: account.$id };
            console.log(`✅ ${u.name} (auth: ${account.$id} / profile: ${profileDoc.$id})`);
        } catch (err) {
            console.error(`❌ فشل ${u.name}: ${err.message}`);
        }
    }
}

async function seedProducts() {
    console.log("\n=== إضافة products ===");
    for (const p of productsData) {
        try {
            const seller = userMap[p.seller_id];
            if (!seller) {
                console.warn(`⚠️  تخطي "${p.title}" - البائع ${p.seller_id} مش موجود`);
                continue;
            }
            const doc = await databases.createDocument(DB, "products", ID.unique(), {
                title: p.title,
                description: p.description,
                category: p.category,
                seller_id: seller.docId,
                price: p.price,
                currency: p.currency,
                delivery_time: p.delivery_time,
                delivery_unit: p.delivery_unit,
                rating: p.rating,
                reviews_count: p.reviews_count,
                orders_count: p.orders_count,
                image: p.image,
                images: p.images,
                features: p.features,
                status: p.status,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(seller.accountId)),
                Permission.update(Role.team("admins")),
                Permission.delete(Role.team("admins")),
            ]);
            productMap[p.id] = doc.$id;
            console.log(`✅ ${p.title}`);
        } catch (err) {
            console.error(`❌ فشل ${p.title}: ${err.message}`);
        }
    }
}

async function seedWorkshops() {
    console.log("\n=== إضافة workshops ===");
    for (const w of workshopsData) {
        try {
            const instructor = userMap[w.instructor_id];
            if (!instructor) {
                console.warn(`⚠️  تخطي "${w.title}" - المدرب ${w.instructor_id} مش موجود`);
                continue;
            }
            await databases.createDocument(DB, "workshops", ID.unique(), {
                title: w.title,
                description: w.description,
                instructor_id: instructor.docId,
                category: w.category,
                level: w.level,
                duration: w.duration,
                duration_unit: w.duration_unit,
                price: w.price,
                currency: w.currency,
                seats: w.seats,
                seats_available: w.seats_available,
                rating: w.rating,
                reviews_count: w.reviews_count,
                students_count: w.students_count,
                image: w.image,
                start_date: new Date(w.start_date).toISOString(),
                end_date: new Date(w.end_date).toISOString(),
                schedule: w.schedule,
                location: w.location,
                type: w.type,
                topics: w.topics,
                requirements: w.requirements,
                status: w.status,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(instructor.accountId)),
                Permission.update(Role.team("admins")),
                Permission.delete(Role.team("admins")),
            ]);
            console.log(`✅ ${w.title}`);
        } catch (err) {
            console.error(`❌ فشل ${w.title}: ${err.message}`);
        }
    }
}

async function seedOrders() {
    console.log("\n=== إضافة orders ===");
    for (const o of ordersData) {
        try {
            const buyer = userMap[o.buyer_id];
            const seller = userMap[o.seller_id];
            const productId = productMap[o.product_id];
            if (!buyer || !seller || !productId) {
                console.warn(`⚠️  تخطي "${o.order_number}" - بيانات مرتبطة ناقصة`);
                continue;
            }
            const doc = await databases.createDocument(DB, "orders", ID.unique(), {
                order_number: o.order_number,
                buyer_id: buyer.docId,
                seller_id: seller.docId,
                product_id: productId,
                quantity: o.quantity,
                price: o.price,
                total: o.total,
                currency: o.currency,
                status: o.status,
                payment_status: o.payment_status,
                payment_method: o.payment_method,
                delivery_date: new Date(o.delivery_date).toISOString(),
            }, [
                Permission.read(Role.user(buyer.accountId)),
                Permission.read(Role.user(seller.accountId)),
                Permission.read(Role.team("admins")),
                Permission.update(Role.team("admins")),
            ]);
            orderMap[o.id] = doc.$id;
            console.log(`✅ ${o.order_number}`);
        } catch (err) {
            console.error(`❌ فشل ${o.order_number}: ${err.message}`);
        }
    }
}

async function seedReviews() {
    console.log("\n=== إضافة reviews ===");
    for (const r of reviewsData) {
        try {
            const talent = userMap[r.talent_id];
            const reviewer = userMap[r.reviewer_id];
            const orderId = orderMap[r.order_id]; // ممكن تكون مش موجودة - هتتسجل فاضية
            if (!talent || !reviewer) {
                console.warn(`⚠️  تخطي تقييم - talent/reviewer ناقص`);
                continue;
            }
            if (!orderId) {
                console.warn(`⚠️  تقييم على order_id=${r.order_id} مش موجود في orders - هيتسجل بدون order_id`);
            }
            await databases.createDocument(DB, "reviews", ID.unique(), {
                talent_id: talent.docId,
                reviewer_id: reviewer.docId,
                order_id: orderId || "",
                rating: r.rating,
                comment: r.comment,
                helpful_count: r.helpful_count,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(reviewer.accountId)),
                Permission.update(Role.team("admins")),
                Permission.delete(Role.team("admins")),
            ]);
            console.log(`✅ تقييم من ${reviewer.docId} على ${talent.docId}`);
        } catch (err) {
            console.error(`❌ فشل إضافة تقييم: ${err.message}`);
        }
    }
}

async function seedMessages() {
    console.log("\n=== إضافة messages ===");
    for (const conv of conversationsData) {
        for (const m of conv.messages) {
            try {
                const sender = userMap[m.sender_id];
                const receiver = userMap[m.receiver_id];
                if (!sender || !receiver) {
                    console.warn(`⚠️  تخطي رسالة - مرسل/مستقبل ناقص`);
                    continue;
                }
                await databases.createDocument(DB, "messages", ID.unique(), {
                    sender_id: sender.docId,
                    receiver_id: receiver.docId,
                    message: m.message,
                    is_read: m.read,
                }, [
                    Permission.read(Role.user(sender.accountId)),
                    Permission.read(Role.user(receiver.accountId)),
                    Permission.update(Role.user(receiver.accountId)), // المستقبل يقدر يعلّم "مقروءة"
                ]);
                console.log(`✅ رسالة ${sender.docId} -> ${receiver.docId}`);
            } catch (err) {
                console.error(`❌ فشل إضافة رسالة: ${err.message}`);
            }
        }
    }
}

async function seedNotifications() {
    console.log("\n=== إضافة notifications ===");
    for (const n of notificationsData) {
        try {
            const user = userMap[n.user_id];
            if (!user) {
                console.warn(`⚠️  تخطي إشعار - المستخدم ${n.user_id} مش موجود`);
                continue;
            }
            await databases.createDocument(DB, "notifications", ID.unique(), {
                user_id: user.docId,
                type: n.type,
                title: n.title,
                message: n.message,
                link: n.link,
                is_read: n.read,
            }, [
                Permission.read(Role.user(user.accountId)),
                Permission.update(Role.user(user.accountId)),
            ]);
            console.log(`✅ إشعار "${n.title}" لـ ${user.docId}`);
        } catch (err) {
            console.error(`❌ فشل إضافة إشعار: ${err.message}`);
        }
    }
}

async function seedCommunityPosts() {
    console.log("\n=== إضافة community_posts ===");
    for (const p of communityPostsData) {
        try {
            const author = userMap[p.author_id];
            if (!author) {
                console.warn(`⚠️  تخطي منشور - الكاتب ${p.author_id} مش موجود`);
                continue;
            }
            await databases.createDocument(DB, "community_posts", ID.unique(), {
                user_id: author.docId,
                content: p.content,
                image: p.images && p.images.length > 0 ? p.images[0] : "",
                likes_count: p.likes_count,
                comments_count: p.comments_count,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(author.accountId)),
                Permission.delete(Role.user(author.accountId)),
                Permission.delete(Role.team("admins")),
            ]);
            console.log(`✅ منشور من ${author.docId}`);
        } catch (err) {
            console.error(`❌ فشل إضافة منشور: ${err.message}`);
        }
    }
}

async function seedServiceRequests() {
    console.log("\n=== إضافة service_requests ===");
    for (const r of requestsData) {
        try {
            const client = userMap[r.client_id];
            if (!client) {
                console.warn(`⚠️  تخطي "${r.title}" - العميل ${r.client_id} مش موجود`);
                continue;
            }
            await databases.createDocument(DB, "service_requests", ID.unique(), {
                client_id: client.docId,
                category: r.category,
                title: r.title,
                description: r.description,
                budget: r.budget_max, // الـ schema فيه حقل budget واحد بس - استخدمنا الحد الأقصى
                currency: r.currency,
                deadline: new Date(r.deadline).toISOString(),
                status: r.status,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(client.accountId)),
                Permission.update(Role.team("admins")),
                Permission.delete(Role.user(client.accountId)),
            ]);
            console.log(`✅ ${r.title}`);
        } catch (err) {
            console.error(`❌ فشل ${r.title}: ${err.message}`);
        }
    }
}

// ============ التشغيل بالترتيب الصحيح (بسبب العلاقات) ============
async function run() {
    await seedCategories();
    await seedUsers();        // لازم الأول - كل حاجة تانية بتعتمد عليه
    await seedProducts();     // يعتمد على users
    await seedWorkshops();    // يعتمد على users
    await seedOrders();       // يعتمد على users + products
    await seedReviews();      // يعتمد على users + orders
    await seedMessages();     // يعتمد على users
    await seedNotifications();// يعتمد على users
    await seedCommunityPosts(); // يعتمد على users
    await seedServiceRequests(); // يعتمد على users

    console.log("\n🎉 انتهت إضافة كل البيانات.");
    console.log(`🔑 كلمة السر الافتراضية لكل الحسابات: ${DEFAULT_PASSWORD}`);
}

run();