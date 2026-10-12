let tasks = [];
const API_URL = 'https://cpe-task-api-usb7.onrender.com/tasks';
// 1. ดึงข้อมูลจาก Backend
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        tasks = data.map(item => ({
            id: item._id,
            title: item.title,
            completed: item.completed,
            priority: item.priority || "low"
        }));
        renderTasks();
    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
    }
};

// 2. ฟังก์ชันเพิ่มงาน
const addTask = async (title, priority) => {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, priority })
        });
        fetchTasks();
    } catch (error) {
        console.error("เพิ่มงานไม่สำเร็จ:", error);
    }
};

// 3. ฟังก์ชันสลับสถานะ
const toggleTaskStatus = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT'
        });
        fetchTasks();
    } catch (error) {
        console.error("เปลี่ยนสถานะไม่สำเร็จ:", error);
    }
};

// 4. ฟังก์ชันลบงาน
const deleteTask = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    } catch (error) {
        console.error("ลบงานไม่สำเร็จ:", error);
    }
};

// 5. เชื่อมต่อ DOM (ระบุ id เฉพาะเจาะจง ป้องกันวิ่งไปหา sidebar)
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');

if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        const priority = prioritySelect.value.toLowerCase();
        
        if (title) {
            addTask(title, priority);
            taskInput.value = '';
        }
    });
}

// 6. วาดรายการการ์ดงานตรงกลาง
const renderTasks = () => {
    if (!taskList) return;
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-card ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-info">
                <span class="badge-priority badge-${task.priority}">${task.priority}</span>
                <span class="task-title">${task.title}</span>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-toggle" onclick="handleToggle('${task.id}')">
                    ${task.completed ? '↺ ยกเลิก' : '✓ เสร็จแล้ว'}
                </button>
                <button class="btn-action btn-delete" onclick="handleDelete('${task.id}')">
                    🗑 ลบ
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
};

window.handleToggle = (id) => {
    toggleTaskStatus(id);
};

window.handleDelete = (id) => {
    deleteTask(id);
};

// เริ่มต้นดึงข้อมูลทันทีเมื่อโหลดหน้าเว็บ
fetchTasks();