# 🔧 دليل استكشاف أخطاء Appwrite

## المشكلة: "فشل إنشاء الحساب على Appwrite"

---

## ✅ الخطوات التشخيصية (من الأسهل إلى الأصعب)

### 1️⃣ **تفعيل وضع تصحيح الأخطاء** (الأهم!)
افتح المتصفح وافتح Developer Tools:
- **Windows/Linux**: اضغط `F12`
- **Mac**: اضغط `Cmd + Option + I`

اذهب إلى tab **Console** وابحث عن الرسائل الحمراء ❌ والخضراء ✅

---

### 2️⃣ **اختبر الاتصال بـ Appwrite**

انسخ هذا الكود واللصقه في Console:

```javascript
// اختبر تحميل SDK
console.log('SDK Status:', window.appwrite ? '✅ محمّل' : '❌ غير محمّل');

// اختبر الاتصال
window.AppwriteHelper.init()
    .then(() => console.log('✅ تم الاتصال بـ Appwrite بنجاح!'))
    .catch(err => console.error('❌ فشل الاتصال:', err));
```

**النتائج المتوقعة:**
- ✅ `✅ Appwrite initialized successfully` = الاتصال ناجح
- ❌ `Failed to load Appwrite SDK` = مشكلة في تحميل SDK
- ❌ `Failed to load SDK` = مشكلة في الإنترنت

---

### 3️⃣ **تحقق من إعدادات Appwrite**

افتح [Appwrite Console](https://cloud.appwrite.io)

**الخطوة أ: تحقق من Project ID**
```
1. اذهب إلى: Settings → Project
2. انسخ Project ID
3. قارنه مع السطر 7 في: frontend/js/appwrite-helper.js
```

**الخطوة ب: تحقق من Database ID**
```
1. اذهب إلى: Databases
2. اختر قاعدتك أو انشئ واحدة جديدة
3. انسخ Database ID
4. تأكد أنه يطابق السطر 9 في: frontend/js/appwrite-helper.js
```

**الخطوة ج: تحقق من Collections**
```
1. اذهب إلى: Databases → قاعدتك
2. تأكد من وجود Collection باسم: 'users'
3. إذا لم توجد:
   - اضغط "+ Create Collection"
   - اسم Collection: users
   - اضغط Create
   - أضف الحقول التالية:
     ✓ accountId (String)
     ✓ name (String)
     ✓ email (String)
     ✓ phone (String)
     ✓ type (String)
     ✓ category (String)
     ✓ bio (String)
```

**الخطوة د: تحقق من Permissions**
```
1. اذهب إلى: Database → 'users' Collection → Settings
2. اختر "Permissions" tab
3. تأكد من وجود:
   - Role: 'any' (أي مستخدم)
   - Permissions: ✓ create ✓ read ✓ update ✓ delete
4. إذا لم تكن موجودة:
   - اضغط "+ Add Permission"
   - اختر: Any
   - اختر: All Permissions
   - اضغط Add
```

---

### 4️⃣ **الأخطاء الشائعة وحلولها**

#### ❌ خطأ: "Project not found"
```
السبب: Project ID خاطئ أو غير موجود
الحل:
1. تحقق من Project ID في Appwrite Console
2. غيّر السطر 7 في: frontend/js/appwrite-helper.js
3. أعد تحميل الصفحة
```

#### ❌ خطأ: "Database not found"
```
السبب: Database ID خاطئ
الحل:
1. اذهب إلى Appwrite → Databases
2. انسخ Database ID الصحيح
3. غيّر السطر 9 في: frontend/js/appwrite-helper.js
4. أعد تحميل الصفحة
```

#### ❌ خطأ: "Collection not found"
```
السبب: Collection 'users' غير موجود
الحل:
1. اذهب إلى: Databases → Database الخاص بك
2. أنشئ Collection جديد باسم 'users'
3. أضف الحقول المطلوبة
4. تحقق من Permissions
```

#### ❌ خطأ: "Permission denied"
```
السبب: لا توجد صلاحيات للكتابة
الحل:
1. اذهب إلى: Database → Collection → Settings
2. اختر Permissions tab
3. أضف "Any" مع جميع الصلاحيات
```

#### ❌ خطأ: "Invalid email format"
```
السبب: البريد الإلكتروني غير صحيح
الحل:
1. تأكد من أن البريد يحتوي على @
2. استخدم صيغة صحيحة مثل: user@example.com
```

#### ❌ خطأ: "Password must be at least 8 characters"
```
السبب: كلمة المرور قصيرة جداً
الحل:
1. استخدم كلمة مرور 8 أحرف على الأقل
2. اجعلها قوية: أحرف + أرقام + رموز
```

---

### 5️⃣ **اختبار كامل التسلسل**

1. **افتح Console (F12)**
2. **انسخ هذا الكود:**

```javascript
async function testAppwrite() {
    console.log('🧪 اختبار Appwrite...\n');
    
    try {
        // 1. اختبر التهيئة
        console.log('1️⃣ اختبر التهيئة...');
        await window.AppwriteHelper.init();
        console.log('✅ التهيئة نجحت\n');
        
        // 2. اختبر قائمة المستندات
        console.log('2️⃣ اختبر جلب المستندات من collection users...');
        const users = await window.AppwriteHelper.listDocuments('users', []);
        console.log('✅ جلب المستندات نجح:', users.documents.length, 'مستند\n');
        
        // 3. معلومات Appwrite
        console.log('3️⃣ معلومات الاتصال:');
        console.log('- Endpoint:', window.AppwriteHelper.APPWRITE_ENDPOINT);
        console.log('- Project ID:', window.AppwriteHelper.APPWRITE_PROJECT_ID);
        console.log('- Database ID:', window.AppwriteHelper.APPWRITE_DATABASE_ID);
        console.log('\n✅ جميع الاختبارات نجحت!');
        
    } catch (error) {
        console.error('❌ فشل الاختبار:', error.message);
        console.error('تفاصيل الخطأ:', error);
    }
}

testAppwrite();
```

3. **اللصق في Console واضغط Enter**
4. **ابحث عن الرسائل الخضراء ✅ أو الحمراء ❌**

---

### 6️⃣ **تحديث إصدار SDK**

إذا استمرت المشاكل، جرّب تحديث إصدار Appwrite:

في `frontend/js/appwrite-helper.js`، السطر 10:

```javascript
// ❌ قديم
const SDK_URL = 'https://cdn.jsdelivr.net/npm/appwrite@8.0.0/dist/appwrite.min.js';

// ✅ جديد
const SDK_URL = 'https://cdn.jsdelivr.net/npm/appwrite@14.0.1/dist/appwrite.min.js';
```

ثم أعد تحميل الصفحة.

---

### 7️⃣ **خطوات النهاية**

بعد إصلاح المشاكل، جرّب هذه:

1. **انسخ localStorage:**
```javascript
localStorage.removeItem('site_current_user');
```

2. **أعد تحميل الصفحة**: `F5` أو `Ctrl+Shift+R`

3. **حاول التسجيل جديداً:**
   - استخدم بريد فعلي: `test@example.com`
   - كلمة مرور قوية: `Password123!`
   - اسم: `أحمد` و `علي`

4. **تحقق من Appwrite Console:**
   - اذهب إلى: Databases → users
   - يجب أن ترى المستخدم الجديد!

---

## 📞 المساعدة الإضافية

### رسائل مفيدة في Console:
- ✅ `Appwrite initialized successfully` = جيد!
- ✅ `جاري إنشاء حساب Appwrite...` = قيد الإنشاء
- ✅ `تم إنشاء الحساب بنجاح` = نجح!
- ❌ أي رسالة حمراء = خطأ (اقرأها بعناية)

### ملفات مهمة:
- `frontend/js/appwrite-helper.js` - إعدادات الاتصال
- `frontend/js/auth.js` - تسجيل وتسجيل الدخول
- Developer Console - تتبع الأخطاء

---

**اتبع هذه الخطوات بالترتيب وستجد المشكلة! 💪**

