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
    // Al empezar a arrastrar
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.style.opacity = '0.5'; // Efecto fantasma visual
    });

    // Al soltar (termine o no en una columna válida)
    card.addEventListener('dragend', () => {
        card.style.opacity = '1'; // Regresa a la normalidad
        draggedCard = null;
    });
});

// ==========================================
// 3. EVENTOS PARA LAS COLUMNAS (DROPZONES)
// ==========================================
dropzones.forEach(zone => {
    // Permitir explícitamente soltar elementos
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Efecto visual al pasar una tarjeta por encima de la columna
    zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        zone.style.backgroundColor = '#e8e9ea'; // Gris un poco más oscuro
    });

    // Quitar el efecto visual si la tarjeta sale de la columna
    zone.addEventListener('dragleave', () => {
        zone.style.backgroundColor = '';
    });

    // Guardar la tarjeta físicamente en la nueva columna al soltar el mouse
    zone.addEventListener('drop', () => {
        zone.style.backgroundColor = ''; // Limpiar fondo
        if (draggedCard) {
            zone.appendChild(draggedCard); // Inserción limpia en el DOM
        }
    });
});

// ==========================================
// 4. LÓGICA PARA CREAR NUEVAS TARJETAS DINÁMICAMENTE
// ==========================================
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const toDoZone = document.querySelector('#to-do .cards-container');

// Función creadora de tarjetas
function createNewCard(text) {
    // Validación: Evitar que se creen tarjetas vacías o con puros espacios
    if (!text || text.trim() === "") return; 

    // 1. Crear la estructura HTML de la tarjeta desde JS
    const newCard = document.createElement('div');
    newCard.classList.add('kanban-card');
    newCard.setAttribute('draggable', 'true');

    const cardText = document.createElement('p');
    cardText.textContent = text.trim();
    newCard.appendChild(cardText);

    // 2. Inyectar los eventos de arrastre a la nueva tarjeta dinámica
    newCard.addEventListener('dragstart', () => {
        draggedCard = newCard;
        newCard.style.opacity = '0.5';
    });

    newCard.addEventListener('dragend', () => {
        newCard.style.opacity = '1';
        draggedCard = null;
    });

    // 3. Agregar la tarjeta al contenedor de la columna "Por Hacer"
    toDoZone.appendChild(newCard);

    // 4. Resetear el cuadro de texto
    taskInput.value = "";
    taskInput.focus(); // Devuelve el cursor al cuadro de texto automáticamente
}

// Escuchar el evento clic del botón azul
addTaskBtn.addEventListener('click', () => {
    createNewCard(taskInput.value);
});

// Escuchar la tecla Enter para mayor comodidad del usuario
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createNewCard(taskInput.value);
    }
});