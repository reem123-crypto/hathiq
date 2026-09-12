# 🚀 دليل البدء السريع - Quick Start Guide

## ⚡ البدء في 5 دقائق

### الخيار 1: تشغيل سريع (Frontend فقط)

```bash
# 1. افتح الصفحة الرئيسية
open frontend/index.html

# أو استخدم خادم محلي
cd frontend
python -m http.server 3000
# ثم افتح: http://localhost:3000
```

✅ **يعمل الآن!** البيانات تُحمّل من ملفات JSON

---

### الخيار 2: تشغيل كامل (Frontend + Backend)

#### الخطوة 1: إعداد قاعدة البيانات (دقيقة واحدة)

```bash
# افتح MySQL
mysql -u root -p

# نفذ السكريبت
source backend/database.sql

# أو من phpMyAdmin:
# استورد ملف backend/database.sql
```

#### الخطوة 2: تعديل الإعدادات (30 ثانية)

```php
// افتح: backend/config/database.php
// عدّل السطر 9:
private $password = ""; // ضع كلمة مرور MySQL هنا
```

#### الخطوة 3: تشغيل Backend (10 ثوان)

```bash
cd backend
php -S localhost:8000
```

#### الخطوة 4: اختبار API (30 ثانية)

افتح في المتصفح:
```
http://localhost:8000/test-api.html
```

اضغط على أي زر للاختبار. إذا رأيت ✅ نجح الاتصال، فكل شيء يعمل!

#### الخطوة 5: تشغيل Frontend (10 ثوان)

```bash
# في نافذة terminal جديدة
cd frontend
open index.html
```

✅ **تم!** المنصة تعمل بالكامل

---

## 🧪 اختبار سريع

### اختبار Backend

```bash
# في terminal
curl http://localhost:8000/api/categories.php
```

يجب أن ترى:
```json
{
  "status": "success",
  "data": {
    "categories": [...]
  }
}
```

### اختبار Frontend

افتح `frontend/index.html` ثم افتح Console (F12) واكتب:

```javascript
// اختبار توفر Backend
await API.checkBackendAvailability()
// يجب أن يرجع: true

// اختبار جلب البيانات
const users = await API.getUsers()
console.log(users)
// يجب أن ترى قائمة المستخدمين
```

---

## 📁 الملفات المهمة

```
📂 منصة-صيت/
├── 📄 README.md                    ← ابدأ هنا
├── 📄 QUICK_START.md              ← هذا الملف
├── 📄 INTEGRATION_GUIDE.md        ← دليل الربط التفصيلي
├── 📄 VERIFICATION_CHECKLIST.md   ← قائمة التحقق
│
├── 📂 frontend/
│   ├── 📄 index.html              ← الصفحة الرئيسية
│   └── 📂 js/
│       └── 📄 api.js              ← ملف الربط مع Backend
│
├── 📂 backend/
│   ├── 📄 database.sql            ← قاعدة البيانات
│   ├── 📄 test-api.html           ← صفحة اختبار API
│   └── 📄 README.md               ← توثيق Backend
│
└── 📂 data/
    ├── 📄 users.json              ← بيانات المستخدمين
    └── 📄 README.md               ← توثيق البيانات
```

---

## 🎯 الصفحات الرئيسية

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `frontend/index.html` | الصفحة الرئيسية |
| المواهب | `frontend/talents.html` | المجالات الإبداعية |
| قائمة المواهب | `frontend/talents-list.html` | قائمة المواهب |
| المتجر | `frontend/store.html` | المتجر (قريباً) |
| الورش | `frontend/workshops.html` | الورش التدريبية |
| المجتمع | `frontend/community.html` | المجتمع |
| تسجيل الدخول | `frontend/login.html` | تسجيل الدخول |

---

## 🔧 حل المشاكل الشائعة

### مشكلة: Backend لا يعمل

```bash
# تأكد من تشغيل الخادم
cd backend
php -S localhost:8000

# تأكد من المنفذ 8000 غير مستخدم
lsof -i :8000
```

### مشكلة: قاعدة البيانات لا تعمل

```bash
# تأكد من تشغيل MySQL
mysql.server start  # Mac
sudo service mysql start  # Linux

# تأكد من إنشاء قاعدة البيانات
mysql -u root -p -e "SHOW DATABASES LIKE 'sayt_db';"
```

### مشكلة: CORS Error

```php
// تأكد من وجود هذا في backend/config/config.php
header("Access-Control-Allow-Origin: *");
```

### مشكلة: Frontend لا يحمل البيانات

```javascript
// افتح Console (F12) وتحقق من:
await API.getDataSource()
// إذا رجع 'json' فالبيانات تُحمّل من JSON
// إذا رجع 'backend' فالبيانات تُحمّل من Backend
```

---

## 📚 الخطوات التالية

1. ✅ **اقرأ** `README.md` للتفاصيل الكاملة
2. ✅ **راجع** `INTEGRATION_GUIDE.md` لفهم الربط
3. ✅ **استكشف** الكود في `frontend/js/api.js`
4. ✅ **جرّب** API من `backend/test-api.html`
5. ✅ **طوّر** ميزات جديدة!

---

## 💡 نصائح

- 🔥 استخدم **Live Server** في VS Code للتطوير
- 🔥 افتح **Console** دائماً لرؤية الأخطاء
- 🔥 استخدم **test-api.html** لاختبار Backend
- 🔥 راجع **VERIFICATION_CHECKLIST.md** للتأكد من كل شيء

---

## 🎉 مبروك!

أنت الآن جاهز لاستخدام منصة صيت!

### ماذا بعد؟

- 🚀 ابدأ التطوير
- 📝 أضف ميزات جديدة
- 🎨 خصص التصميم
- 🔐 أضف المصادقة
- 📱 طوّر تطبيق محمول

---

## 📞 تحتاج مساعدة؟

- 📧 البريد: support@sayt.om
- 🌐 الموقع: https://sayt.om
- 📖 التوثيق: راجع ملفات README

---

**صُنع بـ ❤️ في سلطنة عمان**

© 2024 منصة صيت - جميع الحقوق محفوظة
