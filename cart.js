// ==================== Cart Data ====================
let cartData = [
    { id: 1, title: 'قالب تصميم احترافي', seller: 'أحمد المعمري', price: 50, quantity: 1, image: '🎨' },
    { id: 2, title: 'كورس تطوير المواقع', seller: 'فاطمة الحارثية', price: 75, quantity: 2, image: '💻' },
    { id: 3, title: 'حزمة أيقونات', seller: 'سالم البلوشي', price: 30, quantity: 1, image: '🎯' }
];

const recommendedProducts = [
    { id: 4, title: 'دورة التصوير', price: 60, image: '📸' },
    { id: 5, title: 'قوالب فيديو', price: 45, image: '🎬' },
    { id: 6, title: 'خطوط عربية', price: 25, image: '✍️' },
    { id: 7, title: 'موسيقى خلفية', price: 35, image: '🎵' }
];

// ==================== Load Cart ====================
function loadCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartBadge = document.getElementById('cartBadge');
    
    if (!cartItems) return;
    
    if (cartData.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartBadge.textContent = '0';
        
        // Save to localStorage for header badge
        localStorage.setItem('cart_items_count', '0');
        
        updateSummary();
        return;
    }
    
    cartItems.style.display = 'flex';
    cartEmpty.style.display = 'none';
    cartBadge.textContent = cartData.length;
    
    // Save to localStorage for header badge
    localStorage.setItem('cart_items_count', cartData.length);
    
    cartItems.innerHTML = cartData.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </div>
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-seller">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${item.seller}</span>
                </div>
                <div class="item-price">${item.price} ر.ع</div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span data-ar="حذف" data-en="Remove">حذف</span>
                </button>
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

// ==================== Cart Actions ====================
function increaseQuantity(id) {
    const item = cartData.find(i => i.id === id);
    if (item) {
        item.quantity++;
        loadCart();
    }
}

function decreaseQuantity(id) {
    const item = cartData.find(i => i.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
        loadCart();
    }
}

function removeItem(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        cartData = cartData.filter(i => i.id !== id);
        loadCart();
        showToast('تم حذف المنتج من السلة', 'success');
    }
}

// ==================== Update Summary ====================
function updateSummary() {
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const discount = parseFloat(localStorage.getItem('cart_discount') || 0);
    const total = subtotal + tax - discount;
    
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} ر.ع`;
    document.getElementById('tax').textContent = `${tax.toFixed(2)} ر.ع`;
    document.getElementById('total').textContent = `${total.toFixed(2)} ر.ع`;
    
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-${discount.toFixed(2)} ر.ع`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

// ==================== Promo Code ====================
const promoCodes = {
    'SAYT10': 10,
    'WELCOME': 15,
    'SAVE20': 20
};

document.addEventListener('DOMContentLoaded', function() {
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const code = promoInput.value.toUpperCase().trim();
            
            if (promoCodes[code]) {
                const discount = promoCodes[code];
                localStorage.setItem('cart_discount', discount);
                updateSummary();
                showToast(`تم تطبيق كود الخصم! خصم ${discount} ر.ع`, 'success');
                promoInput.value = '';
            } else {
                showToast('كود الخصم غير صحيح', 'error');
            }
        });
    }
    
    // Clear cart
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
                cartData = [];
                localStorage.removeItem('cart_discount');
                loadCart();
                showToast('تم إفراغ السلة', 'success');
            }
        });
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartData.length === 0) {
                showToast('السلة فارغة', 'error');
                return;
            }
            showToast('جاري تحويلك لصفحة الدفع...', 'info');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1500);
        });
    }
    
    // Load cart and recommended
    loadCart();
    loadRecommended();
});

// ==================== Load Recommended ====================
function loadRecommended() {
    const grid = document.getElementById('recommendedProducts');
    if (!grid) return;
    
    grid.innerHTML = recommendedProducts.map(product => `
        <div class="recommended-item">
            <div class="recommended-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </div>
            <h4>${product.title}</h4>
            <div class="price">${product.price} ر.ع</div>
            <button class="btn btn-outline btn-sm" onclick="addToCart(${product.id})">
                <span data-ar="إضافة للسلة" data-en="Add to Cart">إضافة للسلة</span>
            </button>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = recommendedProducts.find(p => p.id === id);
    if (product) {
        cartData.push({
            ...product,
            seller: 'بائع مميز',
            quantity: 1
        });
        loadCart();
        showToast('تمت الإضافة للسلة', 'success');
    }
}
