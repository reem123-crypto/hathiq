@echo off
echo ========================================
echo    إعداد قاعدة البيانات - منصة صيت
echo ========================================
echo.

echo [1/3] التحقق من MySQL...
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [خطأ] MySQL غير مثبت!
    echo.
    echo يرجى تثبيت MySQL أو XAMPP أو WAMP
    echo.
    pause
    exit /b 1
)

echo [✓] MySQL موجود
echo.

echo [2/3] إنشاء قاعدة البيانات...
echo.
echo سيطلب منك إدخال كلمة مرور MySQL
echo.

mysql -u root -p < backend/database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [✓] تم إنشاء قاعدة البيانات بنجاح!
    echo.
    echo [3/3] الخطوة التالية:
    echo 1. افتح: backend/config/database.php
    echo 2. عدّل كلمة المرور في السطر 9
    echo 3. شغّل: start-backend.bat
    echo.
) else (
    echo.
    echo [خطأ] فشل إنشاء قاعدة البيانات
    echo.
    echo تأكد من:
    echo 1. تشغيل MySQL
    echo 2. كلمة المرور صحيحة
    echo.
)

pause
