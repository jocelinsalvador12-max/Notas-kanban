// ==========================================
// 0. SALUDO DINÁMICO BLINDADO CON RESPALDO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    let nombreGuardado = localStorage.getItem('nombreUsuario');
    const tituloBienvenida = document.getElementById('welcome-title');
    
    if (!nombreGuardado || nombreGuardado.trim() === "") {
        nombreGuardado = "joce"; 
    }
    
    const hora = new Date().getHours();
    let saludoBase = "Buenas noches";
    if (hora >= 6 && hora < 12) saludoBase = "Buenos días";
    else if (hora >= 12 && hora < 19) saludoBase = "Buenas tardes";

    if (tituloBienvenida) {
        tituloBienvenida.textContent = `${saludoBase}, ${nombreGuardado} 😊`;
    }
    
    // Inicializar el enrutador de la barra lateral
    initSidebarNavigation();
    // Inicializar lógicas de las secciones
    initTaskManagement();
    initNotesManagement();
});

// ==========================================
// 1. MOTOR DE NAVEGACIÓN (INTERCAMBIO DE VISTAS)
// ==========================================
function initSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Mapeo exacto entre el texto del botón y el ID de la sección HTML
    const sectionsMap = {
        '🏠 Inicio': 'sec-inicio',
        '⭐ Favoritos': 'sec-favoritos',
        '📚 Semestre Actual': 'sec-inicio', // Redirige a inicio de momento
        '📅 Horarios y Tareas': 'sec-tareas', // Soporte a textos anteriores
        'Tareas': 'sec-tareas',
        'Horarios': 'sec-horarios',
        'Notas': 'sec-notas',
        'Biblioteca': 'sec-biblioteca'
    };

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover estado activo visual del menú anterior
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Limpiar texto para identificar la sección limpia
            const itemText = item.textContent.replace(/[📝🏠⭐📚💻📅💡🚀🗑️⚙️]/g, '').trim();
            
            // Buscar la sección correspondiente
            let targetSectionId = sectionsMap[item.textContent.trim()] || sectionsMap[itemText];
            
            if (targetSectionId) {
                // Ocultar todas las secciones primero
                document.querySelectorAll('.notion-section').forEach(sec => sec.classList.add('d-none'));
                // Mostrar la sección seleccionada
                document.getElementById(targetSectionId).classList.remove('d-none');
            }
        });
    });
}

// ==========================================
// 2. INTERACTIVIDAD DE LA SECCIÓN TAREAS
// ==========================================
function initTaskManagement() {
    const btnAddTask = document.getElementById('btn-add-task');
    if (!btnAddTask) return;

    btnAddTask.addEventListener('click', () => {
        const title = document.getElementById('task-title').value;
        const start = document.getElementById('task-start').value;
        const end = document.getElementById('task-end').value;

        if (!title.trim()) return alert("Escribe el nombre de la tarea");

        const list = document.getElementById('task-list-render');
        const li = document.createElement('li');
        li.innerHTML = `<strong>📌 ${title}</strong> — <small>Inicio: ${start || 'Sin fecha'} | Vence: ${end || 'Sin fecha'}</small>`;
        list.appendChild(li);

        // Limpiar inputs
        document.getElementById('task-title').value = "";
        document.getElementById('task-start').value = "";
        document.getElementById('task-end').value = "";
    });
}

// ==========================================
// 3. INTERACTIVIDAD DE LA SECCIÓN NOTAS
// ==========================================
function initNotesManagement() {
    const btnAddNote = document.getElementById('btn-add-note');
    if (!btnAddNote) return;

    btnAddNote.addEventListener('click', () => {
        const text = document.getElementById('note-text').value;
        if (!text.trim()) return alert("El apunte no puede estar vacío");

        const container = document.getElementById('notes-container-render');
        const card = document.createElement('div');
        card.classList.add('note-item-card');
        card.innerHTML = `<p>${text}</p><small style="color:#888;">✍️ Guardado hoy</small>`;
        container.appendChild(card);

        document.getElementById('note-text').value = "";
    });
}