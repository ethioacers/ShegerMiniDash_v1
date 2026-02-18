/* Seller Tasks */

function updateTaskStatus(id, newStatus) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;
  const old = t.status;
  t.status = newStatus;
  if (newStatus === 'Accepted') addActivity(`Task ${id} accepted`, 'task');
  else addActivity(`Task ${id}: ${old} → ${newStatus}`, 'task');
  if (newStatus === 'Completed') {
    state.completedToday++;
    state.totalRevenue += t.budget;
    addActivity(`Task ${id} completed. +${t.budget} ETB`, 'task');
  }
  saveState();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  addActivity(`Task ${id} deleted`, 'task');
  render();
}

function render() {
  const list = document.getElementById('tasks-list');
  if (!list) return;
  if (state.tasks.length === 0) {
    list.innerHTML = '<p class="empty-state">No tasks yet. Buyers post from the Tasks page.</p>';
    return;
  }
  list.innerHTML = state.tasks.map(t => {
    const sc = t.status.toLowerCase().replace(/\s+/g, '-');
    const nextMap = { Open: 'Accepted', Accepted: 'In Progress', 'In Progress': 'Completed' };
    const next = nextMap[t.status];
    const canAccept = t.status === 'Open';
    const canComplete = ['Accepted', 'In Progress'].includes(t.status);
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${t.id}</span>
          <span class="status-badge status-${sc}">${t.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${t.title}</strong></p>
          <p>${t.description || ''}</p>
          <p>📍 ${t.location} · ${t.category} · ${t.budget} ETB</p>
        </div>
        <div class="item-card-actions">
          ${canAccept ? `<button class="btn btn-success" data-action="accept" data-id="${t.id}">Accept</button>` : ''}
          ${next && !canAccept ? `<button class="btn btn-status" data-action="update" data-id="${t.id}" data-status="${next}">→ ${next}</button>` : ''}
          ${canComplete ? `<button class="btn btn-success" data-action="complete" data-id="${t.id}">Mark Completed</button>` : ''}
          <button class="btn btn-danger" data-action="delete" data-id="${t.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('[data-action="accept"]').forEach(b => {
    b.addEventListener('click', () => updateTaskStatus(b.dataset.id, 'Accepted'));
  });
  list.querySelectorAll('[data-action="update"]').forEach(b => {
    b.addEventListener('click', () => updateTaskStatus(b.dataset.id, b.dataset.status));
  });
  list.querySelectorAll('[data-action="complete"]').forEach(b => {
    b.addEventListener('click', () => updateTaskStatus(b.dataset.id, 'Completed'));
  });
  list.querySelectorAll('[data-action="delete"]').forEach(b => {
    b.addEventListener('click', () => deleteTask(b.dataset.id));
  });
}

function init() {
  loadState();
  render();
  setInterval(() => { runSimulation(); render(); }, 20000);
}

document.addEventListener('DOMContentLoaded', init);
