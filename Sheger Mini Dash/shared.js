/* Shared state & storage for Sheger Mini Dash */

const STORAGE_KEYS = {
  foodOrders: 'sheger_food_orders',
  packages: 'sheger_packages',
  tasks: 'sheger_tasks',
  completedToday: 'sheger_completed_today',
  totalRevenue: 'sheger_total_revenue',
  lastCompletedDate: 'sheger_last_date',
  activityLog: 'sheger_activity_log'
};

const FOOD_STATUSES = ['Preparing', 'Picked Up', 'On The Way', 'Delivered'];
const PACKAGE_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

let state = {
  foodOrders: [],
  packages: [],
  tasks: [],
  completedToday: 0,
  totalRevenue: 0
};

function loadState() {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem(STORAGE_KEYS.lastCompletedDate);
  if (storedDate !== today) {
    localStorage.setItem(STORAGE_KEYS.completedToday, '0');
    localStorage.setItem(STORAGE_KEYS.lastCompletedDate, today);
  }
  state.foodOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.foodOrders) || '[]');
  state.packages = JSON.parse(localStorage.getItem(STORAGE_KEYS.packages) || '[]');
  state.tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || '[]');
  state.completedToday = parseInt(localStorage.getItem(STORAGE_KEYS.completedToday) || '0', 10);
  state.totalRevenue = parseFloat(localStorage.getItem(STORAGE_KEYS.totalRevenue) || '0');
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.foodOrders, JSON.stringify(state.foodOrders));
  localStorage.setItem(STORAGE_KEYS.packages, JSON.stringify(state.packages));
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
  localStorage.setItem(STORAGE_KEYS.completedToday, String(state.completedToday));
  localStorage.setItem(STORAGE_KEYS.totalRevenue, String(state.totalRevenue));
}

function loadActivityLog() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.activityLog) || '[]');
}

function addActivity(message, type = 'general') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const entry = { message, type, time };
  let log = loadActivityLog();
  log.unshift(entry);
  if (log.length > 100) log = log.slice(0, 100);
  localStorage.setItem(STORAGE_KEYS.activityLog, JSON.stringify(log));
}

/* Simulation - runs on seller pages */
function runSimulation() {
  loadState();
  const items = [];
  state.foodOrders.filter(o => o.status !== 'Delivered').forEach(o => {
    const idx = FOOD_STATUSES.indexOf(o.status);
    if (idx >= 0 && idx < 3) items.push({ type: 'food', data: o, next: FOOD_STATUSES[idx + 1] });
  });
  state.packages.filter(p => p.status !== 'Delivered').forEach(p => {
    const idx = PACKAGE_STATUSES.indexOf(p.status);
    if (idx >= 0 && idx < 3) items.push({ type: 'package', data: p, next: PACKAGE_STATUSES[idx + 1] });
  });
  state.tasks.filter(t => t.status !== 'Completed').forEach(t => {
    const next = { Open: 'Accepted', Accepted: 'In Progress', 'In Progress': 'Completed' }[t.status];
    if (next) items.push({ type: 'task', data: t, next });
  });
  if (items.length === 0) return;
  const pick = items[Math.floor(Math.random() * items.length)];
  if (pick.type === 'food') {
    pick.data.status = pick.next;
    if (pick.next === 'Delivered') { state.completedToday++; state.totalRevenue += pick.data.price; }
    addActivity(`Order ${pick.data.id}: ${pick.next}`, 'food');
  } else if (pick.type === 'package') {
    pick.data.status = pick.next;
    if (pick.next === 'Delivered') { state.completedToday++; state.totalRevenue += pick.data.shippingFee; }
    addActivity(`Package ${pick.data.id}: ${pick.next}`, 'package');
  } else {
    pick.data.status = pick.next;
    if (pick.next === 'Completed') { state.completedToday++; state.totalRevenue += pick.data.budget; }
    addActivity(`Task ${pick.data.id}: ${pick.next}`, 'task');
  }
  saveState();
}
