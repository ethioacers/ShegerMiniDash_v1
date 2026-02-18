/* Seller Food - manage orders */

const FOOD_STATUSES = ['Preparing', 'Picked Up', 'On The Way', 'Delivered'];

function updateFoodStatus(id, newStatus) {
  const order = state.foodOrders.find(o => o.id === id);
  if (!order) return;
  const old = order.status;
  order.status = newStatus;
  if (newStatus === 'Delivered') {
    state.completedToday++;
    state.totalRevenue += order.price;
    addActivity(`Order ${id} delivered. +${order.price} ETB`, 'food');
  } else addActivity(`Order ${id}: ${old} → ${newStatus}`, 'food');
  saveState();
  render();
}

function deleteFood(id) {
  state.foodOrders = state.foodOrders.filter(o => o.id !== id);
  saveState();
  addActivity(`Food order ${id} deleted`, 'food');
  render();
}

function render() {
  const list = document.getElementById('food-orders-list');
  if (!list) return;
  if (state.foodOrders.length === 0) {
    list.innerHTML = '<p class="empty-state">No food orders yet. Buyers will place orders from the Food page.</p>';
    return;
  }
  list.innerHTML = state.foodOrders.map(o => {
    const idx = FOOD_STATUSES.indexOf(o.status);
    const next = idx < 3 ? FOOD_STATUSES[idx + 1] : null;
    const sc = o.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${o.id}</span>
          <span class="status-badge status-${sc}">${o.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${o.customerName}</strong> — ${o.restaurantName}</p>
          <p>${o.foodItem}</p>
          <p>📍 ${o.deliveryAddress}</p>
          <p>💰 ${o.price} ETB</p>
        </div>
        <div class="item-card-actions">
          ${next ? `<button class="btn btn-status" data-action="update" data-id="${o.id}" data-status="${next}">→ ${next}</button>` : ''}
          <button class="btn btn-danger" data-action="delete" data-id="${o.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('[data-action="update"]').forEach(b => {
    b.addEventListener('click', () => updateFoodStatus(b.dataset.id, b.dataset.status));
  });
  list.querySelectorAll('[data-action="delete"]').forEach(b => {
    b.addEventListener('click', () => deleteFood(b.dataset.id));
  });
}

function init() {
  loadState();
  render();
  setInterval(() => { runSimulation(); render(); }, 20000);
}

document.addEventListener('DOMContentLoaded', init);
