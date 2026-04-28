const defaultData = [
    {
        id: "1",
        name: "GibSams",
        description: "Confidential emotional support helpline for anyone experiencing distress, despair, or suicidal feelings.",
        website: "https://gibsams.gi/",
        whatsapp: "https://api.whatsapp.com/send/?phone=35056003612",
        category: "Crisis"
    },
    {
        id: "2",
        name: "Childline Gibraltar",
        description: "Confidential service for children and young people to talk about anything that might be worrying them.",
        website: "https://childline.gi/",
        whatsapp: "https://api.whatsapp.com/send/?phone=35058008288",
        category: "Youth"
    },
    {
        id: "3",
        name: "Walking Together",
        description: "Support group for families and friends who are dealing with suicide bereavement.",
        website: "",
        whatsapp: "https://api.whatsapp.com/send/?phone=35054075927",
        category: "General Support"
    },
    {
        id: "4",
        name: "Mindspace Project",
        description: "Promoting mental health, wellness, and fitness through community initiatives and support.",
        website: "https://www.themindspaceproject.org/",
        whatsapp: "https://api.whatsapp.com/send/?phone=35054008737",
        category: "General Support"
    }
];

function getOrganizations() {
    const data = localStorage.getItem('mhgi_organizations');
    if (!data) {
        localStorage.setItem('mhgi_organizations', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

function saveOrganizations(data) {
    localStorage.setItem('mhgi_organizations', JSON.stringify(data));
}

// State
let currentTab = 'help';
let orgs = getOrganizations();

// Setup Theme
const themeToggleBtn = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

themeToggleBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Tab Management
function switchTab(tab) {
    currentTab = tab;
    const tabHelp = document.getElementById('tab-help');
    const tabTalk = document.getElementById('tab-talk');
    const contentHelp = document.getElementById('content-help');
    const contentTalk = document.getElementById('content-talk');
    const filterSection = document.getElementById('filter-section');

    const activeClasses = ['border-brand-purple', 'text-brand-purple', 'dark:text-purple-400'];
    const inactiveClasses = ['border-transparent', 'text-gray-500', 'dark:text-gray-400'];

    if (tab === 'help') {
        tabHelp.classList.remove(...inactiveClasses);
        tabHelp.classList.add(...activeClasses);
        tabTalk.classList.remove(...activeClasses);
        tabTalk.classList.add(...inactiveClasses);
        
        contentHelp.classList.remove('hidden');
        filterSection.classList.remove('hidden');
        filterSection.classList.add('flex');
        contentTalk.classList.add('hidden');
    } else {
        tabTalk.classList.remove(...inactiveClasses);
        tabTalk.classList.add(...activeClasses);
        tabHelp.classList.remove(...activeClasses);
        tabHelp.classList.add(...inactiveClasses);
        
        contentTalk.classList.remove('hidden');
        contentHelp.classList.add('hidden');
        filterSection.classList.add('hidden');
        filterSection.classList.remove('flex');
    }
}

// Render Data
function renderCards() {
    const container = document.getElementById('content-help');
    const instantChatContainer = document.getElementById('instant-chat-list');
    
    if (!container || !instantChatContainer) return;

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const category = document.getElementById('categoryFilter')?.value || "all";

    const filtered = orgs.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm) || org.description.toLowerCase().includes(searchTerm);
        const matchesCat = category === "all" || org.category === category;
        return matchesSearch && matchesCat;
    });

    // Render "Find Help" Cards
    container.innerHTML = filtered.map(org => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <span class="text-xs font-bold text-brand-purple bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full w-max mb-4">${org.category}</span>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${org.name}</h3>
            <p class="text-gray-600 dark:text-gray-400 flex-grow mb-6">${org.description}</p>
            <div class="flex flex-col gap-3 mt-auto">
                ${org.website ? `<a href="${org.website}" target="_blank" class="w-full text-center py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold transition"><i class="fa-solid fa-globe mr-2"></i>Visit Website</a>` : ''}
                ${org.whatsapp ? `<a href="${org.whatsapp}" target="_blank" class="w-full text-center py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg shadow-green-500/30 transition"><i class="fa-brands fa-whatsapp mr-2"></i>Chat on WhatsApp</a>` : ''}
            </div>
        </div>
    `).join('');

    // Render "Talk Now" Buttons (Only those with WhatsApp)
    const instantOrgs = orgs.filter(o => o.whatsapp);
    instantChatContainer.innerHTML = instantOrgs.map(org => `
        <a href="${org.whatsapp}" target="_blank" class="block w-full text-center py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xl shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1">
            <i class="fa-brands fa-whatsapp mr-2 text-2xl align-middle"></i>
            Chat with ${org.name}
        </a>
    `).join('');
}

// Event Listeners for Filters
document.getElementById('searchInput')?.addEventListener('input', renderCards);
document.getElementById('categoryFilter')?.addEventListener('change', renderCards);

// Initial Render
if (document.getElementById('content-help')) {
    renderCards();
}