const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const counter = document.getElementById('counter');

const showAllBtn = document.getElementById('show-all');
const showActiveBtn = document.getElementById('show-active');
const showDoneBtn = document.getElementById('show-done');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

//päivittää localStoragen
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

//äivittää laskurin
function updateCounter() {
  const activeCount = todos.filter(t => !t.done).length;
  counter.textContent = `keskeneräiset tehtävät: ${activeCount}`;
}

//lisää tehtävät
function renderTodos(filter = 'all') {
  list.innerHTML = '';
  let filtered = todos;

  if (filter === 'active') filtered = todos.filter(t => !t.done);
  if (filter === 'done') filtered = todos.filter(t => t.done);

  filtered.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.done ? 'done' : '';

    const span = document.createElement('span');
    span.textContent = todo.text;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✔';
    completeBtn.title = 'Merkitse tehdyksi';
    completeBtn.addEventListener('click', () => {
      todos[index].done = !todos[index].done;
      updateLocalStorage();
      renderTodos(filter);
      updateCounter();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.title = 'Poista tehtävä';
    deleteBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      updateLocalStorage();
      renderTodos(filter);
      updateCounter();
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(completeBtn);
    buttonContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonContainer);
    list.appendChild(li);
  });
}

// uusi tehtävä
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();

  if (value.length < 3) {
    errorMessage.textContent = 'Tehtävän pitää olla vähintään 3 merkkiä pitkä.';
    input.classList.add('error');
    return;
  }

  errorMessage.textContent = '';
  input.classList.remove('error');

  todos.push({ text: value, done: false });
  input.value = '';
  updateLocalStorage();
  renderTodos();
  updateCounter();
});


function setActiveButton(activeButton) {
  [showAllBtn, showActiveBtn, showDoneBtn].forEach(btn => btn.classList.remove('active'));
  activeButton.classList.add('active');
}

showAllBtn.addEventListener('click', () => {
  setActiveButton(showAllBtn);
  renderTodos('all');
});

showActiveBtn.addEventListener('click', () => {
  setActiveButton(showActiveBtn);
  renderTodos('active');
});

showDoneBtn.addEventListener('click', () => {
  setActiveButton(showDoneBtn);
  renderTodos('done');
});


renderTodos();
updateCounter();
