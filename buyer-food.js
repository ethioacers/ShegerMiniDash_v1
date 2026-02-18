/* Buyer Food page - pre-listed items: burger, pizza, etc. */

const FOOD_ITEMS = [
  { id: 'f1', name: 'Burger', emoji: '🍔', restaurant: 'Burger House', price: 180 },
  { id: 'f2', name: 'Pizza', emoji: '🍕', restaurant: 'Bole Pizza', price: 250 },
  { id: 'f3', name: 'Tibs', emoji: '🥘', restaurant: 'Yod Abyssinia', price: 320 },
  { id: 'f4', name: 'Pasta', emoji: '🍝', restaurant: 'Pasta House', price: 190 },
  { id: 'f5', name: 'Sushi', emoji: '🍣', restaurant: 'Tokyo Sushi', price: 450 },
  { id: 'f6', name: 'Salad', emoji: '🥗', restaurant: 'Fresh & Green', price: 120 },
  { id: 'f7', name: 'Coffee', emoji: '☕', restaurant: "Kaldi's Coffee", price: 85 },
  { id: 'f8', name: 'Chicken', emoji: '🍗', restaurant: 'KFC Addis', price: 220 }
];

function addFoodOrder(item) {
  const order = {
    id: 'FD-' + Date.now(),
    customerName: 'You',
    restaurantName: item.restaurant,
    foodItem: item.name,
    deliveryAddress: 'Your address',
    price: item.price,
    status: 'Preparing'
  };
  state.foodOrders.unshift(order);
  saveState();
  addActivity(`New order: ${item.name} from ${item.restaurant}`, 'food');
  renderBuyerOrders();
}

function renderBuyerOrders() {
  const list = document.getElementById('buyer-food-orders-list');
  if (!list) return;
  const mine = state.foodOrders.filter(o => o.customerName === 'You');
  if (mine.length === 0) {
    list.innerHTML = '<p class="empty-state">No orders yet. Click an item above to order!</p>';
    return;
  }
  list.innerHTML = mine.map(order => {
    const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${order.id}</span>
          <span class="status-badge status-${statusClass}">${order.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${order.foodItem}</strong> from ${order.restaurant}</p>
          <p>💰 ${order.price} ETB</p>
        </div>
      </div>
    `;
  }).join('');
}

function init() {
  loadState();
  const grid = document.getElementById('food-items-grid');
  if (grid) {
    grid.innerHTML = FOOD_ITEMS.map(item => `
      <button class="item-card clickable" data-id="${item.id}" type="button">
        <span class="item-emoji">${item.emoji}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-meta">${item.restaurant} · ${item.price} ETB</span>
      </button>
    `).join('');
    grid.querySelectorAll('button').forEach(btn => {
      const id = btn.dataset.id;
      const item = FOOD_ITEMS.find(i => i.id === id);
      if (item) btn.addEventListener('click', () => addFoodOrder(item));
    });
  }
  renderBuyerOrders();
}

document.addEventListener('DOMContentLoaded', init);
