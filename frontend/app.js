// ==========================================
// 1. CONFIGURACIÓN INICIAL Y SELECCIÓN DE ELEMENTOS
// ==========================================
const cards = document.querySelectorAll('.kanban-card');
const dropzones = document.querySelectorAll('.dropzone');

// Variable global para almacenar la tarjeta que se está moviendo
let draggedCard = null;

// ==========================================
// 2. EVENTOS PARA LAS TARJETAS EXISTENTES
// ==========================================
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        draggedCard = null;
    });
});

// ==========================================
// 3. EVENTOS PARA LAS COLUMNAS (DROPZONES)
// ==========================================
dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        zone.style.backgroundColor = 'rgba(232, 233, 234, 0.5)'; // Un toque gris sutil al pasar la tarjeta
    });

    zone.addEventListener('dragleave', () => {
        zone.style.backgroundColor = '';
    });

    zone.addEventListener('drop', () => {
        zone.style.backgroundColor = '';
        if (draggedCard) {
            zone.appendChild(draggedCard);
        }
    });
});

// ==========================================
// 4. LÓGICA PARA CREAR NUEVAS TARJETAS CON BOTÓN DE BORRAR
// ==========================================
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const toDoZone = document.querySelector('#to-do .cards-container');

// Función creadora de tarjetas
function createNewCard(text) {
    if (!text || text.trim() === "") return; 

    // 1. Crear el contenedor de la tarjeta
    const newCard = document.createElement('div');
    newCard.classList.add('kanban-card');
    newCard.setAttribute('draggable', 'true');

    // 2. Crear el texto de la tarjeta
    const cardText = document.createElement('p');
    cardText.textContent = text.trim();
    newCard.appendChild(cardText);

    // 3. Crear el botón de eliminar (X)
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×'; 
    deleteBtn.classList.add('delete-card-btn');
    newCard.appendChild(deleteBtn);

    // 4. Evento para eliminar la tarjeta con efecto visual
    deleteBtn.addEventListener('click', () => {
        newCard.style.opacity = '0';
        newCard.style.transform = 'scale(0.9)';
        setTimeout(() => {
            newCard.remove(); 
        }, 200); 
    });

    // 5. Inyectar eventos de arrastre a la nueva tarjeta
    newCard.addEventListener('dragstart', () => {
        draggedCard = newCard;
        newCard.style.opacity = '0.5';
    });

    newCard.addEventListener('dragend', () => {
        newCard.style.opacity = '1';
        draggedCard = null;
    });

    // 6. Agregar al contenedor "Por Hacer" y resetear
    toDoZone.appendChild(newCard);
    taskInput.value = "";
    taskInput.focus();
}

// Escuchar los clics del botón añadir
addTaskBtn.addEventListener('click', () => {
    createNewCard(taskInput.value);
});

// Escuchar la tecla Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createNewCard(taskInput.value);
    }
});