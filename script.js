// ===== LOAD TASKS FROM LOCALSTORAGE ON PAGE LOAD =====
var tasks = [];
var currentFilter = "all";

function init() {
  var stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
  renderTasks();
}

// ===== SAVE TASKS TO LOCALSTORAGE =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== ADD A NEW TASK =====
function addTask() {
  var input = document.getElementById("taskInput");
  var dateInput = document.getElementById("taskDate");
  var priorityInput = document.getElementById("taskPriority");

  var title = input.value.trim();
  if (title === "") {
    alert("Please enter a task title!");
    return;
  }

  var newTask = {
    id: Date.now(),
    title: title,
    date: dateInput.value,
    priority: priorityInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  input.value = "";
  dateInput.value = "";
  priorityInput.value = "medium";
}

// ===== DELETE A TASK =====
function deleteTask(id) {
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// ===== TOGGLE COMPLETE =====
function toggleComplete(id) {
  tasks = tasks.map(function(task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// ===== FILTER TASKS =====
function filterTasks(filter) {
  currentFilter = filter;

  var buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function(btn) {
    btn.classList.remove("active-filter");
  });
  event.target.classList.add("active-filter");

  renderTasks();
}

// ===== RENDER TASKS TO THE PAGE =====
function renderTasks() {
  var list = document.getElementById("taskList");
  var countEl = document.getElementById("taskCount");

  if (!list) return;

  var filtered = tasks.filter(function(task) {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  countEl.textContent = "(" + filtered.length + ")";

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-message">No tasks here! Add one above ☝️</p>';
    return;
  }

  list.innerHTML = "";

  filtered.forEach(function(task) {
    var li = document.createElement("li");
    li.className = "task-item " + task.priority + (task.completed ? " completed" : "");

    var dateText = task.date ? "📅 " + task.date : "No due date";
    var priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    var completeLabel = task.completed ? "Undo" : "✔ Done";

    li.innerHTML =
      '<div class="task-info">' +
        '<span class="task-title">' + task.title + '</span>' +
        '<span class="task-meta">' + dateText + ' · ' + priorityText + ' Priority</span>' +
      '</div>' +
      '<div class="task-actions">' +
        '<button class="btn-complete" onclick="toggleComplete(' + task.id + ')">' + completeLabel + '</button>' +
        '<button class="btn-delete" onclick="deleteTask(' + task.id + ')">🗑 Delete</button>' +
      '</div>';

    list.appendChild(li);
  });
  }

// ===== RUN ON PAGE LOAD =====
init();