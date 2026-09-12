// ==================== Notifications Data ====================
let notificationsData = [
    {
        id: 1,
        type: 'message',
        title: 'رسالة جديدة',
        message: 'أرسل لك فاطمة الحارثية رسالة جديدة',
        time: 'منذ 5 دقائق',
        unread: true,
        actions: [
            { text: 'عرض الرسالة', link: 'chat.html' }
        ]
    },
    {
        id: 2,
        type: 'order',
        title: 'طلب جديد',
        message: 'لديك طلب جديد من سالم البلوشي لتصميم شعار',
        time: 'منذ ساعة',
        unread: true,
        actions: [
            { text: 'عرض الطلب', link: 'dashboard.html' },
            { text: 'قبول', action: 'accept' }
        ]
    },
    {
        id: 3,
        type: 'success',
        title: 'تم إكمال الطلب',
        message: 'تم إكمال طلبك من أحمد المعمري بنجاح',
        time: 'منذ 3 ساعات',
        unread: true,
        actions: [
            { text: 'تقييم', action: 'rate' }
        ]
    },
    {
        id: 4,
        type: 'system',
        title: 'تحديث النظام',
        message: 'تم إضافة ميزات جديدة للمنصة، تحقق منها الآن',
        time: 'منذ 5 ساعات',
        unread: false,
        actions: [
            { text: 'اكتشف المزيد', link: 'index.html' }
        ]
    },
    {
        id: 5,
        type: 'message',
        title: 'رسالة جديدة',
        message: 'أرسل لك خالد الهنائي رسالة جديدة',
        time: 'أمس',
        unread: false,
        actions: [
            { text: 'عرض الرسالة', link: 'chat.html' }
        ]
    }
];

let currentFilter = 'all';

// ==================== Load Notifications ====================
function loadNotifications() {
    const list = document.getElementById('notificationsList');
    const empty = document.getElementById('notificationsEmpty');
    const badge = document.getElementById('notificationBadge');
    
    if (!list) return;
    
    let filteredNotifications = notificationsData;
    
    // Apply filter
    if (currentFilter === 'unread') {
        filteredNotifications = notificationsData.filter(n => n.unread);
    } else if (currentFilter !== 'all') {
        filteredNotifications = notificationsData.filter(n => n.type === currentFilter || n.type === currentFilter + 's');
    }
    
    // Update badge
    const unreadCount = notificationsData.filter(n => n.unread).length;
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    // Save to localStorage for header badge
    localStorage.setItem('unread_notifications', unreadCount);
    
    // Show empty state if no notifications
    if (filteredNotifications.length === 0) {
        list.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    list.style.display = 'block';
    empty.style.display = 'none';
    
    // Render notifications
    list.innerHTML = filteredNotifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <div class="notification-message">${notification.message}</div>
                ${notification.actions && notification.actions.length > 0 ? `
                    <div class="notification-actions">
                        ${notification.actions.map(action => `
                            <button class="notification-action-btn ${action.link ? 'primary' : 'secondary'}" 
                                    onclick="${action.link ? `window.location.href='${action.link}'` : `handleAction('${action.action}', ${notification.id})`}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <button class="notification-delete" onclick="deleteNotification(${notification.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Add click event to mark as read
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.notification-delete') && !e.target.closest('.notification-action-btn')) {
                const id = parseInt(this.getAttribute('data-id'));
                markAsRead(id);
            }
        });
    });
}

function getNotificationIcon(type) {
    const icons = {
        'message': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        'order': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
        'system': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        'success': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };
    return icons[type] || icons['system'];
}


function markAsRead(id) {
    const notification = notificationsData.find(n => n.id === id);
    if (notification) {
        notification.unread = false;
        loadNotifications();
    }
}

function deleteNotification(id) {
    notificationsData = notificationsData.filter(n => n.id !== id);
    loadNotifications();
    showToast('تم حذف الإشعار', 'success');
}

function handleAction(action, id) {
    const notification = notificationsData.find(n => n.id === id);
    
    if (action === 'accept') {
        showToast('تم قبول الطلب', 'success');
        deleteNotification(id);
    } else if (action === 'rate') {
        showToast('شكراً لتقييمك', 'success');
        deleteNotification(id);
    }
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', function() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            loadNotifications();
        });
    });
    
    // Mark all as read
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notificationsData.forEach(n => n.unread = false);
            loadNotifications();
            showToast('تم تعليم جميع الإشعارات كمقروءة', 'success');
        });
    }
    
    // Clear all
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
                notificationsData = [];
                loadNotifications();
                showToast('تم حذف جميع الإشعارات', 'success');
            }
        });
    }
    
    // Load notifications
    loadNotifications();
});
