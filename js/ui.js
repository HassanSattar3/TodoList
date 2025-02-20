class UI {
    constructor() {
        // Form elements
        this.form = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.prioritySelect = document.getElementById('priority-select');
        this.dueDateInput = document.getElementById('due-date');
        
        // Filter elements
        this.searchInput = document.getElementById('search-input');
        this.filterPriority = document.getElementById('filter-priority');
        this.filterStatus = document.getElementById('filter-status');
        
        // Todo list container
        this.todoList = document.getElementById('todo-list');
        
        // Theme toggle
        this.themeSwitch = document.getElementById('theme-switch');
        
        this.initializeTheme();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.themeSwitch.checked = savedTheme === 'dark';
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    clearForm() {
        this.todoInput.value = '';
        this.prioritySelect.value = 'low';
        this.dueDateInput.value = '';
    }

    getFormData() {
        return {
            text: this.todoInput.value.trim(),
            priority: this.prioritySelect.value,
            dueDate: this.dueDateInput.value
        };
    }

    createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.id = todo.id;

        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';

        todoItem.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div>
                    <p>${this.escapeHtml(todo.text)}</p>
                    <small>Due: ${dueDate}</small>
                </div>
                <span class="priority-badge priority-${todo.priority}">
                    ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        return todoItem;
    }

    renderTodos(todos) {
        this.todoList.innerHTML = '';
        if (todos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        const sortedTodos = this.sortTodos(todos);
        sortedTodos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });
    }

    sortTodos(todos) {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return [...todos].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
    }

    showEditForm(todo) {
        const todoItem = document.querySelector(`[data-id="${todo.id}"]`);
        const todoContent = todoItem.querySelector('.todo-content');
        
        todoContent.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(todo.text)}">
            <select class="edit-priority">
                <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low Priority</option>
                <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
                <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High Priority</option>
            </select>
            <input type="date" class="edit-date" value="${todo.dueDate || ''}">
            <button class="save-edit-btn">Save</button>
            <button class="cancel-edit-btn">Cancel</button>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }
}

const ui = new UI();
