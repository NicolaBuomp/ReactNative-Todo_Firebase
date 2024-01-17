const express = require('express');
const { db } = require('../firebase')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todosRef = db.collection('todos');
        const snapshot = await todosRef.get();

        if (snapshot.empty) {
            return res.status(404).send('No todos found');
        }

        const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(todos);
    } catch (error) {
        console.error('Error getting todos', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/create-todo', async (req, res) => {
    try {
        const todosRef = db.collection('todos');

        await todosRef.add(req.body);

        res.status(200).send('New todo');
    } catch (error) {
        console.error('Error getting todos', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/update-todo/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const updatedData = req.body; // I nuovi dati del todo da aggiornare

        // Verifica che i nuovi dati siano forniti
        if (!updatedData) {
            return res.status(400).send('Invalid request. Missing updated data.');
        }

        // Ottieni il riferimento al documento specifico tramite l'ID
        const todoRef = db.collection('todos').doc(todoId);

        // Verifica se il todo esiste
        const todoDoc = await todoRef.get();
        if (!todoDoc.exists) {
            return res.status(404).send('Todo not found');
        }

        // Esegui l'aggiornamento dei dati
        await todoRef.update(updatedData);

        res.status(200).send('Todo updated successfully');
    } catch (error) {
        console.error('Error updating todo', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete-todo/:id', async (req, res) => {

    try {
        const todoId = req.params.id;

        // Ottieni il riferimento al documento specifico tramite l'ID
        const todoRef = db.collection('todos').doc(todoId);

        // Verifica se il todo esiste
        const todoDoc = await todoRef.get();
        if (!todoDoc.exists) {
            return res.status(404).send('Todo not found');
        }

        // Esegui l'eliminazione del documento
        await todoRef.delete();

        res.status(200).send('Todo deleted successfully');
    } catch (error) {
        console.error('Error deleting todo', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;