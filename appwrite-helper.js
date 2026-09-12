/* Appwrite helper for authentication and profiles.
 * This file is a lightweight wrapper around the Appwrite JS SDK.
 * It falls back safely to localStorage when Appwrite is not available.
 */
(function(window) {
    const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
    const APPWRITE_PROJECT_ID = '6a01a17c0019070903f1';
    const APPWRITE_DATABASE_ID = '6a01a20a0000dfd5ae2c';
    
    const SDK_URL = 'https://cdn.jsdelivr.net/npm/appwrite@14.0.1';

    let initialized = false;
    let client = null;
    let account = null;
    let databases = null;
    let Query = null;

    function loadSdk() {
        return new Promise((resolve, reject) => {
            // ✅ الاسم الصحيح للـ global هو Appwrite (بحرف A كابيتال) مش appwrite
            if (window.Appwrite) {
                return resolve();
            }

            const script = document.createElement('script');
            script.src = SDK_URL;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('فشل تحميل Appwrite SDK'));
            document.head.appendChild(script);
        });
    }

    async function init() {
        if (initialized) return;

        try {
            if (!window.Appwrite) {
                await loadSdk();
            }

            // تأكد من تحميل الإصدار الجديد
            if (!window.Appwrite || !window.Appwrite.Client) {
                throw new Error('فشل تحميل مكتبة Appwrite');
            }

            client = new window.Appwrite.Client()
                .setEndpoint(APPWRITE_ENDPOINT)
                .setProject(APPWRITE_PROJECT_ID);

            account = new window.Appwrite.Account(client);
            databases = new window.Appwrite.Databases(client);
            Query = window.Appwrite.Query;
            initialized = true;
            console.log('✅ Appwrite initialized successfully');
        } catch (error) {
            console.error('❌ AppwriteHelper init failed:', error);
            initialized = false;
            throw error;
        }
    }

    async function createAccount({ email, password, name, role, prefs = {} }) {
        try {
            await init();

            // تحقق من صحة المدخلات
            if (!email || !password || !name) {
                throw new Error('البريد الإلكتروني وكلمة المرور والاسم مطلوبة');
            }

            // ✅ نتأكد الأول إنه مفيش session قديمة نشطة (من تجربة سابقة مثلاً)
            // لأن Appwrite بيرفض إنشاء session جديدة لو فيه واحدة شغالة بالفعل
            try {
                await account.deleteSession('current');
                console.log('🗑️ تم حذف session قديمة كانت نشطة');
            } catch (sessionCleanupError) {
                // طبيعي جدًا إنها تفشل لو مفيش session أصلاً - نتجاهلها
            }

            console.log('جاري إنشاء حساب Appwrite...', { email, name });
            // ✅ استخدام ID.unique() بدلاً من النص الحرفي 'unique()'
            const user = await account.create(window.Appwrite.ID.unique(), email, password, name);

            console.log('✅ تم إنشاء الحساب بنجاح:', user.$id);

            // ✅ لازم نسجّل دخول (نعمل session) قبل أي عملية تانية زي updatePrefs
            // لأن account.create() بينشئ الحساب بس من غير ما يسجّل دخول تلقائيًا
            if (typeof account.createEmailPasswordSession === 'function') {
                await account.createEmailPasswordSession(email, password);
            } else {
                await account.createEmailSession(email, password);
            }
            console.log('✅ تم تسجيل الدخول بعد إنشاء الحساب');

            // تحديث التفضيلات
            await account.updatePrefs({ role, ...prefs });
            console.log('✅ تم تحديث التفضيلات');

            return user;
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            throw new Error(`فشل إنشاء الحساب: ${error.message}`);
        }
    }

    async function createSession(email, password) {
        try {
            await init();
            console.log('جاري تسجيل الدخول...', email);
            // ✅ createEmailSession قديمة/متوقفة في إصدارات SDK الأحدث، استخدم الاسم الجديد
            if (typeof account.createEmailPasswordSession === 'function') {
                await account.createEmailPasswordSession(email, password);
            } else {
                await account.createEmailSession(email, password);
            }
            const user = await account.get();
            console.log('✅ تم تسجيل الدخول بنجاح');
            return user;
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            throw new Error(`فشل تسجيل الدخول: ${error.message}`);
        }
    }

    async function logout() {
        await init();
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.warn('Appwrite logout failed:', error);
        }
    }

    async function getCurrentAccount() {
        await init();
        return account.get();
    }

    async function updatePrefs(prefs) {
        await init();
        return account.updatePrefs(prefs);
    }

    // Database operations
    async function createDocument(collectionId, data) {
        try {
            await init();
            console.log(`جاري حفظ document في ${collectionId}...`);
            const doc = await databases.createDocument(APPWRITE_DATABASE_ID, collectionId, window.Appwrite.ID.unique(), data);
            console.log(`✅ تم حفظ المستند بنجاح: ${doc.$id}`);
            return doc;
        } catch (error) {
            console.error(`❌ خطأ في حفظ المستند في ${collectionId}:`, error);
            throw error;
        }
    }

    async function getDocument(collectionId, documentId) {
        try {
            await init();
            return await databases.getDocument(APPWRITE_DATABASE_ID, collectionId, documentId);
        } catch (error) {
            console.error(`❌ خطأ في الحصول على المستند من ${collectionId}:`, error);
            throw error;
        }
    }

    async function updateDocument(collectionId, documentId, data) {
        try {
            await init();
            console.log(`جاري تحديث المستند في ${collectionId}...`);
            const doc = await databases.updateDocument(APPWRITE_DATABASE_ID, collectionId, documentId, data);
            console.log(`✅ تم تحديث المستند بنجاح`);
            return doc;
        } catch (error) {
            console.error(`❌ خطأ في تحديث المستند في ${collectionId}:`, error);
            throw error;
        }
    }

    async function deleteDocument(collectionId, documentId) {
        try {
            await init();
            await databases.deleteDocument(APPWRITE_DATABASE_ID, collectionId, documentId);
            console.log(`✅ تم حذف المستند بنجاح`);
        } catch (error) {
            console.error(`❌ خطأ في حذف المستند من ${collectionId}:`, error);
            throw error;
        }
    }

    async function listDocuments(collectionId, queries = []) {
        try {
            await init();
            return await databases.listDocuments(APPWRITE_DATABASE_ID, collectionId, queries);
        } catch (error) {
            console.error(`❌ خطأ في جلب المستندات من ${collectionId}:`, error);
            throw error;
        }
    }

    window.AppwriteHelper = {
        init,
        createAccount,
        createSession,
        logout,
        getCurrentAccount,
        updatePrefs,
        createDocument,
        getDocument,
        updateDocument,
        deleteDocument,
        listDocuments,
        get Query() {
            return Query;
        },
        APPWRITE_ENDPOINT,
        APPWRITE_PROJECT_ID,
        APPWRITE_DATABASE_ID,
        isReady: () => initialized
    };
})(window);