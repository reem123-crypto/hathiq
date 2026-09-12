// ==================== Sample Chat Data ====================
const talentDirectory = [
    { id: 101, name: 'سارة الزدجية', specialty: 'تصوير المناسبات والمنتجات', category: 'التصوير', online: true },
    { id: 102, name: 'نواف الهنائي', specialty: 'تصميم الهوية البصرية', category: 'التصميم', online: true },
    { id: 103, name: 'ريم السالمية', specialty: 'الكتابة الإبداعية والتسويق', category: 'الكتابة', online: false },
    { id: 104, name: 'خالد القحطاني', specialty: 'المونتاج والتقنيات الحديثة', category: 'الفيديو', online: false }
];

const chats = [
    {
        id: 1,
        name: 'أحمد المعمري',
        lastMessage: 'شكراً على التواصل، سأرسل لك التفاصيل قريباً',
        time: '10:30',
        unread: 2,
        online: true,
        recipientId: 101
    },
    {
        id: 2,
        name: 'فاطمة الحارثية',
        lastMessage: 'متى يمكننا البدء بالمشروع؟',
        time: '09:15',
        unread: 0,
        online: true,
        recipientId: 102
    },
    {
        id: 3,
        name: 'سالم البلوشي',
        lastMessage: 'تم إرسال الملفات المطلوبة',
        time: 'أمس',
        unread: 0,
        online: false,
        recipientId: 103
    },
    {
        id: 4,
        name: 'مريم الشحية',
        lastMessage: 'هل يمكنك مراجعة التصميم؟',
        time: 'أمس',
        unread: 1,
        online: false,
        recipientId: 104
    }
];

const messagesByChat = {
    1: [
        { id: 1, text: 'مرحباً، كيف يمكنني مساعدتك؟', sent: false, time: '10:20' },
        { id: 2, text: 'أريد الاستفسار عن خدمات التصوير الفوتوغرافي', sent: true, time: '10:22' },
        { id: 3, text: 'بالتأكيد، أنا متخصص في التصوير الفوتوغرافي للمناسبات والمنتجات', sent: false, time: '10:25' },
        { id: 4, text: 'رائع! ما هي الأسعار؟', sent: true, time: '10:28' },
        { id: 5, text: 'شكراً على التواصل، سأرسل لك التفاصيل قريباً', sent: false, time: '10:30' }
    ],
    2: [
        { id: 1, text: 'السلام عليكم', sent: false, time: '09:10' },
        { id: 2, text: 'وعليكم السلام ورحمة الله', sent: true, time: '09:12' },
        { id: 3, text: 'متى يمكننا البدء بالمشروع؟', sent: false, time: '09:15' }
    ],
    3: [
        { id: 1, text: 'تم إرسال الملفات المطلوبة', sent: false, time: 'أمس 14:30' }
    ],
    4: [
        { id: 1, text: 'هل يمكنك مراجعة التصميم؟', sent: false, time: 'أمس 16:45' }
    ]
};

// ==================== DOM Elements ====================
const chatList = document.getElementById('chatList');
const chatMessages = document.getElementById('chatMessages');
const chatEmpty = document.getElementById('chatEmpty');
const chatContent = document.getElementById('chatContent');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatUserName = document.getElementById('chatUserName');
const mobileBackBtn = document.getElementById('mobileBackBtn');
const searchInput = document.getElementById('searchInput');

let currentChatId = null;

function getSelectedTalentId() {
    const params = new URLSearchParams(window.location.search);
    const talentParam = params.get('user') || params.get('talent');
    if (!talentParam) return null;
    const parsed = Number(talentParam);
    return Number.isFinite(parsed) ? parsed : null;
}

function getTalentById(id) {
    return talentDirectory.find((talent) => talent.id === id) || null;
}

function ensureChatForTalent(talentId) {
    const existingChat = chats.find((chat) => chat.recipientId === talentId);
    if (existingChat) return existingChat;

    const talent = getTalentById(talentId);
    if (!talent) return null;

    const newChat = {
        id: Date.now(),
        name: talent.name,
        lastMessage: `أقدر أساعدك في ${talent.specialty}`,
        time: 'الآن',
        unread: 0,
        online: talent.online,
        recipientId: talent.id
    };

    chats.unshift(newChat);
    messagesByChat[newChat.id] = [{ id: 1, text: `مرحباً، أنا ${talent.name}. أقدر أساعدك في ${talent.specialty}.`, sent: false, time: 'الآن' }];
    return newChat;
}

function showEmptyState() {
    const selectedTalentId = getSelectedTalentId();
    const selectedTalent = selectedTalentId ? getTalentById(selectedTalentId) : null;
    const emptyTitle = chatEmpty.querySelector('h3');
    const emptyText = chatEmpty.querySelector('p');

    if (selectedTalent) {
        if (emptyTitle) emptyTitle.textContent = `ابدأ محادثة مع ${selectedTalent.name}`;
        if (emptyText) emptyText.textContent = 'أرسل رسالتك الآن وسيبدأ التواصل مباشرة مع الموهوب.';
    } else {
        if (emptyTitle) emptyTitle.textContent = 'اختر محادثة للبدء';
        if (emptyText) emptyText.textContent = 'اختر محادثة من القائمة أو ابدأ محادثة جديدة';
    }

    chatEmpty.style.display = 'flex';
    chatContent.style.display = 'none';
}

// ==================== Render Functions ====================
function renderChatList(filter = '') {
    const normalizedFilter = filter.toLowerCase().trim();
    const filteredChats = chats.filter((chat) => {
        const combinedText = `${chat.name} ${chat.lastMessage}`.toLowerCase();
        return combinedText.includes(normalizedFilter);
    });

    if (!chatList) return;

    chatList.innerHTML = filteredChats.map((chat) => `
        <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" data-chat-id="${chat.id}">
            <div class="chat-item-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${chat.online ? '<span class="status-dot"></span>' : ''}
            </div>
            <div class="chat-item-info">
                <div class="chat-item-header">
                    <span class="chat-item-name">${chat.name}</span>
                    <span class="chat-item-time">${chat.time}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <span class="chat-item-message">${chat.lastMessage}</span>
                    ${chat.unread > 0 ? `<span class="chat-item-badge">${chat.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.chat-item').forEach((item) => {
        item.addEventListener('click', () => {
            const chatId = parseInt(item.dataset.chatId, 10);
            openChat(chatId);
        });
    });
}

function renderMessages(chatId) {
    const messages = messagesByChat[chatId] || [];

    if (messages.length === 0) {
        chatMessages.innerHTML = '<div class="date-divider"><span>لا توجد رسائل</span></div>';
        return;
    }

    chatMessages.innerHTML = `
        <div class="date-divider"><span>اليوم</span></div>
        ${messages.map((msg) => `
            <div class="message ${msg.sent ? 'sent' : 'received'}">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `).join('')}
    `;

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find((item) => item.id === chatId);

    if (!chat) return;

    chatEmpty.style.display = 'none';
    chatContent.style.display = 'flex';
    chatUserName.textContent = chat.name;

    const statusElement = chatContent.querySelector('.chat-status');
    if (statusElement) {
        if (chat.online) {
            statusElement.classList.add('online');
            statusElement.textContent = 'متصل';
            statusElement.setAttribute('data-ar', 'متصل');
            statusElement.setAttribute('data-en', 'Online');
        } else {
            statusElement.classList.remove('online');
            statusElement.textContent = 'غير متصل';
            statusElement.setAttribute('data-ar', 'غير متصل');
            statusElement.setAttribute('data-en', 'Offline');
        }
    }

    chat.unread = 0;
    renderMessages(chatId);
    renderChatList();

    if (window.innerWidth <= 768) {
        document.querySelector('.chat-sidebar').classList.add('hidden');
    }
}

function sendMessage() {
    const text = messageInput.value.trim();

    if (!text || !currentChatId) return;

    const newMessage = {
        id: Date.now(),
        text: text,
        sent: true,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    if (!messagesByChat[currentChatId]) {
        messagesByChat[currentChatId] = [];
    }
    messagesByChat[currentChatId].push(newMessage);

    const chat = chats.find((item) => item.id === currentChatId);
    if (chat) {
        chat.lastMessage = text;
        chat.time = 'الآن';
    }

    messageInput.value = '';
    renderMessages(currentChatId);
    renderChatList();

    const chatReply = chat ? `شكراً على رسالتك، سأرد عليك خلال قليل.` : 'تم استلام رسالتك وسأرد عليك قريباً.';
    window.setTimeout(() => {
        if (!messagesByChat[currentChatId]) {
            messagesByChat[currentChatId] = [];
        }
        messagesByChat[currentChatId].push({
            id: Date.now() + 1,
            text: chatReply,
            sent: false,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        });
        if (chat) {
            chat.lastMessage = chatReply;
            chat.time = 'الآن';
        }
        renderMessages(currentChatId);
        renderChatList();
    }, 900);
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    renderChatList();

    const selectedTalentId = getSelectedTalentId();
    const initialChat = selectedTalentId ? ensureChatForTalent(selectedTalentId) : chats[0];

    if (initialChat) {
        openChat(initialChat.id);
    } else {
        showEmptyState();
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', () => {
            chatContent.style.display = 'none';
            chatContent.classList.remove('active');
            document.querySelector('.chat-sidebar').classList.remove('hidden');
            currentChatId = null;
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderChatList(e.target.value);
        });
    }

    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            const nextTalent = talentDirectory[0];
            const newChat = ensureChatForTalent(nextTalent.id);
            if (newChat) {
                openChat(newChat.id);
            }
        });
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.chat-sidebar').classList.remove('hidden');
        if (currentChatId) {
            chatContent.style.display = 'flex';
        }
    }
});
