// Escuchar cuando el usuario envíe el formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue solo

    // Capturar el valor exacto del input con id="username"
    const usuarioInput = document.getElementById('username');
    const contrasenaInput = document.getElementById('password');

    if (usuarioInput && contrasenaInput) {
        const usuario = usuarioInput.value.trim();
        const contrasena = contrasenaInput.value;

        // Validación simple para el frontend (Mínimo un nombre y 4 caracteres de clave)
        if (usuario !== "" && contrasena.length >= 4) {
            
            // 👇 LA CLAVE: Guardamos el nombre exacto en la memoria del navegador
            localStorage.setItem('nombreUsuario', usuario);
            
            // Redirigir de inmediato al tablero principal
            window.location.href = 'index.html';
            
        } else {
            alert('Por favor, ingresa tu usuario y una contraseña de mínimo 4 caracteres.');
        }
    }
});