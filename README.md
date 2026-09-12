# منصة صيت - Sayt Platform

<div align="center">

![Sayt Logo](frontend/images/logo.svg)

**منصة رقمية لتنظيم وتمكين المواهب وصناع المحتوى في عمان**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)

[العربية](#ar) | [English](#en)

</div>

---

<a name="ar"></a>

## 📋 نظرة عامة

منصة صيت هي منصة رقمية شاملة تهدف إلى تنظيم وتمكين المواهب وصناع المحتوى في سلطنة عمان. توفر المنصة بيئة احترافية للمواهب لعرض أعمالهم والتواصل مع العملاء.

## ✨ الميزات الرئيسية

- 🎨 **عرض المواهب**: ملفات شخصية احترافية للمواهب مع معرض أعمال
- 🛍️ **متجر إلكتروني**: بيع المنتجات والخدمات الإبداعية
- 🎓 **ورش تدريبية**: ورش عمل حضورية وأونلاين
- 💬 **نظام محادثات**: تواصل مباشر بين المواهب والعملاء
- ⭐ **نظام تقييمات**: تقييمات ومراجعات للمواهب
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة
- 🌙 **الوضع الليلي**: دعم الوضع الليلي
- 🌐 **ثنائي اللغة**: دعم العربية والإنجليزية مع RTL/LTR

## 🏗️ البنية التقنية

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- تصميم متجاوب (Responsive Design)
- دعم RTL/LTR
- نظام ألوان: التركوازي (#5DCCB4) + الأزرق الغامق (#1B3A52)

### Backend
- PHP 7.4+
- MySQL 5.7+
- RESTful API
- PDO للاتصال بقاعدة البيانات
- CORS Support

### Data
- ملفات JSON للبيانات التجريبية
- 11 ملف بيانات (users, products, workshops, etc.)

## 📁 هيكل المشروع

```
منصة-صيت/
├── frontend/               # واجهة المستخدم
│   ├── css/               # ملفات التنسيق
│   ├── js/                # ملفات JavaScript
│   │   ├── api.js        # ملف الربط مع Backend
│   │   ├── main.js       # وظائف عامة
│   │   └── *.js          # ملفات الصفحات
│   ├── images/            # الصور والأيقونات
│   ├── components/        # مكونات HTML
│   └── *.html             # صفحات HTML (22 صفحة)
│
├── backend/               # الخادم
│   ├── api/              # API Endpoints (6 ملفات)
│   ├── models/           # Models (6 ملفات)
│   ├── config/           # الإعدادات
│   ├── includes/         # دوال مساعدة
│   ├── database.sql      # قاعدة البيانات
│   ├── test-api.html     # صفحة اختبار API
│   └── README.md         # توثيق Backend
│
├── data/                  # البيانات التجريبية
│   ├── users.json        # المستخدمين (5)
│   ├── products.json     # المنتجات (4)
│   ├── workshops.json    # الورش (4)
│   ├── categories.json   # التصنيفات (8)
│   ├── orders.json       # الطلبات (3)
│   ├── reviews.json      # التقييمات (4)
│   ├── messages.json     # الرسائل (2)
│   ├── notifications.json # الإشعارات (5)
│   ├── community.json    # المجتمع (4)
│   ├── requests.json     # طلبات الخدمات (3)
│   ├── settings.json     # الإعدادات
│   └── README.md         # توثيق البيانات
│
├── INTEGRATION_GUIDE.md  # دليل الربط
└── README.md             # هذا الملف
```

## 🚀 التثبيت والتشغيل

### المتطلبات

- PHP 7.4 أو أحدث
- MySQL 5.7 أو أحدث
- Apache/Nginx مع mod_rewrite
- متصفح حديث

### الخيار 1: تشغيل كامل (Frontend + Backend + Database)

#### 1. إعداد قاعدة البيانات

```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
source backend/database.sql
```

#### 2. تعديل إعدادات الاتصال

```php
// backend/config/database.php
private $host = "localhost";
private $db_name = "sayt_db";
private $username = "root";
private $password = "your_password";
```

#### 3. تشغيل Backend

```bash
cd backend
php -S localhost:8000
```

#### 4. اختبار API

افتح في المتصفح: `http://localhost:8000/test-api.html`

#### 5. تشغيل Frontend

افتح في المتصفح: `frontend/index.html`

### الخيار 2: تشغيل Frontend فقط (بدون Backend)

```bash
# افتح مباشرة
open frontend/index.html

# أو استخدم Live Server
cd frontend
python -m http.server 3000
```

سيتم التحميل تلقائياً من ملفات JSON في مجلد `data/`

## 📚 الصفحات المتوفرة

### صفحات عامة
- `index.html` - الصفحة الرئيسية
- `about.html` - من نحن
- `contact.html` - اتصل بنا
- `faq.html` - الأسئلة الشائعة

### صفحات المواهب
- `talents.html` - المجالات الإبداعية
- `talents-list.html` - قائمة المواهب
- `profile.html` - ملف الموهبة
- `my-profile.html` - ملفي الشخصي

### صفحات المتجر والورش
- `store.html` - المتجر
- `workshops.html` - الورش
- `workshops-list.html` - قائمة الورش

### صفحات التفاعل
- `community.html` - المجتمع
- `chat.html` - المحادثات
- `notifications.html` - الإشعارات
- `request.html` - طلب خدمة

### صفحات الحساب
- `login.html` - تسجيل الدخول
- `register.html` - إنشاء حساب
- `dashboard.html` - لوحة التحكم
- `settings.html` - الإعدادات
- `cart.html` - السلة

### صفحات الإدارة
- `admin.html` - لوحة الإدارة

## 🔌 استخدام API

### مثال: جلب المواهب

```javascript
// استخدام API مع Fallback تلقائي
const response = await API.getUsers({ type: 'talent' });
const talents = response.data.users;

// عرض المواهب
talents.forEach(talent => {
    console.log(talent.name, talent.category);
});
```

### مثال: إنشاء طلب

```javascript
const order = await API.Orders.create({
    buyer_id: 4,
    seller_id: 1,
    product_id: 1,
    quantity: 1,
    price: 150
});

console.log('Order created:', order.data.order_number);
```

### مثال: جلب الورش

```javascript
const workshops = await API.getWorkshops({ 
    category: 'design',
    status: 'upcoming'
});

console.log('Found', workshops.data.count, 'workshops');
```

## 📊 API Endpoints

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/users.php` | GET, POST, PUT, DELETE | إدارة المستخدمين |
| `/api/products.php` | GET, POST, PUT, DELETE | إدارة المنتجات |
| `/api/workshops.php` | GET, POST, PUT, DELETE | إدارة الورش |
| `/api/categories.php` | GET, POST, PUT, DELETE | إدارة التصنيفات |
| `/api/orders.php` | GET, POST, PUT, DELETE | إدارة الطلبات |
| `/api/reviews.php` | GET, POST, PUT, DELETE | إدارة التقييمات |

للمزيد من التفاصيل، راجع `backend/README.md`

## 🎨 نظام الألوان

```css
--primary-color: #5DCCB4;      /* التركوازي */
--secondary-color: #1B3A52;    /* الأزرق الغامق */
--accent-color: #3FBAA3;       /* تركوازي فاتح */
--text-color: #1a1a1a;         /* نص أساسي */
--bg-color: #ffffff;           /* خلفية */
```

## 🔐 الأمان

- ✅ تنظيف جميع المدخلات (htmlspecialchars, strip_tags)
- ✅ تشفير كلمات المرور (BCRYPT)
- ✅ Prepared Statements (منع SQL Injection)
- ✅ CORS Headers
- ⏳ JWT Authentication (قريباً)
- ⏳ Rate Limiting (قريباً)

## 📱 التوافق

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browsers

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء Branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل

## 📞 التواصل

- الموقع: https://sayt.om
- البريد: support@sayt.om
- تويتر: [@sayt_om](https://twitter.com/sayt_om)

## 🙏 شكر وتقدير

- تصميم الأيقونات: [Feather Icons](https://feathericons.com/)
- الخطوط: [Google Fonts - Tajawal](https://fonts.google.com/specimen/Tajawal)

---

<div align="center">

**صُنع بـ ❤️ في سلطنة عمان**

© 2024 منصة صيت - جميع الحقوق محفوظة

</div>

---

<a name="en"></a>

## English Version

### Overview

Sayt Platform is a comprehensive digital platform aimed at organizing and empowering talents and content creators in the Sultanate of Oman.

### Quick Start

```bash
# Setup database
mysql -u root -p < backend/database.sql

# Start backend
cd backend && php -S localhost:8000

# Open frontend
open frontend/index.html
```

### Features

- 🎨 Talent Profiles
- 🛍️ Online Store
- 🎓 Workshops
- 💬 Chat System
- ⭐ Reviews
- 📱 Responsive Design
- 🌙 Dark Mode
- 🌐 Bilingual (Arabic/English)

### Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 7.4+, MySQL 5.7+
- **API**: RESTful with JSON
- **Data**: JSON files for demo

### License

MIT License - See [LICENSE](LICENSE) file

---

Made with ❤️ in Oman
#   h a t h i q  
 