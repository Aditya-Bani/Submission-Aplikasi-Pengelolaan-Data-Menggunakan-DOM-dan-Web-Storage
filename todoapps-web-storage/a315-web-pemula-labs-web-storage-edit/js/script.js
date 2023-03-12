/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */
const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, penulis, tahun, judul, kotaTerbit, penerbit, tanggalSelesai, isCompleted) {
  return {
    id,
    penulis,
    tahun,
    judul,
    kotaTerbit, 
    penerbit, 
    tanggalSelesai,
    isCompleted
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(bookObject) {

  const {id, penulis, tahun, judul, kotaTerbit, penerbit, tanggalSelesai, isCompleted} = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = id;

  const textJudul = document.createElement('h2');
  textJudul.innerText = judul;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = `Penulis Buku : ${penulis}`;

  const textTahunTerbit = document.createElement('p');
  textTahunTerbit.innerText = `Tahun Terbit : ${tahun}`;

  const textKotaTerbit = document.createElement('p');
  textKotaTerbit.innerText = `Kota Terbit : ${kotaTerbit}`;

  const textPenerbit = document.createElement('p');
  textPenerbit.innerText = `Penerbit  : ${penerbit}`;

  const textTanggalSelesai = document.createElement('p');
  textTanggalSelesai.innerText = `Tanggal Selesai Pinjam  : ${tanggalSelesai}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textJudul, textPenulis, textTahunTerbit, textKotaTerbit, textPenerbit, textTanggalSelesai);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });
 
    container.append(undoButton, trashButton);
  } else {
 
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });
 
    container.append(checkButton);

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });
    container.append(trashButton);
  }
 
  return container;
}



function addTodo() {
 const penulis = document.getElementById('title').value;
 const judul = document.getElementById('judul').value;
 const timestamp  = document.getElementById('date').value;
 const tahunTerbit = document.getElementById('tahun').value;
 const kotaTerbit = document.getElementById('kota-terbit').value;
 const penerbit = document.getElementById('penerbit').value;

 const generateID = generateId();
 const todoObject = generateTodoObject(generateID, penulis, tahunTerbit, judul, kotaTerbit, penerbit, timestamp, false);
 todos.push(todoObject);

 document.dispatchEvent(new Event(RENDER_EVENT));
 saveData();
 }

function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoTaskFromCompleted(todoId /* HTMLELement */) {
 
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
document.addEventListener('DOMContentLoaded', function () {
 
  const submitForm /* HTMLFormElement */ = document.getElementById('form');
 
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
 
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
 
document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});
 
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');
 
  // clearing list item
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';
 
  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});