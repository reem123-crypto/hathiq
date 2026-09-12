// FAQ Functionality

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
});

function initFAQ() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Category Filter
    const categoryBtns = document.querySelectorAll('.faq-category-btn');
    const categorySections = document.querySelectorAll('.faq-category-section');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter sections
            if (category === 'all') {
                categorySections.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                categorySections.forEach(section => {
                    if (section.getAttribute('data-category') === category) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('faqSearch');
    
    searchInput?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // Highlight search term
                if (searchTerm) {
                    item.classList.add('highlight');
                } else {
                    item.classList.remove('highlight');
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide category titles
        categorySections.forEach(section => {
            const visibleItems = section.querySelectorAll('.faq-item[style="display: block"]');
            if (visibleItems.length > 0) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}
