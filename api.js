/**
 * API Configuration and Helper Functions
 * ملف الربط بين Frontend و Backend
 */

// API Base URL - غيّر هذا حسب بيئة التشغيل
const API_BASE_URL = 'http://localhost:8000/api';

// API Endpoints
const API_ENDPOINTS = {
    users: `${API_BASE_URL}/users.php`,
    products: `${API_BASE_URL}/products.php`,
    workshops: `${API_BASE_URL}/workshops.php`,
    categories: `${API_BASE_URL}/categories.php`,
    orders: `${API_BASE_URL}/orders.php`,
    reviews: `${API_BASE_URL}/reviews.php`
};

/**
 * Generic API Request Function
 */
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Users API
 */
const UsersAPI = {
    // Get all users
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_ENDPOINTS.users}?${params}`);
    },

    // Get user by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.users}?id=${id}`);
    },

    // Create user
    create: (userData) => {
        return apiRequest(API_ENDPOINTS.users, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Update user
    update: (userData) => {
        return apiRequest(API_ENDPOINTS.users, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Delete user
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.users, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Products API
 */
const ProductsAPI = {
    // Get all products
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_ENDPOINTS.products}?${params}`);
    },

    // Get product by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.products}?id=${id}`);
    },

    // Create product
    create: (productData) => {
        return apiRequest(API_ENDPOINTS.products, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    // Update product
    update: (productData) => {
        return apiRequest(API_ENDPOINTS.products, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    // Delete product
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.products, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Workshops API
 */
const WorkshopsAPI = {
    // Get all workshops
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_ENDPOINTS.workshops}?${params}`);
    },

    // Get workshop by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.workshops}?id=${id}`);
    },

    // Create workshop
    create: (workshopData) => {
        return apiRequest(API_ENDPOINTS.workshops, {
            method: 'POST',
            body: JSON.stringify(workshopData)
        });
    },

    // Update workshop
    update: (workshopData) => {
        return apiRequest(API_ENDPOINTS.workshops, {
            method: 'PUT',
            body: JSON.stringify(workshopData)
        });
    },

    // Delete workshop
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.workshops, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Categories API
 */
const CategoriesAPI = {
    // Get all categories
    getAll: () => {
        return apiRequest(API_ENDPOINTS.categories);
    },

    // Get category by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.categories}?id=${id}`);
    },

    // Get category by slug
    getBySlug: (slug) => {
        return apiRequest(`${API_ENDPOINTS.categories}?slug=${slug}`);
    },

    // Create category
    create: (categoryData) => {
        return apiRequest(API_ENDPOINTS.categories, {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    },

    // Update category
    update: (categoryData) => {
        return apiRequest(API_ENDPOINTS.categories, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    },

    // Delete category
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.categories, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Orders API
 */
const OrdersAPI = {
    // Get all orders
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_ENDPOINTS.orders}?${params}`);
    },

    // Get order by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.orders}?id=${id}`);
    },

    // Create order
    create: (orderData) => {
        return apiRequest(API_ENDPOINTS.orders, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    // Update order status
    updateStatus: (id, status) => {
        return apiRequest(API_ENDPOINTS.orders, {
            method: 'PUT',
            body: JSON.stringify({ id, status })
        });
    },

    // Update payment status
    updatePaymentStatus: (id, payment_status) => {
        return apiRequest(API_ENDPOINTS.orders, {
            method: 'PUT',
            body: JSON.stringify({ id, payment_status })
        });
    },

    // Delete order
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.orders, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Reviews API
 */
const ReviewsAPI = {
    // Get all reviews
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_ENDPOINTS.reviews}?${params}`);
    },

    // Get review by ID
    getById: (id) => {
        return apiRequest(`${API_ENDPOINTS.reviews}?id=${id}`);
    },

    // Create review
    create: (reviewData) => {
        return apiRequest(API_ENDPOINTS.reviews, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },

    // Update review
    update: (reviewData) => {
        return apiRequest(API_ENDPOINTS.reviews, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    },

    // Delete review
    delete: (id) => {
        return apiRequest(API_ENDPOINTS.reviews, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
};

/**
 * Helper Functions
 */

// Load data from JSON files (fallback when backend is not available)
async function loadFromJSON(filename) {
    try {
        const response = await fetch(`../data/${filename}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

// Check if backend is available
async function checkBackendAvailability() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories.php`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Use backend or fallback to JSON
async function getDataSource() {
    const isBackendAvailable = await checkBackendAvailability();
    return isBackendAvailable ? 'backend' : 'json';
}

/**
 * Unified Data Fetchers (with fallback to JSON)
 */

// Get users with fallback
async function getUsers(filters = {}) {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await UsersAPI.getAll(filters);
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('users.json');
    return { status: 'success', data: data };
}

// Get products with fallback
async function getProducts(filters = {}) {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await ProductsAPI.getAll(filters);
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('products.json');
    return { status: 'success', data: data };
}

// Get workshops with fallback
async function getWorkshops(filters = {}) {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await WorkshopsAPI.getAll(filters);
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('workshops.json');
    return { status: 'success', data: data };
}

// Get categories with fallback
async function getCategories() {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await CategoriesAPI.getAll();
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('categories.json');
    return { status: 'success', data: data };
}

// Get orders with fallback
async function getOrders(filters = {}) {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await OrdersAPI.getAll(filters);
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('orders.json');
    return { status: 'success', data: data };
}

// Get reviews with fallback
async function getReviews(filters = {}) {
    const source = await getDataSource();
    
    if (source === 'backend') {
        try {
            return await ReviewsAPI.getAll(filters);
        } catch (error) {
            console.warn('Backend failed, falling back to JSON');
        }
    }
    
    // Fallback to JSON
    const data = await loadFromJSON('reviews.json');
    return { status: 'success', data: data };
}

// Export APIs
window.API = {
    Users: UsersAPI,
    Products: ProductsAPI,
    Workshops: WorkshopsAPI,
    Categories: CategoriesAPI,
    Orders: OrdersAPI,
    Reviews: ReviewsAPI,
    // Unified fetchers with fallback
    getUsers,
    getProducts,
    getWorkshops,
    getCategories,
    getOrders,
    getReviews,
    // Helpers
    checkBackendAvailability,
    getDataSource
};
