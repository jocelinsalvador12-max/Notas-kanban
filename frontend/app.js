// Memoria volátil de la aplicación (Se conectará con Spring Boot después)
let NOTES_ARRAY = [];
let TASKS_ARRAY = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar Nombre y Saludo
    let nombreGuardado = localStorage.getItem('nombreUsuario') || "joce";
    const tituloBienvenida = document.getElementById('welcome-title');
    const hora = new Date().getHours();
    let saludoBase = "Buenas noches";
    if (hora >= 6 && hora < 12) saludoBase = "Buenos días";
    else if (hora >= 12 && hora < 19) saludoBase = "Buenas tardes";
    if (tituloBienvenida) tituloBienvenida.textContent = `${saludoBase}, ${nombreGuardado} 😊`;

    // 2. Inicializar Módulos del Sistema
    initSidebarNavigation();
    initNotesEngine();
    initTasksEngine();
    initExtraFeatures();
});

// MOTOR DE NAVEGACIÓN ENTRE VISTAS
function initSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sectionsMap = {
        '🏠 Inicio': 'sec-inicio',
        '⭐ Favoritos': 'sec-favoritos',
        'Tareas': 'sec-tareas',
        'Horarios': 'sec-horarios',
        'Notas': 'sec-notas',
        'Biblioteca': 'sec-biblioteca'
    };

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const cleanText = item.textContent.replace(/[📝🏠⭐📚💻📅💡🚀🗑️⚙️]/g, '').trim();
            let target = sectionsMap[item.textContent.trim()] || sectionsMap[cleanText];
            
            if (target) {
                document.querySelectorAll('.notion-section').forEach(sec => sec.classList.add('d-none'));
                document.getElementById(target).classList.remove('d-none');
            }
        });
    });

    // Enlace rápido del botón "Nueva página" del inicio hacia la sección Notas
    document.getElementById('btn-trigger-new-page').addEventListener('click', () => {
        document.querySelectorAll('.notion-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById('sec-notas').classList.remove('d-none');
    });
}

// MOTOR DE NOTAS (CREAR, EDITAR, ELIMINAR, FAVORITOS, BUSCADOR)
function initNotesEngine() {
    const btnSaveNote = document.getElementById('btn-add-note');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    btnSaveNote.addEventListener('click', () => {
        const id = document.getElementById('edit-note-id').value;
        const title = document.getElementById('note-title-input').value.trim();
        const content = document.getElementById('note-text').value.trim();
        const category = document.getElementById('note-category').value;

        if (!title || !content) return alert("Por favor rellena el título y el contenido");

        if (id) {
            // Modo Edición
            const note = NOTES_ARRAY.find(n => n.id == id);
            if (note) {
                note.title = title;
                note.content = content;
                note.category = category;
            }
            document.getElementById('edit-note-id').value = ""; // Limpiar id
        } else {
            // Modo Creación Nueva
            const newNote = {
                id: Date.now(),
                title,
                content,
                category,
                favorite: false,
                date: new Date()
            };
            NOTES_ARRAY.push(newNote);
        }

        // Limpiar inputs y actualizar vistas
        document.getElementById('note-title-input').value = "";
        document.getElementById('note-text').value = "";
        updateNotesDOM();
    });

    // Buscador interactivo en tiempo real
    searchInput.addEventListener('input', updateNotesDOM);
    sortSelect.addEventListener('change', updateNotesDOM);
}

function updateNotesDOM() {
    const libraryContainer = document.getElementById('library-notes-render');
    const favContainer = document.getElementById('fav-notes-render');
    const counterBadge = document.getElementById('notes-counter');
    const query = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-select').value;

    libraryContainer.innerHTML = "";
    favContainer.innerHTML = "";
    
    // Actualizar contador global
    counterBadge.textContent = `Notas totales: ${NOTES_ARRAY.length}`;

    // Filtrar y ordenar copia del array
    let filteredNotes = NOTES_ARRAY.filter(n => n.title.toLowerCase().includes(query));
    
    if (sortBy === 'alpha-asc') {
        filteredNotes.sort((a,b) => a.title.localeCompare(b.title));
    } else {
        filteredNotes.sort((a,b) => b.id - a.id);
    }

    // Renderizar
    filteredNotes.forEach(note => {
        const cardHTML = `
            <div class="note-card-complex">
                <span class="category-tag">${note.category}</span>
                <h3>${note.title}</h3>
                <p style="font-size:0.9rem; opacity:0.8;">${note.content.substring(0, 60)}...</p>
                <div class="note-card-actions">
                    <button class="action-btn ${note.favorite ? 'fav-active' : ''}" onclick="toggleFavorite(${note.id})">⭐</button>
                    <div>
                        <button class="action-btn" onclick="editNote(${note.id})" style="color:#5263f9; margin-right:8px;">✏️</button>
                        <button class="action-btn" onclick="deleteNote(${note.id})" style="color:#ff4a4a;">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        
        libraryContainer.innerHTML += cardHTML;
        if (note.favorite) {
            favContainer.innerHTML += cardHTML;
        }
    });
}

// FUNCIONES GLOBALES ASOCIADAS A LOS BOTONES DE LAS TARJETAS
window.toggleFavorite = (id) => {
    const note = NOTES_ARRAY.find(n => n.id === id);
    if (note) note.favorite = !note.favorite;
    updateNotesDOM();
};

window.deleteNote = (id) => {
    NOTES_ARRAY = NOTES_ARRAY.filter(n => n.id !== id);
    updateNotesDOM();
};

window.editNote = (id) => {
    const note = NOTES_ARRAY.find(n => n.id === id);
    if (note) {
        document.getElementById('edit-note-id').value = note.id;
        document.getElementById('note-title-input').value = note.title;
        document.getElementById('note-text').value = note.content;
        document.getElementById('note-category').value = note.category;
        
        // Redirigir a la pestaña Notas para que vea los datos cargados
        document.querySelectorAll('.notion-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById('sec-notas').classList.remove('d-none');
    }
};

// MOTOR DE TAREAS (AGREGAR, MARCAR COMPLETADO)
function initTasksEngine() {
    const btnAddTask = document.getElementById('btn-add-task');
    
    btnAddTask.addEventListener('click', () => {
        const title = document.getElementById('task-title').value.trim();
        const deadline = document.getElementById('task-deadline').value;

        if (!title) return alert("Escribe el contenido de la tarea");

        const newTask = {
            id: Date.now(),
            title,
            deadline: deadline || 'Sin fecha límite',
            completed: false
        };

        TASKS_ARRAY.push(newTask);
        document.getElementById('task-title').value = "";
        document.getElementById('task-deadline').value = "";
        updateTasksDOM();
    });
}

function updateTasksDOM() {
    const renderContainer = document.getElementById('task-list-render');
    renderContainer.innerHTML = "";

    TASKS_ARRAY.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span><strong>${task.title}</strong> — <small>📅 Límite: ${task.deadline}</small></span>
            </div>
        `;
        renderContainer.appendChild(li);
    });
}

window.toggleTask = (id) => {
    const task = TASKS_ARRAY.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    updateTasksDOM();
};

// EXTRAS: CAMBIADOR DE COLOR DE FONDO / TEMAS
function initExtraFeatures() {
    const picker = document.getElementById('bg-color-picker');
    picker.addEventListener('change', (e) => {
        document.body.className = ""; // Limpiar clases
        if (e.target.value !== 'default') {
            document.body.classList.add(e.target.value);
        }
    });
}

// CONTROL DE REDIRECCIÓN DEL LOGIN
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue sola
        
        const usernameInput = document.getElementById('username').value.trim();
        
        if (usernameInput) {
            // Guardamos el nombre para que el saludo diga "Buenas noches, jocelin"
            localStorage.setItem('nombreUsuario', usernameInput);
            
            // Te manda directo al tablero principal
            window.location.href = 'index.html';
        }
    });
}