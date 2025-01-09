document.getElementById('taskForm').addEventListener('submit', addTask);
document.getElementById('savePriorityFilter').addEventListener('click', filterTasks);
document.getElementById('deleteFilter').addEventListener('click', deleteFilter);
document.getElementById('clearCompletedTasks').addEventListener('click', clearCompletedTasks);

function addTask(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const taskName = document.getElementById('taskName').value;
    const taskPriority = document.getElementById('taskPriority').value;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDate = new Date().toLocaleString();
    if (taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, name: taskName, priority: taskPriority };
            }
            return task;
        });
    } else {
        const task = {
            id: generateUniqueId(),
            name: taskName,
            priority: taskPriority,
            createdAt: currentDate,
            completed: false
        };
        tasks.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function displayTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    let tasks = filteredTasks || JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = `${task.name} - ${task.priority} - ${task.createdAt}`;
        li.setAttribute('data-id', task.id);

        switch (task.priority) {
            case 'High':
                li.classList.add('high-priority');
                break;
            case 'Medium':
                li.classList.add('medium-priority');
                break;
            case 'Low':
                li.classList.add('low-priority');
                break;
            default:
                break;
        }

        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.prepend(checkbox);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function filterTasks(event) {
    event.preventDefault();
    
    const filterValue = document.getElementById('priorityFilter').value;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (filterValue !== 'All') {
        tasks = tasks.filter(task => task.priority === filterValue);
    }

    displayTasks(tasks);
}

function deleteFilter() {
    displayTasks();
}

function handleDragStart(event) {
    draggedId = event.target.dataset.id;
    event.target.style.opacity = '0.5';
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    event.target.classList.remove('over');

    const droppedId = event.target.dataset.id;

    if (draggedId === undefined || droppedId === undefined || draggedId === droppedId) return;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const draggedIndex = tasks.findIndex(task => task.id === draggedId);
    const droppedIndex = tasks.findIndex(task => task.id === droppedId);
    
    const [draggedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(droppedIndex, 0, draggedTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function handleDragEnd(event) {
    event.target.style.opacity = '';
    document.querySelectorAll('li').forEach(li => li.classList.remove('over'));
}

function toggleTaskCompletion(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function editTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks.find(task => task.id === taskId);

    if (taskToEdit) {
        document.getElementById('taskName').value = taskToEdit.name;
        document.getElementById('taskPriority').value = taskToEdit.priority;
        document.getElementById('taskId').value = taskToEdit.id;
    }
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function clearCompletedTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !task.completed); 
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
    displayTasks(); 
}

window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(tasks);
};
