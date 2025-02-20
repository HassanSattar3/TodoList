class App {
    constructor() {
        // Initialize event listeners after DOM content is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeEventListeners();
            this.loadAndRenderTodos();
        });
    }

    initializeEventListeners() {
        // Form submission
        ui.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTodo();
        });

        // Theme toggle
        ui.themeSwitch.addEventListener('change', () => {
            ui.toggleTheme();
        });

        // Filter listeners
        ui.searchInput.addEventListener('input', () => this.handleFilter());
        ui.filterPriority.addEventListener('change', () => this.handleFilter());
        ui.filterStatus.addEventListener('change', () => this.handleFilter());

        // Todo item event delegation
        ui.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const id = Number(todoItem.dataset.id);

            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                this.handleDeleteTodo(id);
            } else if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                this.handleEditTodoClick(id);
            } else if (e.target.classList.contains('todo-checkbox')) {
                this.handleToggleTodo(id);
            }
        });

        // Edit form event delegation
        ui.todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('save-edit-btn')) {
                const todoItem = e.target.closest('.todo-item');
                this.handleSaveEdit(Number(todoItem.dataset.id));
            } else if (e.target.classList.contains('cancel-edit-btn')) {
                this.loadAndRenderTodos();
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.edit-input')) {
                this.loadAndRenderTodos();
            }
        });
    }

    handleAddTodo() {
        const formData = ui.getFormData();
        
        if (!formData.text) {
            ui.showNotification('Please enter a task description', 'error');
            return;
        }

        try {
            storage.addTodo(formData);
            ui.showNotification('Task added successfully');
            ui.clearForm();
            this.loadAndRenderTodos();
        } catch (error) {
            ui.showNotification('Error adding task', 'error');
            console.error('Error:', error);
        }
    }

    handleDeleteTodo(id) {
        try {
            storage.deleteTodo(id);
            ui.showNotification('Task deleted successfully');
            this.loadAndRenderTodos();
        } catch (error) {
            ui.showNotification('Error deleting task', 'error');
            console.error('Error:', error);
        }
    }

    handleToggleTodo(id) {
        try {
            storage.toggleTodo(id);
            this.loadAndRenderTodos();
        } catch (error) {
            ui.showNotification('Error updating task', 'error');
            console.error('Error:', error);
        }
    }

    handleEditTodoClick(id) {
        const todo = storage.todos.find(t => t.id === id);
        if (todo) {
            ui.showEditForm(todo);
        }
    }

    handleSaveEdit(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const editInput = todoItem.querySelector('.edit-input');
        const editPriority = todoItem.querySelector('.edit-priority');
        const editDate = todoItem.querySelector('.edit-date');

        const updates = {
            text: editInput.value.trim(),
            priority: editPriority.value,
            dueDate: editDate.value
        };

        if (!updates.text) {
            ui.showNotification('Task description cannot be empty', 'error');
            return;
        }

        try {
            storage.updateTodo(id, updates);
            ui.showNotification('Task updated successfully');
            this.loadAndRenderTodos();
        } catch (error) {
            ui.showNotification('Error updating task', 'error');
            console.error('Error:', error);
        }
    }

    handleFilter() {
        const filters = {
            searchText: ui.searchInput.value,
            priority: ui.filterPriority.value,
            status: ui.filterStatus.value
        };

        const filteredTodos = storage.filterTodos(filters);
        ui.renderTodos(filteredTodos);
    }

    loadAndRenderTodos() {
        const todos = storage.loadTodos();
        ui.renderTodos(todos);
    }
}

// Initialize the app
const app = new App();
