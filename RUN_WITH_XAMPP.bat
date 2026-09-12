@echo off
chcp 65001 >nul
color 0A
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🚀 تشغيل منصة صيت مع XAMPP 🚀                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.

REM Check if XAMPP is installed
if not exist "C:\xampp\xampp-control.exe" (
    echo [✗] XAMPP غير مثبت في المسار الافتراضي
    echo.
    echo يرجى تثبيت XAMPP من:
    echo https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo [1/6] التحقق من XAMPP...
echo [✓] XAMPP موجود
echo.

echo [2/6] فتح XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"
timeout /t 3 >nul
echo [✓] تم فتح XAMPP Control Panel
echo.

echo ════════════════════════════════════════════════════════════
echo.
echo   📋 الخطوات التالية:
echo.
echo   1. في XAMPP Control Panel:
echo      • اضغط Start بجانب Apache
echo      • اضغط Start بجانب MySQL
echo.
echo   2. انتظر حتى يتحول اللون إلى أخضر
echo.
echo   3. اضغط Enter للمتابعة...
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause

cls
echo.
echo [3/6] إعداد قاعدة البيانات...
echo.
echo اختر طريقة الإعداد:
echo.
echo   [1] phpMyAdmin (سهلة - مستحسنة)
echo   [2] Terminal (متقدمة)
echo   [3] تخطي (قاعدة البيانات جاهزة)
echo.
set /p db_method="اختر رقم: "

if "%db_method%"=="1" (
    echo.
    echo [✓] فتح phpMyAdmin...
    start http://localhost/phpmyadmin
    timeout /t 2 >nul
    echo.
    echo ════════════════════════════════════════════════════════════
    echo.
    echo   📋 في phpMyAdmin:
    echo.
    echo   1. اضغط "New" (جديد)
    echo   2. اسم قاعدة البيانات: sayt_db
    echo   3. Collation: utf8mb4_unicode_ci
    echo   4. اضغط "Create" (إنشاء)
    echo   5. اضغط "Import" (استيراد)
    echo   6. اختر ملف: backend\database.sql
    echo   7. اضغط "Go" (تنفيذ)
    echo.
    echo ════════════════════════════════════════════════════════════
    echo.
    pause
) else if "%db_method%"=="2" (
    echo.
    echo [✓] تشغيل MySQL...
    cd C:\xampp\mysql\bin
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS sayt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    mysql -u root sayt_db < "%~dp0backend\database.sql"
    
    if %ERRORLEVEL% EQU 0 (
        echo [✓] تم إنشاء قاعدة البيانات بنجاح!
    ) else (
        echo [✗] فشل إنشاء قاعدة البيانات
    )
    cd "%~dp0"
    echo.
    pause
)

cls
echo.
echo [4/6] تشغيل Backend...
echo.

REM Check if PHP is in PATH
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] PHP موجود في PATH
    echo.
    echo تشغيل Backend على: http://localhost:8000
    echo.
    start "Sayt Backend" cmd /k "cd /d "%~dp0backend" && echo. && echo ════════════════════════════════════════════════════════════ && echo. && echo   ✅ Backend يعمل على: http://localhost:8000 && echo   🧪 اختبار API: http://localhost:8000/test-api.html && echo. && echo   اضغط Ctrl+C لإيقاف الخادم && echo. && echo ════════════════════════════════════════════════════════════ && echo. && php -S localhost:8000"
    timeout /t 3 >nul
) else (
    echo [!] PHP غير موجود في PATH
    echo.
    echo استخدام PHP من XAMPP...
    echo.
    start "Sayt Backend" cmd /k "cd /d "%~dp0backend" && echo. && echo ════════════════════════════════════════════════════════════ && echo. && echo   ✅ Backend يعمل على: http://localhost:8000 && echo   🧪 اختبار API: http://localhost:8000/test-api.html && echo. && echo   اضغط Ctrl+C لإيقاف الخادم && echo. && echo ════════════════════════════════════════════════════════════ && echo. && C:\xampp\php\php.exe -S localhost:8000"
    timeout /t 3 >nul
)

echo [✓] Backend يعمل
echo.

echo [5/6] اختبار API...
timeout /t 2 >nul
start http://localhost:8000/test-api.html
echo [✓] صفحة اختبار API مفتوحة
echo.

echo [6/6] تشغيل Frontend...
timeout /t 2 >nul
start "" "%~dp0frontend\index.html"
echo [✓] Frontend يعمل
echo.

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              ✅ المنصة تعمل بالكامل! ✅                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo   📱 Frontend: frontend\index.html
echo   🔧 Backend: http://localhost:8000
echo   🧪 اختبار API: http://localhost:8000/test-api.html
echo   💾 Database: sayt_db (في XAMPP MySQL)
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo   💡 نصائح:
echo.
echo   • افتح صفحة اختبار API للتأكد من عمل Backend
echo   • إذا واجهت مشكلة، راجع SETUP_XAMPP.md
echo   • لإيقاف Backend، اضغط Ctrl+C في نافذة Backend
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
