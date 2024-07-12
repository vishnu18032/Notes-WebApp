document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.querySelector("#addBtn");
    const main = document.querySelector("#main");

    const saveNotes = () => {
        const notes = document.querySelectorAll(".note textarea");
        console.log(notes);
        const data = [];
        notes.forEach(
            (note) => {
                data.push(note.value);
            }
        );
        localStorage.setItem("notes",JSON.stringify(data))
    };

    addBtn.addEventListener(
        "click",
        function(){
            addNote();
        }
    );

    const addNote = () => {
        const note = document.createElement("div");
        note.classList.add("note");
        note.innerHTML = `
            <div class="tool">
                <i class="fa-solid fa-trash"></i>
                <i class="fa-solid fa-floppy-disk"></i>
            </div>
            <textarea></textarea>
        `;
        
        note.querySelector(".fa-trash").addEventListener("click", function() {
            note.remove();
        });
        note.querySelector(".fa-floppy-disk").addEventListener("click", function() {
            saveNotes();
        });

        main.appendChild(note);
    };
});
