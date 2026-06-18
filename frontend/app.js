// 1. Seleccionamos todas las tarjetas y las zonas donde pueden caer
const cards = document.querySelectorAll('.kanban-card');
const dropzones = document.querySelectorAll('.dropzone');

// Variable para guardar la tarjeta que se está arrastrando actualmente
let draggedCard = null;

// 2. Escuchamos los eventos de las tarjetas
cards.forEach(card => {
    // Cuando el usuario empieza a arrastrar la tarjeta
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.style.opacity = '0.5'; // Se pone transparente para dar efecto visual
    });

    // Cuando el usuario suelta la tarjeta (termine o no el movimiento)
    card.addEventListener('dragend', () => {
        card.style.opacity = '1'; // Regresa a su opacidad normal
        draggedCard = null;
    });
});

// 3. Escuchamos los eventos de las columnas (dropzones)
dropzones.forEach(zone => {
    // Obligatorio: Por defecto el navegador prohíbe soltar cosas. Esto lo permite:
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Cuando la tarjeta entra visualmente a la columna (opcional: para cambiar el fondo)
    zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        zone.style.backgroundColor = '#e8e9ea'; // Se oscurece un poquito la columna
    });

    // Cuando la tarjeta sale de la columna sin soltarla
    zone.addEventListener('dragleave', () => {
        zone.style.backgroundColor = ''; // Regresa al fondo normal
    });

    // ¡El momento clave! Cuando el usuario suelta la tarjeta dentro de la columna
    zone.addEventListener('drop', () => {
        zone.style.backgroundColor = ''; // Quita el fondo de selección
        if (draggedCard) {
            zone.appendChild(draggedCard); // Metemos la tarjeta físicamente a esta columna
        }
    });
});