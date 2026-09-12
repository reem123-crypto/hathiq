// Auth functionality
// Appwrite هو مصدر الحقيقة الأساسي دلوقتي لتسجيل الدخول والتسجيل.
// localStorage بقى مجرد fallback لحالة عدم توفر Appwrite (تطوير/اختبار أوفلاين) - مفيهوش كلمات سر حقيقية بعد كده.
document.addEventListener('DOMContentLoaded', () => {
    initializeAccountTypeSelection();
    initializeFileUploads();
    initializeLoginForm();
    initializeRegisterForm();
});

// Account Type Selection
function initializeAccountTypeSelection() {
    const accountTypeCards = document.querySelectorAll('.account-type-card');
    const talentInfo = document.getElementById('talentInfo');
    let selectedType = null;

    accountTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            accountTypeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedType = this.dataset.type;

            if (talentInfo) {
                if (selectedType === 'talent') {
                    talentInfo.classList.remove('hidden');
                    talentInfo.querySelectorAll('select[name="category"]').forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                } else {
                    talentInfo.classList.add('hidden');
                    talentInfo.querySelectorAll('select[name="category"]').forEach(field => {
                        field.removeAttribute('required');
                    });
                }
            }
        });
    });
}

// File Upload Handlers
function initializeFileUploads() {
    const cvFile = document.getElementById('cvFile');
    const photoFile = document.getElementById('photoFile');
    const cvFileName = document.getElementById('cvFileName');
    const photoFileName = document.getElementById('photoFileName');

    if (cvFile) {
        cvFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                cvFileName.textContent = '✓ ' + this.files[0].name;
            } else {
                cvFileName.textContent = '';
            }
        });
    }

    if (photoFile) {
        photoFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                photoFileName.textContent = '✓ ' + this.files[0].name;
            } else {
                photoFileName.textContent = '';
            }
        });
    }
}

// localStorage دلوقتي بقى fallback بس (دليل أوفلاين) - مفيهوش كلمات سر حقيقية
function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('site_users') || '[]');
    } catch (error) {
        return [];
    }
}

function setStoredUsers(users) {
    localStorage.setItem('site_users', JSON.stringify(users));
}

function normalizeUserRole(role) {
    const normalized = (role || 'client').toString().trim().toLowerCase();
    if (['admin', 'administrator', 'superadmin'].includes(normalized)) return 'admin';
    if (['talent', 'موهوب', 'freelancer'].includes(normalized)) return 'talent';
    if (['client', 'beneficiary', 'customer', 'مستفيد'].includes(normalized)) return 'client';
    return 'client';
}

function buildSessionUserPayload(sourceUser = {}, fallbackUser = null) {
    if (typeof window.createSessionUser === 'function') {
        return window.createSessionUser(sourceUser, fallbackUser);
    }

    const baseUser = fallbackUser || {};
    const firstName = sourceUser.firstName || sourceUser.name?.split(' ')[0] || baseUser.firstName || '';
    const lastName = sourceUser.lastName || (sourceUser.name ? sourceUser.name.split(' ').slice(1).join(' ') : '') || baseUser.lastName || '';

    return {
        id: sourceUser.id || baseUser.id || '',
        firstName,
        lastName,
        email: sourceUser.email || baseUser.email || '',
        role: normalizeUserRole(sourceUser.role || baseUser.role || ''),
        phone: sourceUser.phone || baseUser.phone || '',
        category: sourceUser.category || baseUser.category || '',
        bio: sourceUser.bio || baseUser.bio || '',
        experience: sourceUser.experience ?? baseUser.experience ?? '',
        city: sourceUser.city || baseUser.city || '',
        portfolio: sourceUser.portfolio || baseUser.portfolio || '',
        registeredAt: sourceUser.registeredAt || baseUser.registeredAt || '',
        avatar: sourceUser.avatar || baseUser.avatar || '',
        profileId: sourceUser.profileId || baseUser.profileId || null,
        sessionSource: sourceUser.sessionSource || baseUser.sessionSource || '',
        isDefaultProfile: false
    };
}

function getCurrentUser() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('site_current_user') || 'null');
        if (currentUser) return currentUser;

        const sessionData = JSON.parse(localStorage.getItem('site_session') || 'null');
        return sessionData?.user || null;
    } catch (error) {
        return null;
    }
}

function setCurrentUser(user) {
    const normalizedUser = user ? buildSessionUserPayload(user, getCurrentUser()) : null;
    localStorage.setItem('site_current_user', JSON.stringify(normalizedUser));
    localStorage.setItem('site_session', JSON.stringify({
        isLoggedIn: !!normalizedUser,
        user: normalizedUser,
        loggedInAt: new Date().toISOString(),
        source: normalizedUser?.sessionSource || 'default'
    }));

    if (typeof window.setSiteCurrentUser === 'function') {
        window.setSiteCurrentUser(normalizedUser);
    }
}

function getDefaultRedirect(role) {
    const normalizedRole = (role || '').toString().trim().toLowerCase();
    if (normalizedRole === 'admin') return 'admin.html';
    if (normalizedRole === 'talent') return 'dashboard.html';
    return 'beneficiary.html';
}

/**
 * تسجيل الدخول عبر Appwrite.
 * - لو AppwriteHelper مش متاح خالص (السكريبت مش متحمّل مثلاً): بيرجع null بهدوء (يسمح بالـ fallback المحلي).
 * - لو Appwrite متاح لكن البريد/الباسورد غلط أو أي خطأ فعلي: بيرمي (throw) الخطأ عشان الكولر يفرّق
 *   بين "Appwrite مش شغال" و"بيانات الدخول غلط".
 */
async function loginWithAppwrite(email, password) {
    if (!window.AppwriteHelper) return null;

    const user = await window.AppwriteHelper.createSession(email, password);

    // نجيب بروفايل المستخدم من كولكشن users عبر accountId
    let profile = null;
    try {
        const userProfiles = await window.AppwriteHelper.listDocuments('users', [
            window.AppwriteHelper.Query.equal('accountId', user.$id)
        ]);
        if (userProfiles.documents && userProfiles.documents.length > 0) {
            profile = userProfiles.documents[0];
        }
    } catch (profileError) {
        console.warn('⚠️ تعذّر جلب بروفايل المستخدم من قاعدة البيانات:', profileError);
    }

    return buildSessionUserPayload({
        id: user.$id,
        name: user.name || '',
        firstName: user.name ? user.name.split(' ')[0] : email.split('@')[0],
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email,
        role: profile?.type || user.prefs?.role || '',
        phone: profile?.phone || user.prefs?.phone || '',
        category: profile?.category || user.prefs?.category || '',
        bio: profile?.bio || user.prefs?.bio || '',
        experience: profile?.experience || user.prefs?.experience || '',
        city: profile?.city || user.prefs?.city || '',
        portfolio: profile?.portfolio || user.prefs?.portfolio || '',
        registeredAt: user.prefs?.registeredAt || '',
        avatar: profile?.avatar || (user.name ? user.name.charAt(0) : ''),
        profileId: profile?.$id || null,
        sessionSource: profile ? 'database' : 'appwrite-auth-only',
        isDefaultProfile: false
    }, getCurrentUser());
}

/**
 * إنشاء حساب عبر Appwrite (Auth + مستند بروفايل في كولكشن users).
 * ملاحظة: مفيش created_at/updated_at في الـ payload لأن كولكشن users معندوش الأعمدة دي -
 * Appwrite بيسجل $createdAt/$updatedAt تلقائيًا لوحده.
 */
async function signupWithAppwrite(user) {
    if (!window.AppwriteHelper) {
        console.warn('⚠️ AppwriteHelper غير متاح - سيتم الحفظ في localStorage فقط');
        return null;
    }

    console.log('📝 جاري محاولة إنشاء حساب في Appwrite...');

    const appwriteUser = await window.AppwriteHelper.createAccount({
        email: user.email,
        password: user.password,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        prefs: {
            phone: user.phone,
            category: user.category,
            bio: user.bio,
            experience: user.experience,
            city: user.city,
            portfolio: user.portfolio,
            registeredAt: user.registeredAt
        }
    });

    console.log('✅ تم إنشاء الحساب في Appwrite:', appwriteUser.$id);

    const userProfile = {
        accountId: appwriteUser.$id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        type: user.role,
        category: user.category,
        bio: user.bio,
        experience: parseInt(user.experience) || 0,
        city: user.city,
        rating: 0.0,
        reviews_count: 0,
        projects_completed: 0,
        avatar: (user.firstName || 'م').charAt(0),
        portfolio: user.portfolio,
        verified: false,
        status: 'active',
        // لا created_at ولا updated_at هنا - العمودين دول مش موجودين في كولكشن users
    };

    try {
        const userDoc = await window.AppwriteHelper.createDocument('users', userProfile);
        console.log('✅ تم إنشاء ملف المستخدم في قاعدة البيانات:', userDoc.$id);
        return { ...appwriteUser, profile: userDoc };
    } catch (dbError) {
        console.error('❌ تم إنشاء الحساب لكن فشل حفظ بروفايله في قاعدة البيانات:', dbError);
        // نرمي الخطأ بدل ما نبلعه - عشان المستخدم يعرف إن حسابه ناقص بروفايل ومحتاج تدخل يدوي
        throw new Error(`تم إنشاء الحساب لكن فشل حفظ بيانات البروفايل: ${dbError.message}`);
    }
}

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const existingUser = getCurrentUser();
    if (existingUser && loginForm) {
        window.location.href = getDefaultRedirect(existingUser.role);
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!email || !password) {
                window.showToast ? window.showToast('الرجاء إدخال البريد وكلمة المرور', 'error') : alert('الرجاء إدخال البريد وكلمة المرور');
                return;
            }

            // 1) نجرب Appwrite الأول دايمًا - هو مصدر الحقيقة
            let appwriteUser = null;
            let appwriteReachable = true;
            try {
                appwriteUser = await loginWithAppwrite(email, password);
                if (appwriteUser === null) appwriteReachable = false; // AppwriteHelper مش متاح خالص
            } catch (err) {
                console.warn('⚠️ فشل تسجيل الدخول عبر Appwrite:', err);
                appwriteReachable = true; // Appwrite شغال لكن البيانات غلط أو حصل خطأ فعلي
                appwriteUser = null;
            }

            if (appwriteUser) {
                setCurrentUser(appwriteUser);
                window.showToast ? window.showToast('تم تسجيل الدخول بنجاح', 'success') : alert('تم تسجيل الدخول بنجاح!');
                setTimeout(() => {
                    window.location.href = getDefaultRedirect(appwriteUser.role);
                }, 1000);
                return;
            }

            if (appwriteReachable) {
                // Appwrite شغال لكن البريد/الباسورد غلط - منرجعش لـ localStorage عشان منضللش المستخدم
                window.showToast ? window.showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error') : alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                return;
            }

            // 2) fallback: Appwrite مش متاح خالص (مثلاً السكريبت مش متحمّل) - نستخدم localStorage كخطة بديلة للتطوير فقط
            const users = getStoredUsers();
            const localUser = users.find(u => u.email === email);
            if (!localUser || (localUser.password && localUser.password !== password)) {
                window.showToast ? window.showToast('المستخدم غير موجود أو كلمة المرور غير صحيحة', 'error') : alert('المستخدم غير موجود أو كلمة المرور غير صحيحة');
                return;
            }

            setCurrentUser(localUser);
            window.showToast ? window.showToast('تم تسجيل الدخول (وضع محلي - Appwrite غير متاح)', 'success') : alert('تم تسجيل الدخول بنجاح!');
            setTimeout(() => {
                window.location.href = getDefaultRedirect(localUser.role);
            }, 1000);
        });
    }
}

// Register Form
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const existingUser = getCurrentUser();
    if (existingUser && registerForm) {
        window.location.href = getDefaultRedirect(existingUser.role);
        return;
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedCard = document.querySelector('.account-type-card.active');
            if (!selectedCard) {
                window.showToast ? window.showToast('الرجاء اختيار نوع الحساب', 'error') : alert('الرجاء اختيار نوع الحساب');
                return;
            }

            const accountType = selectedCard.dataset.type;
            const formData = new FormData(registerForm);
            formData.append('accountType', accountType);

            const password = (formData.get('password') || '').toString();
            const confirmPassword = (formData.get('confirmPassword') || '').toString();

            if (password.length < 8) {
                window.showToast ? window.showToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error') : alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                return;
            }

            if (password !== confirmPassword) {
                window.showToast ? window.showToast('كلمة المرور غير متطابقة', 'error') : alert('كلمة المرور غير متطابقة');
                return;
            }

            const newUser = {
                id: `u_${Date.now()}`,
                firstName: formData.get('firstName') || '',
                lastName: formData.get('lastName') || '',
                email: (formData.get('email') || '').trim().toLowerCase(),
                phone: formData.get('phone') || '',
                password: password, // بتتشال قبل ما نخزّن في localStorage لو Appwrite نجح - بص تحت
                role: accountType,
                category: formData.get('category') || '',
                bio: formData.get('bio') || '',
                experience: formData.get('experience') || '',
                city: formData.get('city') || '',
                portfolio: formData.get('portfolio') || '',
                registeredAt: new Date().toISOString(),
                avatar: (formData.get('firstName') || 'م').charAt(0)
            };

            let appwriteUser = null;
            let appwriteError = null;
            try {
                appwriteUser = await signupWithAppwrite(newUser);
            } catch (err) {
                appwriteError = err;
                console.error('❌ خطأ في إنشاء حساب Appwrite:', err);
            }

            if (appwriteUser) {
                // نجح Appwrite بالكامل - هو مصدر الحقيقة، منخزّنش الباسورد الحقيقي محليًا
                newUser.id = appwriteUser.$id;
                const localCacheUser = { ...newUser };
                delete localCacheUser.password; // ما نخزنش كلمة سر حقيقية في localStorage

                const users = getStoredUsers();
                const existingIndex = users.findIndex(u => u.email === newUser.email);
                if (existingIndex >= 0) {
                    users[existingIndex] = localCacheUser;
                } else {
                    users.push(localCacheUser);
                }
                setStoredUsers(users);

                const sessionUser = buildSessionUserPayload({
                    id: appwriteUser.$id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                    category: newUser.category,
                    bio: newUser.bio,
                    experience: newUser.experience,
                    city: newUser.city,
                    portfolio: newUser.portfolio,
                    registeredAt: newUser.registeredAt,
                    avatar: newUser.avatar,
                    profileId: appwriteUser.profile?.$id || null,
                    sessionSource: 'database'
                });
                setCurrentUser(sessionUser);
            } else {
                // فشل Appwrite بالكامل (مش متاح أو حصل خطأ) - fallback كامل لـ localStorage للتطوير فقط
                window.showToast
                    ? window.showToast(
                          appwriteError
                              ? `⚠️ فشل إنشاء الحساب على Appwrite: ${appwriteError.message}`
                              : '⚠️ Appwrite غير متاح - تم الحفظ محليًا فقط (وضع تطوير)',
                          'error'
                      )
                    : alert('⚠️ فشل إنشاء الحساب على Appwrite. افتح Console (F12) لترى التفاصيل.');

                const users = getStoredUsers();
                const existing = users.find(u => u.email === newUser.email);
                if (existing) {
                    window.showToast ? window.showToast('هذا البريد مستخدم بالفعل', 'error') : alert('هذا البريد مستخدم بالفعل');
                    return;
                }
                users.push(newUser); // هنا فقط بيتخزن الباسورد محليًا - لأن مفيش Appwrite أصلاً يتحقق منها
                setStoredUsers(users);
                setCurrentUser(newUser);
            }

            const message = accountType === 'talent'
                ? 'تم إنشاء حساب الموهوب بنجاح! ستتم مراجعة بياناتك قريباً.'
                : 'تم إنشاء الحساب بنجاح!';

            window.showToast ? window.showToast(message, 'success') : alert(message);

            setTimeout(() => {
                window.location.href = getDefaultRedirect(accountType);
            }, 2000);
        });
    }
}