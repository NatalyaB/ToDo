(function() {

    var button = document.querySelector('#add-todo');
    var container = document.querySelector('.todo-list');


    function getTodoList () {
        var promise = fetch('/todos', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        });

        promise.then(function(response) {
            return response.json();
        }).then(function(todos) {
            todos.forEach(function(el) {
                createTodoItem(el);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    getTodoList();

    // Add todo click handler
    button.addEventListener('click', function () { 
        var title = prompt('Add yuor ToDo');
        var body = {
            'title': title
        };

        var promise = fetch('/todos', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        promise.then(function(response) {
            return response.json();
        }).then(function(data) {
            createTodoItem(data);
        }).catch(error => {
            console.log(error);
        });
    });


    function createTodoItem (data) {
        var todoItem = document.createElement('div');
        todoItem.setAttribute('id', data.id);
        todoItem.setAttribute('class', 'row');

        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.classList.add('col-md-1');
        checkbox.classList.add('col-sm-1');
        todoItem.appendChild(checkbox);

        var paragraph = document.createElement('p');
        paragraph.setAttribute('class', 'todo-title');
        paragraph.classList.add('col-md-9');
        paragraph.classList.add('col-sm-11');
        paragraph.innerHTML = data.title;
        todoItem.appendChild(paragraph);

        var updateButton = document.createElement('button');
        updateButton.setAttribute('class', 'update');
        updateButton.classList.add('col-md-1');
        updateButton.classList.add('col-sm-6');
        
        updateButton.innerHTML = 'Update';
        todoItem.appendChild(updateButton);

        var deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'delete');
        deleteButton.classList.add('col-md-1');
        deleteButton.classList.add('col-sm-6');
        
        deleteButton.innerHTML = 'Delete';
        todoItem.appendChild(deleteButton);

        container.appendChild(todoItem);
    };


    // todo click handler
    container.addEventListener('click', function(event) {
        var target = event.target;

        if (target.tagName !== 'BUTTON') return;

        if (target.classList.contains('update')) {
            updateTodo(target);
        } else {
            deleteTodo(target);
            };
        });        


    // UPDATE 
    function updateTodo(target) {
        var parent = target.parentNode;
        var id = parent.getAttribute('id');
        var p = parent.querySelector('.todo-title');
        var title = p.innerText;
        var prompt = window.prompt('Update your ToDo?', title);


        var updatePromise = fetch('/todos/' + id, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: prompt})
        });

        updatePromise.then(function(response) {
            return response.json();
        }).then(function(response) {
            p.innerText = response.title;
        }).catch(function(error) {

        });
    }

    //DELETE
    function deleteTodo(target) {
        var parent = target.parentNode;
        var id = parent.getAttribute('id');

        deletePromise = fetch('/todos/' + id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'}
        });

        deletePromise.then(function(response) {
            if (response.status === 200) {
                parent.remove();
            }
        }).catch(function(error) {

        });
    }


    //  CHECKBOX
    container.addEventListener('change', function(event) {
        var target = event.target;
        if (target.tagName !== 'INPUT') return;

        var parent = target.parentNode;
        var id = parent.getAttribute('id');
        var status = target.checked;

        checkedProsmise = fetch('/todos/' + id, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'status': status})
        });

        checkedProsmise.then(function(response) {
            return response.json();
        }).then(function(response) {
            if (response.status) {
                parent.classList.add('done');
            } else {
                parent.classList.remove('done');
            }
        }).catch(function(error) { });
    }); 

})();

