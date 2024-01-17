const express = require('express');
const todosRouter = require('./routes/todos')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/todos', todosRouter)

app.listen(3000, () => {
    console.log('API listening on port 3000');
});
