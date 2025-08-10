function validarFormulario() {
    const palabrasProhibidas = [
        "wey", "pendejo", "pendeja", "cabron", "cabrona", "chingado", "chingada",
        "puta", "puto", "mierda", "culero", "culera", "estupido", "estupida", "imbecil",
        "carajo", "maldito", "maldita", "coño", "jodido", "jodida", "zorra", "perra"
    ]; 

    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

    for (let input of inputs) {
        let texto = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza acentos

        for (let palabra of palabrasProhibidas) {
            const regex = new RegExp(`\\b${palabra}\\b`, 'i'); // Asegura que solo filtre palabras exactas
            if (regex.test(texto)) {
                mostrarMensaje("Por favor, evita el uso de palabras altisonantes.");
                return false;
            }
        }
    }
    return true;
}

// Mensajes de error
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}
