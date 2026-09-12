// Footer Loader - Loads footer content directly
(function() {
    const footerHTML = `
<!-- Footer -->
<footer class="footer">
    <div class="container">
        <!-- Footer Top Row -->
        <div class="footer-top">
            <div class="footer-logo-section">
                <div class="footer-logo">
                    <img src="images/logo.png" alt="حاذق" style="height: 35px; width: auto;">
                </div>
                <p data-ar="منصة رقمية عمانية لتمكين المواهب وصناع المحتوى" data-en="Omani digital platform to empower talents">منصة رقمية عمانية لتمكين المواهب وصناع المحتوى</p>
            </div>
            
            <div class="footer-contact-section">
                <div class="footer-contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a href="mailto:info@sayt.om">info@sayt.om</a>
                </div>
                <div class="footer-contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href="tel:+96812345678">+968 1234 5678</a>
                </div>
            </div>
            
            <div class="footer-social-section">
                <div class="social-links">
                    <a href="#" class="social-icon" aria-label="Facebook" title="Facebook">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" aria-label="Instagram" title="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" aria-label="Twitter" title="Twitter">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" aria-label="LinkedIn" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" aria-label="YouTube" title="YouTube">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer Links Row -->
        <div class="footer-links">
            <div class="footer-links-group">
                <a href="index.html" data-ar="الرئيسية" data-en="Home">الرئيسية</a>
                <a href="talents.html" data-ar="المواهب" data-en="Talents">المواهب</a>
                <a href="store.html" data-ar="المتجر" data-en="Store">المتجر</a>
                <a href="workshops.html" data-ar="الورش" data-en="Workshops">الورش</a>
                <a href="community.html" data-ar="المجتمع" data-en="Community">المجتمع</a>
            </div>
            <div class="footer-links-divider">|</div>
            <div class="footer-links-group">
                <a href="about.html" data-ar="من نحن" data-en="About">من نحن</a>
                <a href="contact.html" data-ar="اتصل بنا" data-en="Contact">اتصل بنا</a>
                <a href="faq.html" data-ar="الأسئلة الشائعة" data-en="FAQ">الأسئلة الشائعة</a>
                <a href="#" data-ar="سياسة الخصوصية" data-en="Privacy">سياسة الخصوصية</a>
                <a href="#" data-ar="الشروط والأحكام" data-en="Terms">الشروط والأحكام</a>
            </div>
        </div>        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <p data-ar="© 2026 منصة حاذق. جميع الحقوق محفوظة." data-en="© 2026 Sayt Platform. All rights reserved.">© 2026 منصة حاذق. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</footer>
`;

    // Load footer on page load
    document.addEventListener('DOMContentLoaded', function() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }
    });
})();
