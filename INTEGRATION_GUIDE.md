# دليل الربط بين Frontend و Backend و Data

## 📋 نظرة عامة

تم بناء منصة صيت بثلاث طبقات مترابطة:

1. **Frontend** - واجهة المستخدم (HTML, CSS, JavaScript)
2. **Backend** - API بـ PHP و MySQL
3. **Data** - بيانات تجريبية بصيغة JSON

## 🔗 الترابط بين الطبقات

### 1. Frontend ↔ Backend

تم إنشاء ملف `frontend/js/api.js` للربط بين Frontend و Backend:

```javascript
// استخدام API مباشرة
const users = await API.Users.getAll();
const products = await API.Products.getAll({ category: 'photography' });
const workshops = await API.Workshops.getAll();
```

### 2. Frontend ↔ Data (Fallback)

في حالة عدم توفر Backend، يتم التحميل من ملفات JSON:

```javascript
// يتحقق تلقائياً من توفر Backend ويستخدم JSON كبديل
const users = await API.getUsers();
const products = await API.getProducts();
```

### 3. Data ↔ Backend

البيانات في `data/*.json` تطابق هيكل قاعدة البيانات في `backend/database.sql`

## 📁 هيكل الملفات

```
منصة-صيت/
├── frontend/
│   ├── js/
│   │   ├── api.js          # ملف الربط الرئيسي
│   │   ├── main.js         # وظائف عامة
│   │   ├── talents.js      # صفحة المواهب
│   │   └── workshops.js    # صفحة الورش
│   └── *.html              # صفحات HTML
├── backend/
│   ├── api/                # API Endpoints
│   ├── models/             # Models
│   ├── config/             # إعدادات
│   ├── database.sql        # قاعدة البيانات
│   └── test-api.html       # صفحة اختبار API
└── data/
    ├── users.json          # بيانات المستخدمين
    ├── products.json       # بيانات المنتجات
    ├── workshops.json      # بيانات الورش
    └── *.json              # باقي البيانات
```

## 🚀 خطوات التشغيل

### الخيار 1: استخدام Backend + Database

1. **إنشاء قاعدة البيانات:**
```bash
mysql -u root -p < backend/database.sql
```

2. **تعديل إعدادات الاتصال:**
```php
// backend/config/database.php
private $host = "localhost";
private $db_name = "sayt_db";
private $username = "root";
private $password = "your_password";
```

3. **تشغيل الخادم:**
```bash
cd backend
php -S localhost:8000
```

4. **اختبار API:**
افتح `backend/test-api.html` في المتصفح

5. **تشغيل Frontend:**
افتح `frontend/index.html` في المتصفح

### الخيار 2: استخدام Data فقط (بدون Backend)

1. **تشغيل Frontend مباشرة:**
افتح `frontend/index.html` في المتصفح

2. **سيتم التحميل تلقائياً من ملفات JSON**

## 📊 مطابقة البيانات

### Users (المستخدمين)

**JSON:** `data/users.json`
```json
{
  "users": [
    {
      "id": 1,
      "name": "أحمد المعمري",
      "email": "ahmed@example.com",
      "type": "talent",
      "category": "photography"
    }
  ]
}
```

**Database:** جدول `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    type ENUM('talent', 'client'),
    category VARCHAR(50)
);
```

**API:** `GET /api/users.php`
```json
{
  "status": "success",
  "data": {
    "users": [...],
    "count": 5
  }
}
```

### Products (المنتجات)

**JSON:** `data/products.json`
**Database:** جدول `products`
**API:** `GET /api/products.php`

### Workshops (الورش)

**JSON:** `data/workshops.json`
**Database:** جدول `workshops`
**API:** `GET /api/workshops.php`

### Categories (التصنيفات)

**JSON:** `data/categories.json`
**Database:** جدول `categories`
**API:** `GET /api/categories.php`

### Orders (الطلبات)

**JSON:** `data/orders.json`
**Database:** جدول `orders`
**API:** `GET /api/orders.php`

### Reviews (التقييمات)

**JSON:** `data/reviews.json`
**Database:** جدول `reviews`
**API:** `GET /api/reviews.php`

## 🔧 استخدام API في Frontend

### مثال 1: عرض المواهب

```javascript
// في ملف talents-list.js
async function loadTalents() {
    try {
        const response = await API.getUsers({ type: 'talent' });
        const users = response.data.users;
        
        // عرض المواهب
        users.forEach(user => {
            displayTalent(user);
        });
    } catch (error) {
        console.error('Error loading talents:', error);
    }
}
```

### مثال 2: عرض المنتجات

```javascript
// في ملف store.js
async function loadProducts(category) {
    try {
        const response = await API.getProducts({ category });
        const products = response.data.products;
        
        // عرض المنتجات
        products.forEach(product => {
            displayProduct(product);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}
```

### مثال 3: إنشاء طلب

```javascript
// في ملف cart.js
async function createOrder(orderData) {
    try {
        const response = await API.Orders.create({
            buyer_id: 4,
            seller_id: 1,
            product_id: 1,
            quantity: 1,
            price: 150
        });
        
        if (response.status === 'success') {
            showToast('تم إنشاء الطلب بنجاح', 'success');
        }
    } catch (error) {
        showToast('فشل إنشاء الطلب', 'error');
    }
}
```

## ✅ التحقق من الترابط

### 1. التحقق من Backend

```bash
# تشغيل الخادم
cd backend
php -S localhost:8000

# اختبار API
curl http://localhost:8000/api/users.php
```

### 2. التحقق من Frontend

افتح `frontend/index.html` وافتح Console:

```javascript
// التحقق من توفر Backend
await API.checkBackendAvailability(); // true أو false

// التحقق من مصدر البيانات
await API.getDataSource(); // 'backend' أو 'json'

// تحميل بيانات
const users = await API.getUsers();
console.log(users);
```

### 3. التحقق من Data

```javascript
// تحميل من JSON مباشرة
fetch('../data/users.json')
    .then(r => r.json())
    .then(data => console.log(data));
```

## 🎯 الميزات

✅ **Automatic Fallback**: يتحول تلقائياً من Backend إلى JSON
✅ **Unified API**: واجهة موحدة للوصول للبيانات
✅ **Error Handling**: معالجة الأخطاء بشكل احترافي
✅ **Type Safety**: التحقق من أنواع البيانات
✅ **CORS Support**: دعم CORS للطلبات
✅ **RESTful**: API يتبع معايير REST

## 📝 ملاحظات مهمة

1. **CORS**: تأكد من تفعيل CORS في Backend
2. **Database**: تأكد من إنشاء قاعدة البيانات قبل التشغيل
3. **Paths**: تأكد من صحة المسارات في `api.js`
4. **JSON Files**: ملفات JSON للتطوير والاختبار فقط
5. **Production**: في الإنتاج، استخدم Backend فقط

## 🔐 الأمان

- جميع المدخلات يتم تنظيفها في Backend
- كلمات المرور مشفرة بـ BCRYPT
- استخدام Prepared Statements
- التحقق من الصلاحيات (قريباً)
- JWT Authentication (قريباً)

## 📞 الدعم

للمساعدة أو الاستفسارات:
- البريد: support@sayt.om
- الموقع: https://sayt.om

---

© 2024 منصة صيت - جميع الحقوق محفوظة
