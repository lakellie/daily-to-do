const taskListEl = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const dateEl = document.getElementById("date");
const pastDatesEl = document.getElementById("past-dates");

const today = new Date().toISOString().split("T")[0];
dateEl.textContent = today;

let currentTasks = loadTasks(today);
renderTasks(currentTasks);
populatePastDates();

function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;
  currentTasks.push({ text, done: false });
  saveTasks(today, currentTasks);
  renderTasks(currentTasks);
  newTaskInput.value = "";
}

function toggleTask(index) {
  currentTasks[index].done = !currentTasks[index].done;
  saveTasks(today, currentTasks);
  renderTasks(currentTasks);
}

function renderTasks(tasks) {
  taskListEl.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.setAttribute("draggable", "true");
    li.dataset.index = index;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-swipe-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(index);

    const content = document.createElement("div");
    content.className = "task-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(index);

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) span.style.textDecoration = "line-through";
    span.style.flex = "1";

    content.appendChild(checkbox);
    content.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(content);
    taskListEl.appendChild(li);

    // --- SWIPE TO DELETE ---
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    content.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    content.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      if (deltaX < 0) {
        content.style.transform = `translateX(${deltaX}px)`;
      }
    });

    content.addEventListener("touchend", () => {
      isDragging = false;
      if (currentX - startX < -60) {
        content.style.transform = `translateX(-80px)`;
      } else {
        content.style.transform = `translateX(0)`;
      }
    });

    // --- LONG PRESS TO REORDER ---
    let pressTimer;
    content.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        li.draggable = true;
        li.classList.add("dragging");
      }, 300);
    });

    content.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });

    content.addEventListener("touchmove", () => {
      clearTimeout(pressTimer); // Cancel if swiping instead of long press
    });
  });

  setupDragAndDrop();
}


function saveTasks(date, tasks) {
  localStorage.setItem(`todo-${date}`, JSON.stringify(tasks));
  populatePastDates();
}

function loadTasks(date) {
  const data = localStorage.getItem(`todo-${date}`);
  return data ? JSON.parse(data) : [];
}

function populatePastDates() {
  pastDatesEl.innerHTML = '<option disabled selected>Select a date</option>';
  for (let key in localStorage) {
    if (key.startsWith("todo-")) {
      const date = key.slice(5);
      const option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      pastDatesEl.appendChild(option);
    }
  }
}

function loadListForDate(date) {
  if (!date) return;
  const tasks = loadTasks(date);
  dateEl.textContent = date;
  currentTasks = tasks;
  renderTasks(currentTasks);
}
