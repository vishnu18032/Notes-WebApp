document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.querySelector("#addBtn");
    const main = document.querySelector("#main");

    // Function to fetch notes from the backend
    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:3000/notes');
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const notes = await response.json();
            notes.forEach(note => addNoteToDOM(note));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    // Function to save a new note to the backend
    const saveNoteToDB = async (content) => {
        try {
            const response = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            if (!response.ok) {
                throw new Error('Failed to save note');
            }
            const newNote = await response.json();
            // showNotification("Saved"); // Removed to prevent notification on add
            return newNote;
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    // Function to update an existing note in the backend
    const updateNoteInDB = async (id, content) => {
        try {
            const response = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            if (!response.ok) {
                throw new Error('Failed to update note');
            }
            const updatedNote = await response.json();
            showNotification("Saved");
            return updatedNote;
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    // Function to delete a note from the backend and DOM
    const deleteNoteFromDB = async (id, noteElement) => {
        try {
            await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'DELETE'
            });
            noteElement.remove();
            showNotification("Deleted");
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    // Function to add a note to the DOM
    const addNoteToDOM = (note) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
            <div class="tool">
                <i class="fa-solid fa-trash"></i>
                <i class="fa-solid fa-floppy-disk"></i>
            </div>
            <textarea>${note.content}</textarea>
        `;

        // Event listener for the delete icon
        noteElement.querySelector(".fa-trash").addEventListener("click", async function() {
            await deleteNoteFromDB(note._id, noteElement); // Delete from backend and DOM
        });

        // Event listener for the save icon
        noteElement.querySelector(".fa-floppy-disk").addEventListener("click", async function() {
            const updatedContent = noteElement.querySelector("textarea").value;
            await updateNoteInDB(note._id, updatedContent); // Update in backend
        });

        main.appendChild(noteElement);
    };

    const addNote = async () => {
        const newNote = await saveNoteToDB('');
        addNoteToDOM(newNote);
    };

    // Event listener for the add button
    addBtn.addEventListener("click", addNote);

    fetchNotes(); // Fetch notes from the backend when the page loads

    // Adding Notification
    const showNotification = (message) => {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    };
});
