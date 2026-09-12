@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🌟 منصة صيت - Sayt Platform 🌟              ║
echo ║                                                            ║
echo ║          منصة رقمية لتنظيم وتمكين المواهب العمانية          ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  اختر طريقة التشغيل:                                      │
echo └────────────────────────────────────────────────────────────┘
echo.
echo   [1] تشغيل سريع (Frontend فقط - بدون Backend)
echo       ↳ يعمل مباشرة بدون إعداد
echo       ↳ البيانات من ملفات JSON
echo.
echo   [2] تشغيل كامل (Frontend + Backend + Database)
echo       ↳ يحتاج إعداد MySQL
echo       ↳ جميع الميزات متاحة
echo.
echo   [3] إعداد قاعدة البيانات فقط
echo       ↳ إنشاء Database
echo.
echo   [4] اختبار Backend API
echo       ↳ صفحة اختبار API
echo.
echo   [5] فتح التوثيق
echo       ↳ دليل الاستخدام
echo.
echo   [0] خروج
echo.
echo ────────────────────────────────────────────────────────────
echo.
set /p choice="اختر رقم (1-5): "

if "%choice%"=="1" goto quick_start
if "%choice%"=="2" goto full_start
if "%choice%"=="3" goto setup_db
if "%choice%"=="4" goto test_api
if "%choice%"=="5" goto docs
if "%choice%"=="0" goto end

echo.
echo [خطأ] اختيار غير صحيح!
timeout /t 2 >nul
goto start

:quick_start
cls
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  🚀 تشغيل سريع - Frontend فقط                            │
echo └────────────────────────────────────────────────────────────┘
echo.
echo [1/2] فتح الموقع...
start frontend/index.html
timeout /t 2 >nul
echo [✓] تم فتح الموقع في المتصفح
echo.
echo [2/2] معلومات:
echo   • الموقع يعمل الآن
echo   • البيانات من: data/*.json
echo   • لا يحتاج Backend
echo.
echo ────────────────────────────────────────────────────────────
echo.
pause
goto start

:full_start
cls
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  🚀 تشغيل كامل - Full Stack                              │
echo └────────────────────────────────────────────────────────────┘
echo.
echo [1/4] التحقق من المتطلبات...
echo.

REM Check PHP
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [✗] PHP غير مثبت!
    echo     يرجى تثبيت PHP أو XAMPP
    echo.
    pause
    goto start
)
echo [✓] PHP موجود

REM Check MySQL
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [✗] MySQL غير مثبت!
    echo     يرجى تثبيت MySQL أو XAMPP
    echo.
    pause
    goto start
)
echo [✓] MySQL موجود
echo.

echo [2/4] هل قمت بإعداد قاعدة البيانات؟
echo.
set /p db_ready="   (y/n): "

if /i "%db_ready%"=="n" (
    echo.
    echo [!] يجب إعداد قاعدة البيانات أولاً
    echo     اختر [3] من القائمة الرئيسية
    echo.
    pause
    goto start
)

echo.
echo [3/4] تشغيل Backend...
start "Sayt Backend" cmd /k "cd backend && echo Backend يعمل على: http://localhost:8000 && echo صفحة اختبار: http://localhost:8000/test-api.html && echo. && php -S localhost:8000"
timeout /t 3 >nul
echo [✓] Backend يعمل على: http://localhost:8000
echo.

echo [4/4] تشغيل Frontend...
start frontend/index.html
timeout /t 2 >nul
echo [✓] Frontend يعمل
echo.

echo ════════════════════════════════════════════════════════════
echo.
echo   ✅ المنصة تعمل بالكامل!
echo.
echo   📱 الموقع: frontend/index.html
echo   🔧 Backend: http://localhost:8000
echo   🧪 اختبار API: http://localhost:8000/test-api.html
echo.
echo   💡 نصيحة: افتح صفحة اختبار API للتأكد من عمل Backend
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
goto start

:setup_db
cls
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  🗄️  إعداد قاعدة البيانات                                │
echo └────────────────────────────────────────────────────────────┘
echo.

where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [✗] MySQL غير مثبت!
    echo.
    echo يرجى تثبيت أحد التالي:
    echo   • MySQL Server
    echo   • XAMPP
    echo   • WAMP
    echo.
    pause
    goto start
)

echo [1/3] MySQL موجود ✓
echo.
echo [2/3] إنشاء قاعدة البيانات...
echo.
echo سيطلب منك إدخال كلمة مرور MySQL (root)
echo.

mysql -u root -p < backend/database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [✓] تم إنشاء قاعدة البيانات بنجاح!
    echo.
    echo [3/3] الخطوة التالية:
    echo.
    echo   1. افتح: backend/config/database.php
    echo   2. عدّل كلمة المرور في السطر 9:
    echo      private $password = "your_password";
    echo   3. احفظ الملف
    echo   4. ارجع للقائمة واختر [2] للتشغيل الكامل
    echo.
    echo ────────────────────────────────────────────────────────────
    echo.
    set /p open_config="هل تريد فتح ملف الإعدادات الآن؟ (y/n): "
    if /i "%open_config%"=="y" (
        start notepad backend/config/database.php
    )
) else (
    echo.
    echo [✗] فشل إنشاء قاعدة البيانات
    echo.
    echo تأكد من:
    echo   • تشغيل MySQL Server
    echo   • كلمة المرور صحيحة
    echo   • لديك صلاحيات الإنشاء
    echo.
)

echo.
pause
goto start

:test_api
cls
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  🧪 اختبار Backend API                                    │
echo └────────────────────────────────────────────────────────────┘
echo.

where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [✗] PHP غير مثبت!
    pause
    goto start
)

echo [1/2] تشغيل Backend...
start "Sayt Backend" cmd /k "cd backend && php -S localhost:8000"
timeout /t 3 >nul
echo [✓] Backend يعمل
echo.

echo [2/2] فتح صفحة الاختبار...
start http://localhost:8000/test-api.html
timeout /t 2 >nul
echo [✓] تم فتح صفحة الاختبار
echo.

echo ════════════════════════════════════════════════════════════
echo.
echo   ✅ صفحة اختبار API مفتوحة
echo.
echo   اضغط على الأزرار لاختبار API Endpoints
echo   إذا رأيت ✅ نجح الاتصال، فكل شيء يعمل!
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
goto start

:docs
cls
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  📚 التوثيق والمساعدة                                     │
echo └────────────────────────────────────────────────────────────┘
echo.
echo   [1] README.md - التوثيق الرئيسي
echo   [2] QUICK_START.md - دليل البدء السريع
echo   [3] INTEGRATION_GUIDE.md - دليل الربط
echo   [4] VERIFICATION_CHECKLIST.md - قائمة التحقق
echo   [5] PROJECT_SUMMARY.md - ملخص المشروع
echo   [6] backend/README.md - توثيق Backend
echo   [7] data/README.md - توثيق البيانات
echo.
echo   [0] رجوع
echo.
set /p doc_choice="اختر رقم: "

if "%doc_choice%"=="1" start README.md
if "%doc_choice%"=="2" start QUICK_START.md
if "%doc_choice%"=="3" start INTEGRATION_GUIDE.md
if "%doc_choice%"=="4" start VERIFICATION_CHECKLIST.md
if "%doc_choice%"=="5" start PROJECT_SUMMARY.md
if "%doc_choice%"=="6" start backend/README.md
if "%doc_choice%"=="7" start data/README.md
if "%doc_choice%"=="0" goto start

timeout /t 2 >nul
goto docs

:end
cls
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo   شكراً لاستخدام منصة صيت! 🌟
echo.
echo   للدعم: support@sayt.om
echo   الموقع: https://sayt.om
echo.
echo ════════════════════════════════════════════════════════════
echo.
timeout /t 3 >nul
exit
