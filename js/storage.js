class Storage {
    constructor() {
        this.key = 'taskmaster-todos';
        this.todos = this.loadTodos();
    }

    loadTodos() {
        const todos = localStorage.getItem(this.key);
        return todos ? JSON.parse(todos) : [];
    }

    saveTodos(todos) {
        localStorage.setItem(this.key, JSON.stringify(todos));
        this.todos = todos;
    }

    addTodo(todo) {
        const newTodo = {
            id: Date.now(),
            text: todo.text,
            priority: todo.priority,
            dueDate: todo.dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        const todos = [...this.todos, newTodo];
        this.saveTodos(todos);
        return newTodo;
    }

    updateTodo(id, updates) {
        const todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
        );
        this.saveTodos(todos);
        return todos.find(todo => todo.id === id);
    }

    deleteTodo(id) {
        const todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos(todos);
    }

    toggleTodo(id) {
        const todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos(todos);
        return todos.find(todo => todo.id === id);
    }

    filterTodos({ searchText = '', priority = 'all', status = 'all' }) {
        return this.todos.filter(todo => {
            const matchesText = todo.text.toLowerCase().includes(searchText.toLowerCase());
            const matchesPriority = priority === 'all' || todo.priority === priority;
            const matchesStatus = status === 'all' || 
                (status === 'completed' ? todo.completed : !todo.completed);
            
            return matchesText && matchesPriority && matchesStatus;
        });
    }
}

const storage = new Storage();
