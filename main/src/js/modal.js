function openModal(src, type) {
    const modal = document.getElementById('fileModal');
    const modalBody = modal.querySelector('.modal-body');
    const scrollPosition = window.scrollY;

    // Limpia el contenido anterior
    modalBody.innerHTML = '';
    modalBody.setAttribute('data-type', type);

    // Crea el contenido según el tipo
    let content;
    switch(type) {
        case 'pdf':
            content = `<embed src="${src}" type="application/pdf" width="100%" height="100%">`;
            break;
        case 'image':
            content = `<img src="${src}" alt="Modal Image" style="max-height: calc(100vh - 120px);">`;
            break;
        case 'video':
            content = `<video controls style="max-height: calc(100vh - 120px);"><source src="${src}" type="video/mp4"></video>`;
            break;
    }

    modalBody.innerHTML = content;
    modal.classList.add('active');
    
    // Mantiene la posición del scroll y previene el scroll del body
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Ajusta el tamaño del modal según el viewport
    adjustModalSize();

    // Event listeners
    window.addEventListener('resize', adjustModalSize);
    document.addEventListener('keydown', closeOnEscape);
}

function closeModal() {
    const modal = document.getElementById('fileModal');
    const scrollPosition = parseInt(document.body.style.top);
    
    modal.classList.remove('active');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    window.scrollTo(0, Math.abs(scrollPosition));
    
    // Remove event listeners
    window.removeEventListener('resize', adjustModalSize);
    document.removeEventListener('keydown', closeOnEscape);
}

function adjustModalSize() {
    const modal = document.getElementById('fileModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Ajusta el tamaño según si está en móvil o desktop
    if (windowWidth <= 768) {
        modalContent.style.width = '100vw';
        modalContent.style.height = '100vh';
        modalContent.style.margin = '0';
        modalContent.style.borderRadius = '0';
    } else {
        modalContent.style.width = 'calc(100vw - 40px)';
        modalContent.style.height = 'calc(100vh - 40px)';
        modalContent.style.margin = '20px';
        modalContent.style.borderRadius = '20px';
    }

    // Ajusta el contenido según el tipo
    const contentType = modalBody.getAttribute('data-type');
    const content = modalBody.children[0];
    
    if (content) {
        if (contentType === 'pdf') {
            content.style.height = `${modalBody.offsetHeight}px`;
        } else {
            content.style.maxHeight = `${windowHeight - 120}px`;
        }
    }
}

// Cierra el modal al hacer clic fuera del contenido
document.getElementById('fileModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.marginTop = `${window.scrollY}px`;
    }
);
