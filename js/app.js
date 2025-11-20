import { countryData, subdivisionDescriptions } from './data.js';
import {
    initializeFirebase,
    getDb,
    getIsAuthReady,
    getUserId,
    ACCOUNT_ID,
    LEDGER_PATH,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from './firebase-config.js';

// State
let currentTab = 'structure';

// DOM Elements
const mainContent = document.getElementById('main-content');
const modal = document.getElementById('detail-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupModal();
    renderTab(currentTab);
    initializeFirebase();

    // Listen for auth ready to setup ledger if we are on financial tab
    window.addEventListener('authReady', () => {
        if (currentTab === 'financial') {
            setupLedgerListener();
        }
    });
});

// --- Tab Logic ---
function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            if (target === currentTab) return;

            // Update UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update State & Render
            currentTab = target;
            renderTab(currentTab);
        });
    });
}

function renderTab(tabName) {
    // Fade out content
    mainContent.style.opacity = '0';

    setTimeout(() => {
        mainContent.innerHTML = '';

        switch (tabName) {
            case 'structure':
                renderStructureTab();
                break;
            case 'financial':
                renderFinancialTab();
                break;
            case 'operational':
                renderOperationalTab();
                break;
            case 'strategic':
                renderStrategicTab();
                break;
        }

        // Fade in
        requestAnimationFrame(() => {
            mainContent.style.transition = 'opacity 0.3s ease';
            mainContent.style.opacity = '1';
        });
    }, 200);
}

// --- Render Functions ---

function renderStructureTab() {
    const html = `
        <div class="animate-slide-up">
            <!-- Org Chart Section -->
            <div class="flex justify-center mb-16">
                <div class="org-node bg-neutral-900 text-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center border-b-4 border-white relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <h2 class="text-3xl font-display font-bold">Simon Allmer Entertainment</h2>
                    <p class="text-slate-400 mt-2 text-sm">Global Headquarters</p>
                </div>
            </div>

            <!-- Divisions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                ${renderDivisionCard('Allmer Studios', 'studios', ['Allmer Comics', 'Allmer Films', 'Allmer Music', 'Allmer Games', 'Allmer Journals', 'Allmer Snacks'])}
                ${renderDivisionCard('Allmer Brands', 'brands', ['Franchise Development', 'Extensions', 'Merchandise', 'Communications'])}
                ${renderDivisionCard('Simon Allmer Stores', 'stores', ['Website', 'Apple', 'Google', 'Microsoft'])}
                ${renderDivisionCard('Simon Allmer Centers', 'centers', ['America', 'Europe', 'Africa', 'Asia'])}
            </div>

            <!-- Global Operations Section -->
            <div class="mt-16 pt-16 border-t border-slate-800">
                <div class="flex justify-center mb-12">
                    <div class="org-node bg-neutral-900 text-white p-4 rounded-xl shadow-lg w-full max-w-xs text-center border-b-4 border-white">
                        <h2 class="text-2xl font-display font-bold">Global Operations</h2>
                    </div>
                </div>

                <!-- Country Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5">
                    ${Object.keys(countryData).map(country => renderCountryButton(country)).join('')}
                </div>

                <!-- Legend -->
                <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm p-4 bg-surface/30 rounded-xl border border-white/5">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                        <span class="text-slate-300">Digital/Partners Only</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
                        <span class="text-slate-300">Active Partners</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                        <span class="text-slate-300">Physical Presence</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;

    // Attach event listeners for subdivisions
    document.querySelectorAll('.division-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const list = document.getElementById(`sub-${id}`);
            const icon = document.getElementById(`icon-${id}`);

            list.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // Attach event listeners for details
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailModal(btn.getAttribute('data-title'));
        });
    });

    // Attach event listeners for countries
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showCountryDetail(btn.getAttribute('data-country'));
        });
    });
}

function renderDivisionCard(title, id, items) {
    return `
        <div class="bg-surface border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group">
            <div class="flex justify-between items-start mb-4 cursor-pointer division-toggle" data-id="${id}">
                <h3 class="text-lg font-bold text-white group-hover:text-sa-blue transition-colors">${title}</h3>
                <svg id="icon-${id}" class="w-5 h-5 text-slate-500 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            <ul id="sub-${id}" class="space-y-2 hidden mb-4 animate-fade-in">
                ${items.map(item => `
                    <li class="p-2 bg-slate-900/50 rounded text-sm text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors" onclick="window.showDetailModal('${item}')">
                        ${item}
                    </li>
                `).join('')}
            </ul>
            
            <button class="text-xs font-bold text-sa-blue hover:text-white transition-colors view-details-btn" data-title="${title}">
                View Details &rarr;
            </button>
        </div>
    `;
}

function renderCountryButton(countryName) {
    const data = countryData[countryName];
    const colorClass = data.presenceLevel === 'green' ? 'border-green-500 tl-green' :
        data.presenceLevel === 'yellow' ? 'border-yellow-400 tl-yellow' :
            'border-red-500 tl-red';

    return `
        <button class="country-btn flex flex-col items-center justify-center p-4 bg-surface hover:bg-slate-700 rounded-xl border-b-4 ${colorClass} transition-all duration-300 group" data-country="${countryName}">
            <span class="text-4xl mb-2 transform group-hover:scale-110 transition-transform">${data.flag}</span>
            <span class="text-xs text-slate-400 group-hover:text-white font-medium">${countryName}</span>
        </button>
    `;
}

function renderFinancialTab() {
    const html = `
        <div class="animate-slide-up max-w-7xl mx-auto">
            <div class="mb-8">
                <h2 class="text-3xl font-display font-bold text-sa-blue mb-2">General Ledger</h2>
                <p class="text-slate-400">Real-time financial tracking via Allmer Terminal.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Debit Accounts -->
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gl-red border-b border-slate-700 pb-2">Debit (Assets/Exp)</h3>
                    ${renderGlCard('Drawings', '0.00€', 'gl-red')}
                    ${renderGlCard('Expenses', '0.00€', 'gl-red')}
                </div>

                <!-- Credit Accounts -->
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gl-green border-b border-slate-700 pb-2">Credit (Liab/Eq/Rev)</h3>
                    ${renderGlCard('Liabilities', '€3,365.00', 'gl-green', 'Payables: Holzhandwerk, Happylab, Advanzia')}
                    ${renderGlCard('Owner\'s Equity', '€2,735.00', 'gl-green')}
                    ${renderGlCard('Revenue', '0.00€', 'gl-green')}
                </div>

                <!-- Assets Detail -->
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gl-balance border-b border-slate-700 pb-2">Active Assets</h3>
                    
                    <!-- Allmer Bank Live Ledger -->
                    <div class="bg-surface border border-white/5 rounded-xl p-4 shadow-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-bold text-white flex items-center gap-2">
                                <span>🏦</span> Allmer Bank
                            </h4>
                            <button id="add-deposit-btn" class="px-3 py-1 bg-sa-darkblue text-slate-900 text-xs font-bold rounded hover:bg-sa-blue transition-colors">
                                + €5 Deposit
                            </button>
                        </div>
                        <div id="allmer-bank-ledger" class="min-h-[100px] flex items-center justify-center">
                            <p class="text-slate-500 italic text-sm">Loading ledger data...</p>
                        </div>
                    </div>

                    ${renderGlCard('Accounts Receivable', '0.00€', 'gl-balance')}
                    ${renderGlCard('Inventory', '0.00€', 'gl-balance')}
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;

    // Setup Ledger Logic
    if (getIsAuthReady()) {
        setupLedgerListener();
    }

    // Attach Add Deposit Listener
    const addBtn = document.getElementById('add-deposit-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addFiveEuroDeposit);
    }
}

function renderGlCard(title, balance, colorClass, subtitle = '') {
    return `
        <div class="bg-surface border border-white/5 rounded-xl p-4 shadow-lg hover:border-white/10 transition-colors">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-white">${title}</h4>
                <span class="font-mono font-bold text-${colorClass}">${balance}</span>
            </div>
            ${subtitle ? `<p class="text-xs text-slate-500">${subtitle}</p>` : ''}
        </div>
    `;
}

function renderOperationalTab() {
    mainContent.innerHTML = `
        <div class="animate-slide-up grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div class="space-y-6">
                <h2 class="text-2xl font-display font-bold text-white mb-6">Entertainment Metrics</h2>
                ${renderDashboardCard('Content Pipeline', 'Active', 'Films/Games in development')}
                ${renderDashboardCard('Royalty Tracker', '+ € 543,210', 'Monthly aggregated revenue', 'text-green-400')}
            </div>
            <div class="space-y-6">
                <h2 class="text-2xl font-display font-bold text-white mb-6">Asset Metrics</h2>
                ${renderDashboardCard('Portfolio Occupancy', '92.8%', 'Across all managed properties')}
                ${renderDashboardCard('CapEx Schedule', 'On Track', 'Renovations & Developments')}
            </div>
        </div>
    `;
}

function renderStrategicTab() {
    mainContent.innerHTML = `
        <div class="animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            ${renderDashboardCard('3-Year Goals', 'Strategic', 'KPIs and Milestones')}
            ${renderDashboardCard('M&A Pipeline', 'Confidential', 'Active Due Diligence')}
            ${renderDashboardCard('Legal Vault', 'Secure', 'Trusts, Wills, Tax Filings')}
        </div>
    `;
}

function renderDashboardCard(title, value, desc, valueColor = 'text-white') {
    return `
        <div class="bg-surface border border-white/5 rounded-xl p-6 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
            <h3 class="text-lg font-semibold text-sa-blue mb-2">${title}</h3>
            <p class="text-3xl font-bold ${valueColor} mb-2">${value}</p>
            <p class="text-sm text-slate-500 italic">${desc}</p>
        </div>
    `;
}

// --- Modal Logic ---

function setupModal() {
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Global exposure for inline onclicks (legacy support)
    window.showDetailModal = showDetailModal;
    window.showCountryDetail = showCountryDetail;
}

function showDetailModal(title, customContent = null) {
    modalTitle.textContent = title;

    let content = customContent;
    if (!content) {
        // Default content generation based on title
        const desc = subdivisionDescriptions[title] || `Detailed operational data for ${title}.`;
        let websiteLink = '';

        if (title.includes('Allmer') || title.includes('Stores')) {
            const domain = title.toLowerCase().replace(/ /g, '') + '.com';
            websiteLink = `
                <div class="mt-6 pt-4 border-t border-white/10">
                    <p class="text-sm text-slate-400 mb-2">Official Portal</p>
                    <a href="http://${domain}" target="_blank" class="inline-flex items-center gap-2 text-sa-blue hover:text-white transition-colors">
                        ${domain} 
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>
            `;
        }
        content = `<p>${desc}</p>${websiteLink}`;
    }

    modalBody.innerHTML = content;

    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('modal-open');
    document.getElementById('modal-panel').classList.add('modal-panel-open');
}

function closeModal() {
    modal.classList.remove('modal-open');
    document.getElementById('modal-panel').classList.remove('modal-panel-open');
    setTimeout(() => {
        modal.classList.add('pointer-events-none', 'opacity-0');
    }, 300);
}

function showCountryDetail(countryName) {
    const data = countryData[countryName];
    if (!data) return;

    const presenceColor = data.presenceLevel === 'green' ? 'text-green-400' :
        data.presenceLevel === 'yellow' ? 'text-yellow-400' : 'text-red-400';

    const content = `
        <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <span class="text-5xl">${data.flag}</span>
                <div>
                    <p class="text-sm text-slate-400 uppercase tracking-wider font-bold">Operational Status</p>
                    <p class="font-bold ${presenceColor}">${data.presenceLevel.toUpperCase()}</p>
                </div>
            </div>
            
            <p class="text-slate-300">${data.note}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="p-3 bg-slate-900/30 rounded-lg">
                    <p class="text-slate-500 mb-1">Key Cities</p>
                    <p class="text-white">${data.cities.join(', ')}</p>
                </div>
                <div class="p-3 bg-slate-900/30 rounded-lg">
                    <p class="text-slate-500 mb-1">Entities</p>
                    <p class="text-white">${data.entities.join(', ')}</p>
                </div>
            </div>
            
            ${data.realEstate > 0 ? `
                <div class="p-3 bg-slate-900/30 rounded-lg text-sm">
                    <p class="text-slate-500 mb-2">Real Estate Holdings (${data.realEstate})</p>
                    <ul class="list-disc pl-4 space-y-1 text-slate-300">
                        ${data.realEstateDetails ? data.realEstateDetails.map(d => `<li>${d.name} <span class="text-slate-500 text-xs">(${d.type})</span></li>`).join('') : '<li>Properties data protected.</li>'}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;

    showDetailModal(countryName, content);
}

// --- Ledger Logic ---

function setupLedgerListener() {
    const db = getDb();
    if (!db || !getIsAuthReady()) return;

    const q = query(
        collection(db, LEDGER_PATH),
        where("accountId", "==", ACCOUNT_ID)
    );

    onSnapshot(q, (snapshot) => {
        const transactions = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            let msTimestamp = data.timestamp;
            if (data.timestamp && typeof data.timestamp.toMillis === 'function') {
                msTimestamp = data.timestamp.toMillis();
            } else if (!msTimestamp) {
                msTimestamp = Date.now();
            }
            transactions.push({ id: doc.id, ...data, timestamp: msTimestamp });
        });
        renderLedgerTable(transactions);
    }, (error) => {
        console.error("Ledger Error:", error);
        const el = document.getElementById('allmer-bank-ledger');
        if (el) el.innerHTML = `<p class="text-red-400 text-sm">Access Denied. Check permissions.</p>`;
    });
}

function renderLedgerTable(transactions) {
    const container = document.getElementById('allmer-bank-ledger');
    if (!container) return;

    if (transactions.length === 0) {
        container.innerHTML = `<p class="text-slate-500 italic text-sm">No transactions found.</p>`;
        return;
    }

    transactions.sort((a, b) => a.timestamp - b.timestamp);
    let balance = 0;

    const rows = transactions.map(tx => {
        const debit = tx.debit || 0;
        const credit = tx.credit || 0;
        balance = balance + debit - credit;
        const date = new Date(tx.timestamp).toLocaleDateString();

        return `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
                <td class="p-2 text-slate-400">${date}</td>
                <td class="p-2 text-white">${tx.description}</td>
                <td class="p-2 text-right text-gl-red">${debit > 0 ? debit.toFixed(2) : '-'}</td>
                <td class="p-2 text-right text-gl-green">${credit > 0 ? credit.toFixed(2) : '-'}</td>
                <td class="p-2 text-right font-bold text-gl-balance">${balance.toFixed(2)}€</td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="w-full overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-xs text-slate-500 border-b border-white/10">
                        <th class="p-2 font-normal">Date</th>
                        <th class="p-2 font-normal">Desc</th>
                        <th class="p-2 font-normal text-right">In</th>
                        <th class="p-2 font-normal text-right">Out</th>
                        <th class="p-2 font-normal text-right">Bal</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function addFiveEuroDeposit() {
    const db = getDb();
    if (!db || !getIsAuthReady()) {
        showDetailModal('Error', 'Database not ready. Please wait.');
        return;
    }

    try {
        await addDoc(collection(db, LEDGER_PATH), {
            accountId: ACCOUNT_ID,
            description: 'Quick Deposit',
            debit: 5.00,
            credit: 0.00,
            timestamp: serverTimestamp(),
            userId: getUserId()
        });
    } catch (e) {
        showDetailModal('Transaction Failed', e.message);
    }
}
