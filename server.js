var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('It is working');
});

//
var todos = [];

app.get('/todos', function(req, res) {
    res.json(todos);
});

app.post('/todos', function(req, res) {
    var todo = {
        title: req.body.title,
        date: new Date(),
        status: false,
        id: Math.floor(Math.random()*10000)
    };
    todos.push(todo);

    res.json(todo);
});

app.put('/todos/:id', function(req, res) {
    var id = req.params.id;
    var index = todos.findIndex((el) => el.id == id);
    var element = todos[index];

    if (req.body.title) {
        element.title = req.body.title;
    }

    if (typeof req.body.status === 'boolean') {
        element.status = req.body.status;
    }


    res.json(todos[index]);
});

app.delete('/todos/:id', function(req, res) {
    var id = req.params.id;
    var index = todos.findIndex((el) => el.id == id);
    todos.splice(index, 1);

    res.status(200).end();
});


app.listen(8000, function () {
    console.log('API app started');
});