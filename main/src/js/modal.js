function openModal(src, type, event) {
    try {
        // Prevenir cualquier acción por defecto si hay un evento
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const modal = document.getElementById('fileModal');
        
        if (!modal) {
            console.error('❌ Modal element not found');
            return false;
        }

        const modalBody = modal.querySelector('.modal-body');
        
        if (!modalBody) {
            console.error('❌ Modal body not found');
            return false;
        }

        // Guardar la posición actual del scroll ANTES de hacer cualquier cambio
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
        
        console.log('📍 Guardando posición de scroll:', scrollPosition);
        
        // Guardar en el modal para recuperar después
        modal.setAttribute('data-scroll-position', scrollPosition.toString());

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
            default:
                console.error('❌ Invalid modal type:', type);
                return false;
        }

        modalBody.innerHTML = content;
        
        // Agregar la clase active
        modal.classList.add('active');
        
        // Mantener la posición del scroll y prevenir el scroll del body
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        // Ajustar el tamaño del modal
        requestAnimationFrame(() => {
            adjustModalSize();
        });

        // Event listeners
        window.addEventListener('resize', adjustModalSize);
        document.addEventListener('keydown', closeOnEscape);
        
        console.log('✅ Modal abierto correctamente en posición:', scrollPosition);
        return false;
    } catch (error) {
        console.error('❌ Error opening modal:', error);
        return false;
    }
}

function closeModal() {
    try {
        const modal = document.getElementById('fileModal');
        
        if (!modal) {
            console.error('Modal element not found');
            return;
        }

        // Recuperar la posición guardada
        const savedScrollPosition = parseInt(modal.getAttribute('data-scroll-position')) || 0;
        
        // Remover clase active
        modal.classList.remove('active');
        
        // Restaurar estilos del body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restaurar la posición del scroll exactamente donde estaba
        window.scrollTo(0, savedScrollPosition);
        
        // Limpiar el atributo
        modal.removeAttribute('data-scroll-position');
        
        // Remove event listeners
        window.removeEventListener('resize', adjustModalSize);
        document.removeEventListener('keydown', closeOnEscape);
        
        console.log('Modal cerrado, restaurado a posición:', savedScrollPosition);
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function adjustModalSize() {
    try {
        const modal = document.getElementById('fileModal');
        
        if (!modal) return;

        const modalContent = modal.querySelector('.modal-content');
        const modalBody = modal.querySelector('.modal-body');
        
        if (!modalContent || !modalBody) return;

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
    } catch (error) {
        console.error('Error adjusting modal size:', error);
    }
}

function closeOnEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Función para inicializar los event listeners del modal
function initializeModalListeners() {
    const modal = document.getElementById('fileModal');
    
    if (!modal) {
        console.warn('Modal element not found in this page');
        return;
    }

    // Evitar agregar listeners múltiples
    if (modal.hasAttribute('data-initialized')) {
        return;
    }
    modal.setAttribute('data-initialized', 'true');

    // Cierra el modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Cierra el modal con el botón de cerrar (puede tener clase modal-close o close-modal)
    const closeBtn = modal.querySelector('.modal-close, .close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }
    
    console.log('Modal listeners initialized');
}

// Inicializar event listeners cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModalListeners);
} else {
    // DOM ya está listo, inicializar inmediatamente
    initializeModalListeners();
}
