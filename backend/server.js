const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/noteApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.error('MongoDB connection error:', err));

// Schema and Model for Note
const noteSchema = new mongoose.Schema({
    content: String
});
const Note = mongoose.model('Note', noteSchema);

// CRUD Operations for Notes
// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new note
app.post('/notes', async (req, res) => {
    try {
        const newNote = new Note({
            content: req.body.content
        });
        await newNote.save();
        res.json(newNote);
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a note
app.put('/notes/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
