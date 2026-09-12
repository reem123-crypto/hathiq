# 🔧 إعداد XAMPP لمنصة صيت

## الخطوة 1: تشغيل XAMPP

1. افتح **XAMPP Control Panel**
2. اضغط **Start** بجانب:
   - ✅ Apache
   - ✅ MySQL

انتظر حتى يتحول اللون إلى أخضر

---

## الخطوة 2: إنشاء قاعدة البيانات

### الطريقة 1: من phpMyAdmin (سهلة)

1. افتح المتصفح واذهب إلى: http://localhost/phpmyadmin
2. اضغط على **New** (جديد) في الجانب الأيسر
3. اسم قاعدة البيانات: `sayt_db`
4. Collation: `utf8mb4_unicode_ci`
5. اضغط **Create** (إنشاء)
6. اضغط على **Import** (استيراد)
7. اختر ملف: `backend/database.sql`
8. اضغط **Go** (تنفيذ)

✅ تم! قاعدة البيانات جاهزة

### الطريقة 2: من Terminal

```bash
# افتح XAMPP Shell أو CMD
cd C:\xampp\mysql\bin

# تسجيل الدخول
mysql -u root -p
# (اضغط Enter بدون كلمة مرور)

# إنشاء قاعدة البيانات
CREATE DATABASE sayt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sayt_db;

# استيراد البيانات
source C:/Users/2101006/Desktop/sample/backend/database.sql;

# الخروج
exit;
```

---

## الخطوة 3: تعديل إعدادات الاتصال

افتح ملف: `backend/config/database.php`

عدّل السطر 9:

```php
// قبل:
private $password = "";

// بعد (إذا كان لديك كلمة مرور):
private $password = "your_password";

// أو اتركها فارغة إذا لم تضع كلمة مرور في XAMPP
private $password = "";
```

احفظ الملف

---

## الخطوة 4: نسخ المشروع إلى XAMPP (اختياري)

إذا أردت تشغيل المشروع من XAMPP:

1. انسخ مجلد `backend` إلى: `C:\xampp\htdocs\sayt-backend`
2. انسخ مجلد `frontend` إلى: `C:\xampp\htdocs\sayt-frontend`

ثم افتح:
- Frontend: http://localhost/sayt-frontend
- Backend: http://localhost/sayt-backend

---

## الخطوة 5: تشغيل Backend

### الطريقة 1: من مجلد المشروع الحالي

افتح Terminal في مجلد المشروع:

```bash
cd backend
php -S localhost:8000
```

Backend يعمل على: http://localhost:8000

### الطريقة 2: من XAMPP

إذا نسخت المشروع إلى htdocs:

Backend يعمل على: http://localhost/sayt-backend

---

## الخطوة 6: اختبار API

افتح في المتصفح:
- http://localhost:8000/test-api.html (إذا استخدمت php -S)
- http://localhost/sayt-backend/test-api.html (إذا استخدمت XAMPP)

اضغط على الأزرار للاختبار. يجب أن ترى ✅ نجح الاتصال

---

## الخطوة 7: تشغيل Frontend

افتح ملف: `frontend/index.html`

أو افتح: http://localhost/sayt-frontend (إذا نسخته إلى XAMPP)

---

## ✅ تم! المشروع يعمل بالكامل

الآن لديك:
- ✅ Frontend يعمل
- ✅ Backend يعمل
- ✅ Database جاهزة
- ✅ API تعمل

---

## 🔧 حل المشاكل

### مشكلة: Port 80 مستخدم

إذا لم يشتغل Apache:
1. افتح XAMPP Config → Apache → httpd.conf
2. غيّر `Listen 80` إلى `Listen 8080`
3. احفظ وأعد تشغيل Apache
4. افتح: http://localhost:8080

### مشكلة: MySQL لا يعمل

1. تأكد من عدم وجود MySQL آخر يعمل
2. أوقف أي MySQL خارجي
3. أعد تشغيل XAMPP MySQL

### مشكلة: CORS Error

تأكد من وجود هذا في `backend/config/config.php`:
```php
header("Access-Control-Allow-Origin: *");
```

---

## 📞 تحتاج مساعدة؟

راجع:
- `QUICK_START.md`
- `README.md`
- `INTEGRATION_GUIDE.md`

---

© 2024 منصة صيت
