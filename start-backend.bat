@echo off
echo ========================================
echo    تشغيل Backend - منصة صيت
echo ========================================
echo.

cd backend
echo [1/2] بدء تشغيل خادم PHP...
echo.
echo الخادم يعمل على: http://localhost:8000
echo صفحة اختبار API: http://localhost:8000/test-api.html
echo.
echo اضغط Ctrl+C لإيقاف الخادم
echo ========================================
echo.

php -S localhost:8000

pause
