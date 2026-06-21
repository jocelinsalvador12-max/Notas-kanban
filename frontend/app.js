// ==========================================
// 0. SALUDO DINÁMICO BLINDADO (CON LOCALSTORAGE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intentar obtener el nombre guardado de la memoria
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    const tituloBienvenida = document.getElementById('welcome-title');
    
    // 2. Calcular el saludo correcto según la hora real de tu computadora
    const hora = new Date().getHours();
    let saludoBase = "Buenas noches";
    
    if (hora >= 6 && hora < 12) {
        saludoBase = "Buenos días";
    } else if (hora >= 12 && hora < 19) {
        saludoBase = "Buenas tardes";
    }

    // 3. Si encontramos el contenedor en el HTML, actualizamos el texto
    if (tituloBienvenida) {
        if (nombreGuardado && nombreGuardado.trim() !== "") {
            // Si hay un nombre registrado, lo saludamos de forma personalizada
            tituloBienvenida.textContent = `${saludoBase}, ${nombreGuardado} 😊`;
        } else {
            // Si por alguna razón falló el guardado, ponemos un saludo genérico
            tituloBienvenida.textContent = `${saludoBase} 😊`;
        }
    }
});

// ==========================================
// 1. LÓGICA DE INTERACCIÓN CON LAS TARJETAS NOTION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards-grid');

    if (cardsContainer) {
        // Escuchar clics en la rejilla para manejar la creación o eliminación de tarjetas
        cardsContainer.addEventListener('click', (e) => {
            
            // Si el usuario da clic en la tarjeta especial de "Nueva página"
            const createCard = e.target.closest('.create-card');
            if (createCard) {
                const tituloNota = prompt("¿Cómo se llamará tu nueva nota?");
                if (tituloNota && tituloNota.trim() !== "") {
                    createNewNotionCard(tituloNota.trim(), createCard);
                }
            }
        });
    }
});

// Función para crear dinámicamente nuevas tarjetas estilo Notion
function createNewNotionCard(title, buttonCard) {
    const cardsGrid = document.querySelector('.cards-grid');
    
    // Crear el contenedor de la tarjeta
    const newCard = document.createElement('div');
    newCard.classList.add('notion-page-card');
    
    // Insertar el diseño interno idéntico a las anteriores
    newCard.innerHTML = `
        <div class="page-icon">📄</div>
        <div class="page-info">
            <h3>${title}</h3>
            <span>Hace un momento</span>
        </div>
    `;
    
    // Insertar la nueva tarjeta justo antes del botón de crear "Nueva página"
    cardsGrid.insertBefore(newCard, buttonCard);
}