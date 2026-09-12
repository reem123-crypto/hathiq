@echo off
echo ========================================
echo    تشغيل Frontend - منصة صيت
echo ========================================
echo.

cd frontend
echo [1/2] فتح الموقع في المتصفح...
echo.
echo الموقع: http://localhost:3000
echo.

start index.html

echo.
echo [2/2] بدء خادم محلي (اختياري)...
echo.
echo إذا كنت تريد خادم محلي، شغل:
echo python -m http.server 3000
echo.

pause
