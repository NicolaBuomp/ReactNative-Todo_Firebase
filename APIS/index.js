const express = require('express');
const todosRouter = require('./routes/todos')
const cors = require('cors');
const app = express();

app.use(cors({
    credentials: true,
    origin: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/todos', todosRouter)

app.listen(3000, () => {
    console.log('API listening on port 3000');
});