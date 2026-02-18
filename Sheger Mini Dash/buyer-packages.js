/* Buyer Packages - pre-listed: car, electronics, furniture, etc. */

const PACKAGE_ITEMS = [
  { id: 'p1', name: 'Car Parts', emoji: '🚗', fee: 350 },
  { id: 'p2', name: 'Electronics', emoji: '📱', fee: 150 },
  { id: 'p3', name: 'Furniture', emoji: '🛋️', fee: 500 },
  { id: 'p4', name: 'Documents', emoji: '📄', fee: 75 },
  { id: 'p5', name: 'Clothing', emoji: '👕', fee: 100 },
  { id: 'p6', name: 'Books', emoji: '📚', fee: 80 },
  { id: 'p7', name: 'Groceries', emoji: '🛒', fee: 120 }
];

function addPackageRequest(item) {
  const pkg = {
    id: 'PKG-' + Date.now(),
    customerName: 'You',
    itemName: item.name,
    warehouseLocation: 'Pickup point',
    deliveryAddress: 'Your address',
    shippingFee: item.fee,
    status: 'Processing'
  };
  state.packages.unshift(pkg);
  saveState();
  addActivity(`Package: ${item.name} requested`, 'package');
  renderBuyerPackages();
}

function renderBuyerPackages() {
  const list = document.getElementById('buyer-packages-list');
  if (!list) return;
  const mine = state.packages.filter(p => p.customerName === 'You');
  if (mine.length === 0) {
    list.innerHTML = '<p class="empty-state">No shipments. Click an item above!</p>';
    return;
  }
  list.innerHTML = mine.map(pkg => {
    const statusClass = pkg.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${pkg.id}</span>
          <span class="status-badge status-${statusClass}">${pkg.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${pkg.itemName}</strong></p>
          <p>💰 ${pkg.shippingFee} ETB</p>
        </div>
      </div>
    `;
  }).join('');
}

function init() {
  loadState();
  const grid = document.getElementById('package-items-grid');
  if (grid) {
    grid.innerHTML = PACKAGE_ITEMS.map(item => `
      <button class="item-card clickable" data-id="${item.id}" type="button">
        <span class="item-emoji">${item.emoji}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-meta">${item.fee} ETB shipping</span>
      </button>
    `).join('');
    grid.querySelectorAll('button').forEach(btn => {
      const id = btn.dataset.id;
      const item = PACKAGE_ITEMS.find(i => i.id === id);
      if (item) btn.addEventListener('click', () => addPackageRequest(item));
    });
  }
  renderBuyerPackages();
}

document.addEventListener('DOMContentLoaded', init);
