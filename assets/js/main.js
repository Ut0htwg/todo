'use Strict';
(function () {
    // test data
    let todos = [
        // {title: 'Lunch', content: 'Lunch with my friends'},
        // {title: 'Lunch', content: 'Lunch with my friends'},
        // {title: 'Lunch', content: 'Lunch with my friends'},
    ];
    // counters
    let i = 0, j = 0, k=0;          // pending/completed/in localStorage
    let arrayIndex = 0;
    // querySelectors
    const headerDay = document.querySelector('.header__day');     
    const headerDate = document.querySelector('.header__date');
    const newTodoItemBtn = document.querySelector('.header__new-todo-item>button');
    const newTodoItemInput = document.querySelector('.header__new-todo-item>input');
    const todosPending = document.querySelector('.section__todos--pending');
    const todosCompleted = document.querySelector('.section__todos--completed');
    const pendingLines = document.querySelector('.section__pending');
    const numberOfPendingItems = document.querySelector('.section__pending>p>span');
    const completedLines = document.querySelector('.section__completed');
    const numberOfCompletedItems = document.querySelector('.section__completed>p>span');
    const footerBtnComplete= document.querySelector('.footer__btn--complete');
    const footerBtnClear= document.querySelector('.footer__btn--clear');

    const dayNames = ['Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday'];
    let   footerBtnCompleteText = '';
                          
    // CRUD - localStorageHandler - C===U (a localStorage-ban a tartalom csak egészében módosíható)
    const localDB = {
        setItem(key, value) {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        },
        getItem(key) {
            const value = localStorage.getItem(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value);
        },
        removeItem(key) {
            localStorage.removeItem(key);
        },
    };

    const addNewPendingItem = () => {
        const value = newTodoItemInput.value;
        if (value === '') {
            return;
        };

        const todo = {
            text: value,
            done: false,
        };

        todos.push(todo);
        localDB.setItem('todos', todos);

        loadExistingTodos();
        newTodoItemInput.value = '';
    };

    const toggleShowComplete = () => {
        footerBtnCompleteText = footerBtnComplete.innerHTML;
        if (footerBtnCompleteText === 'Show Complete') {
            footerBtnComplete.innerHTML = 'Hide Complete';
        } else {
            footerBtnComplete.innerHTML = 'Show Complete';
        };
        loadExistingTodos();
    };
    
    const removePendingItems = () => {          // all done filtered out
        if (todos && Array.isArray(todos)) {
            todos = todos.filter(todo => todo.done);
            localDB.setItem('todos', todos);
        };
        loadExistingTodos();
    };

    const setListeners = () => {
         newTodoItemBtn.addEventListener('click', addNewPendingItem);
         footerBtnComplete.addEventListener('click', toggleShowComplete)
         footerBtnClear.addEventListener('click', removePendingItems);
    };

    const pendingListener = () => {
        todosPending.querySelectorAll('input.check-box')
        .forEach(element => {
            element.addEventListener('click', setPendingToCompleted)
        });

        todosPending.querySelectorAll('button.deleteBtn')
        .forEach(element => {
            element.addEventListener('click', deleteArrayElement)
        });
    }

    const completedListener = () => {
        todosCompleted.querySelectorAll('button.deleteBtn')
        .forEach(element => {
            element.addEventListener('click', deleteArrayElement)
        });
    }

    const setPendingToCompleted = (event) => {
        arrayIndex = event.target.parentElement.
            querySelector('input.hidden-input').value;
        todos[arrayIndex].done = true;
        localDB.setItem('todos', todos);
        loadExistingTodos();
    };

    const deleteArrayElement = (event) => {   
        arrayIndex = event.target.parentElement.
            querySelector('input.hidden-input').value;
        todos.splice(arrayIndex, 1);
        localDB.setItem('todos', todos);    
        loadExistingTodos();
    };
    
    const loadExistingTodos = () => {
        todosPending.innerHTML = '';
        todosCompleted.innerHTML = '';
        footerBtnCompleteText = footerBtnComplete.innerHTML;
        const savedTodos = localDB.getItem('todos');
        i = 0; j = 0; k=0;      // counters for pending/complete/arrayIndex
        if (savedTodos) {
            todos = savedTodos;
        }
        if (todos && Array.isArray(todos)) {
            todos.forEach( todo => {
                if (todo.done) {
                    showComplete(todo);
                } else {
                    showPending(todo);
                }
                k++;
            });
            displayVariations();
        };
    };

    const showPending = todo => {
        const todoItemPending = document.createElement('div');
        todosPending.appendChild(todoItemPending);

        todoItemPending.innerHTML = `
            <input type="checkbox" class="check-box">
            <input type="hidden" class="hidden-input" value=${k}>
            <span>${todo.text}</span>
            <button class="deleteBtn">x</button>  
        `;
        i++;
    };

    const showComplete = todo => {
        const todoItemCompleted = document.createElement('div');
        todosCompleted.appendChild(todoItemCompleted);

        todoItemCompleted.innerHTML = `
            <input type="checkbox" checked=true disabled=true>
            <input type="hidden" class="hidden-input" value=${k}>
            <span>${todo.text}</span>
            <button class="deleteBtn">x</button>        
        `;
        j++;
    };

    const displayVariations = () => {
        numberOfPendingItems.innerHTML = i;
        (i+j) ? numberOfCompletedItems.innerHTML = Math.floor(j/(i+j)*100)
                : numberOfCompletedItems.innerHTML = 0;

        if ( i === 0 ) {
            pendingLines.classList.add('display-none');
        } else {
            pendingLines.classList.remove('display-none');
            pendingListener();
        }

        if (footerBtnCompleteText === 'Show Complete' || j === 0 ) {
            completedLines.classList.add('display-none');
        } else {
            completedLines.classList.remove('display-none');
            completedListener();
        }
    };

    const ShowDate = () => {
        const currentDate = new Date();
        const day = [
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getFullYear()]
            .map (num => num < 10 ? `0${num}` : num);

        headerDay.textContent = dayNames[currentDate.getDay()];
        headerDate.textContent = day.join('-');
    };

    const initApplication = () => {
        ShowDate();
        setListeners();
        loadExistingTodos();
    };

    initApplication();
    
    // localDB.setItem('todos', todos)
    // console.log(localDB.getItem('todos'));
    // localDB.removeItem('todos');
})()