// Authentication Check
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('loginForm');

if (sessionStorage.getItem('mhgi_admin') === 'true') {
    showDashboard();
}

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = document.getElementById('password').value;
    
    
    const hashed = await hashPassword(pwd);
    if (hashed === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92') {
        sessionStorage.setItem('mhgi_admin', 'true');
        showDashboard();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});

function logout() {
    sessionStorage.removeItem('mhgi_admin');
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
    document.getElementById('password').value = '';
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderAdminList();
}

// CRUD Operations
let editingId = null;

function renderAdminList() {
    const list = document.getElementById('adminList');
    if (!list) return;
    
    // orgs is accessible because admin.html includes app.js
    list.innerHTML = orgs.map(org => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="p-4">
                <div class="font-bold">${org.name}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">${org.description}</div>
            </td>
            <td class="p-4">
                <span class="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">${org.category}</span>
            </td>
            <td class="p-4 text-right space-x-2">
                <button onclick="editOrg('${org.id}')" class="text-blue-500 hover:text-blue-700"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteOrg('${org.id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('orgForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newOrg = {
        id: editingId || Date.now().toString(),
        name: document.getElementById('orgName').value,
        category: document.getElementById('orgCategory').value,
        description: document.getElementById('orgDesc').value,
        website: document.getElementById('orgWeb').value,
        whatsapp: document.getElementById('orgWa').value
    };

    if (editingId) {
        orgs = orgs.map(o => o.id === editingId ? newOrg : o);
    } else {
        orgs.push(newOrg);
    }

    saveOrganizations(orgs);
    renderAdminList();
    resetForm();
});

function editOrg(id) {
    const org = orgs.find(o => o.id === id);
    if (!org) return;

    editingId = id;
    document.getElementById('formTitle').innerText = 'Edit Organization';
    document.getElementById('orgName').value = org.name;
    document.getElementById('orgCategory').value = org.category;
    document.getElementById('orgDesc').value = org.description;
    document.getElementById('orgWeb').value = org.website || '';
    document.getElementById('orgWa').value = org.whatsapp || '';
}

function deleteOrg(id) {
    if(confirm('Are you sure you want to delete this organization?')) {
        orgs = orgs.filter(o => o.id !== id);
        saveOrganizations(orgs);
        renderAdminList();
    }
}

function resetForm() {
    editingId = null;
    document.getElementById('formTitle').innerText = 'Add New Organization';
    document.getElementById('orgForm').reset();
}