# ⚙️ إعدادات Appwrite السريعة

## 🔴 المشكلة الأساسية

الكود لا يتصل بـ Appwrite لأن `DATABASE_ID` و `PROJECT_ID` قد تكون غير صحيحة.

---

## ✅ الحل السريع (3 دقائق)

### الخطوة 1️⃣: احصل على المعرفات من Appwrite

1. اذهب إلى [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. اختر مشروعك (حاذق)
3. اضغط على ⚙️ **Settings** أسفل اليمين
4. اختر **Settings** من القائمة

**ستجد:**
- **Project ID**: نسخ هذا
- **Endpoint**: يجب أن يكون `https://fra.cloud.appwrite.io/v1`

### الخطوة 2️⃣: احصل على Database ID

1. من نفس الصفحة اختر **Databases**
2. اختر قاعدة البيانات (أو أنشئ واحدة جديدة)
3. انسخ **Database ID**

### الخطوة 3️⃣: حدّث الملف

افتح: `frontend/js/appwrite-helper.js`

غيّر السطور 6-9:

```javascript
// ❌ القديم
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6a01a17c0019070903f1';
const APPWRITE_DATABASE_ID = 'default';

// ✅ الجديد (استبدل القيم)
const APPWRITE_ENDPOINT = 'https://YOUR_ENDPOINT'; // من Settings
const APPWRITE_PROJECT_ID = 'YOUR_PROJECT_ID';     // من Settings
const APPWRITE_DATABASE_ID = 'YOUR_DATABASE_ID';   // من Databases
```

### الخطوة 4️⃣: أنشئ Collection "users"

1. في Appwrite اختر: **Databases → قاعدتك**
2. اضغط **+ Create Collection**
3. اسم: `users` → اضغط Create
4. في Permissions (التبويب الأخير):
   - اضغط **+ Add Permission**
   - اختر: `Any`
   - اختر: `All Permissions`
   - اضغط Add

### الخطوة 5️⃣: اختبر الآن

1. افتح متصفح وأعد تحميل الصفحة
2. افتح Console (F12)
3. جرّب التسجيل
4. ابحث عن ✅ أو ❌ في Console

---

## 🛑 إذا استمرت المشاكل

افتح Console وانسخ هذا:

```javascript
console.log('Endpoint:', window.AppwriteHelper.APPWRITE_ENDPOINT);
console.log('Project:', window.AppwriteHelper.APPWRITE_PROJECT_ID);
console.log('Database:', window.AppwriteHelper.APPWRITE_DATABASE_ID);
```

تأكد من أن القيم صحيحة وتطابق Appwrite Console.

---

## 📋 قائمة التحقق النهائية

- [ ] نسخت Project ID من Appwrite
- [ ] نسخت Database ID من Appwrite
- [ ] أنشأت Collection "users" في Appwrite
- [ ] أضفت الصلاحيات (Permissions) للـ Collection
- [ ] عدّلت القيم في `appwrite-helper.js`
- [ ] أعدت تحميل الصفحة
- [ ] فتحت Console وجربت التسجيل

**إذا أكملت كل شيء ستنجح! ✅**

