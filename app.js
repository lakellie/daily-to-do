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
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(index);
    
    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) span.style.textDecoration = "line-through";

    li.appendChild(checkbox);
    li.appendChild(span);
    taskListEl.appendChild(li);
  });
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
