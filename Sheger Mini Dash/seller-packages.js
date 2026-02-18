/* Seller Packages */

const PACKAGE_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

function updatePackageStatus(id, newStatus) {
  const p = state.packages.find(x => x.id === id);
  if (!p) return;
  const old = p.status;
  p.status = newStatus;
  if (newStatus === 'Delivered') {
    state.completedToday++;
    state.totalRevenue += p.shippingFee;
    addActivity(`Package ${id} delivered. +${p.shippingFee} ETB`, 'package');
  } else addActivity(`Package ${id}: ${old} → ${newStatus}`, 'package');
  saveState();
  render();
}

function deletePackage(id) {
  state.packages = state.packages.filter(p => p.id !== id);
  saveState();
  addActivity(`Package ${id} deleted`, 'package');
  render();
}

function render() {
  const list = document.getElementById('packages-list');
  if (!list) return;
  const pending = state.packages.filter(p => p.status === 'Processing').length;
  const transit = state.packages.filter(p => ['Shipped', 'Out for Delivery'].includes(p.status)).length;
  const success = state.packages.filter(p => p.status === 'Delivered').length;
  document.getElementById('pkg-pending').textContent = pending;
  document.getElementById('pkg-transit').textContent = transit;
  document.getElementById('pkg-success').textContent = success;
  document.getElementById('packages-transit').textContent = transit + ' in transit';

  if (state.packages.length === 0) {
    list.innerHTML = '<p class="empty-state">No packages. Buyers will request from the Packages page.</p>';
    return;
  }
  list.innerHTML = state.packages.map(p => {
    const idx = PACKAGE_STATUSES.indexOf(p.status);
    const next = idx < 3 ? PACKAGE_STATUSES[idx + 1] : null;
    const sc = p.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${p.id}</span>
          <span class="status-badge status-${sc}">${p.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${p.customerName}</strong> — ${p.itemName}</p>
          <p>📍 ${p.deliveryAddress}</p>
          <p>💰 ${p.shippingFee} ETB</p>
        </div>
        <div class="item-card-actions">
          ${next ? `<button class="btn btn-status" data-action="update" data-id="${p.id}" data-status="${next}">→ ${next}</button>` : ''}
          <button class="btn btn-danger" data-action="delete" data-id="${p.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('[data-action="update"]').forEach(b => {
    b.addEventListener('click', () => updatePackageStatus(b.dataset.id, b.dataset.status));
  });
  list.querySelectorAll('[data-action="delete"]').forEach(b => {
    b.addEventListener('click', () => deletePackage(b.dataset.id));
  });
}

function init() {
  loadState();
  render();
  setInterval(() => { runSimulation(); render(); }, 20000);
}

document.addEventListener('DOMContentLoaded', init);
