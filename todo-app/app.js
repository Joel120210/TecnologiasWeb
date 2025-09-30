/* script.js - To-Do App Perrona (separado)
   Guarda tareas en localStorage y maneja agregar/editar/completar/eliminar.
*/

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "todoPerronTasks_v1";
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const countLabel = document.getElementById("count");
  const clearCompletedBtn = document.getElementById("clearCompleted");

  let tasks = loadTasks();

  // Render inicial
  renderTasks();

  // Eventos
  addBtn.addEventListener("click", handleAddTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAddTask();
  });
  clearCompletedBtn.addEventListener("click", clearCompleted);

  // ----------------- Funciones -----------------
  function generateId() {
    return `${Date.now()}-${Math.floor(Math.random()*10000)}`;
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Error leyendo localStorage:", err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Error guardando localStorage:", err);
    }
  }

  function handleAddTask() {
    const text = taskInput.value.trim();
    if (!text) {
      // efecto sutil si está vacío
      taskInput.style.animation = "borderFlash .18s ease";
      setTimeout(()=> taskInput.style.animation = "", 220);
      return;
    }
    const newTask = { id: generateId(), text, completed: false };
    tasks.unshift(newTask); // aparece arriba
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
  }

  // Representa la lista en DOM
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item added";
      li.dataset.id = task.id;

      // Izquierda: checkbox + texto
      const left = document.createElement("div");
      left.className = "left";

      const checkbox = document.createElement("div");
      checkbox.className = "checkbox" + (task.completed ? " checked" : "");
      checkbox.setAttribute("role","button");
      checkbox.setAttribute("aria-label", task.completed ? "Marcar como no completada" : "Marcar como completada");
      checkbox.addEventListener("click", () => toggleComplete(task.id));

      const textSpan = document.createElement("span");
      textSpan.className = "task-text" + (task.completed ? " completed" : "");
      textSpan.textContent = task.text;
      // click en texto también alterna completado (ux)
      textSpan.addEventListener("click", () => toggleComplete(task.id));

      left.appendChild(checkbox);
      left.appendChild(textSpan);

      // Acciones
      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.className = "action-btn edit";
      editBtn.textContent = "✏️";
      editBtn.title = "Editar tarea";
      editBtn.addEventListener("click", () => editTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete";
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Eliminar tarea";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(left);
      li.appendChild(actions);

      taskList.appendChild(li);
    });

    updateCount();
  }

  function toggleComplete(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx < 0) return;
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
  }

  function editTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx < 0) return;
    const current = tasks[idx].text;
    const newText = prompt("Editar tarea:", current);
    if (newText === null) return; // canceló
    const trimmed = newText.trim();
    if (!trimmed) {
      alert("La tarea no puede quedar vacía.");
      return;
    }
    tasks[idx].text = trimmed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }

  function clearCompleted() {
    const any = tasks.some(t => t.completed);
    if (!any) { alert("No hay tareas completadas."); return; }
    if (!confirm("Eliminar todas las tareas completadas?")) return;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  }

  function updateCount() {
    const total = tasks.length;
    const remaining = tasks.filter(t => !t.completed).length;
    countLabel.textContent = `${remaining} activas • ${total} total`;
  }
});
