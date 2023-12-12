document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('form');
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById('judul').value;
    const bookAuthor = document.getElementById('penulis').value;
    const bookYear = document.getElementById('tahun').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle ,bookAuthor, bookYear, false);
    todos.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
   
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
   
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted)
        uncompletedTODOList.append(todoElement);
      else
        completedTODOList.append(todoElement);
    }
  });

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function makeTodo(bookObject) {
    const textTitle = document.createElement('h4');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.textContent = 'Belum Dibaca';
     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.textContent = 'Hapus';
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.textContent = 'Selesai';
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(bookObject.id);
        });
        
        container.append(checkButton);
      }

    return container;
}

const checkButton = document.createElement('button');
checkButton.classList.add('check-button');
checkButton.textContent = 'Selesai';
 
checkButton.addEventListener('click', function () {
    addTaskToCompleted(todoObject.id);
});

function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
   
    if (todoTarget === -1) return;
   
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
   
function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
   
    return -1;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    
    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBooks() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();

  const searchResults = TODO_APPS.filter(book =>
    book.title.toLowerCase().includes(searchValue)
  );

  displaySearchResults(searchResults, searchValue);
}

function displaySearchResults(results, searchValue) {
  const bookList = document.getElementById('todos');

  bookList.innerHTML = '';

  results.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.textContent = `Judul: ${book.title}, Penulis: ${book.author}, Tahun Buku: ${book.year}`;

    if (book.title.toLowerCase().includes(searchValue)) {
      bookItem.classList.add('highlight');
    }

    bookList.appendChild(bookItem);
  });
}

