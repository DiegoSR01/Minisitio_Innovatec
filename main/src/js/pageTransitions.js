/**
 * SISTEMA DE TRANSICIONES SUAVES ENTRE PÁGINAS
 * Maneja las transiciones animadas al navegar entre diferentes páginas del sitio
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        transitionDuration: 400, // Duración en ms
        loadDelay: 100, // Delay antes de cargar la nueva página
        minLoadTime: 300 // Tiempo mínimo de visualización del loader
    };

    // Crear overlay de transición si no existe
    function createTransitionOverlay() {
        if (document.querySelector('.page-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = '<div class="transition-loader"></div>';
        document.body.appendChild(overlay);
    }

    // Mostrar overlay de transición
    function showTransition() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    // Ocultar overlay de transición
    function hideTransition() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Manejar la transición de salida
    function handlePageExit(url, event) {
        // Prevenir comportamiento por defecto
        if (event) {
            event.preventDefault();
        }

        // Agregar clase de salida al body
        document.body.classList.add('page-exit');
        
        // Mostrar overlay
        showTransition();

        // Navegar después de la animación
        setTimeout(() => {
            window.location.href = url;
        }, CONFIG.transitionDuration + CONFIG.loadDelay);
    }

    // Interceptar clics en enlaces de navegación
    function interceptNavigationLinks() {
        // Seleccionar todos los enlaces de navegación
        const navLinks = document.querySelectorAll('.nav-link, .footer-links a');

        navLinks.forEach(link => {
            // Solo interceptar enlaces internos
            const href = link.getAttribute('href');
            const onclick = link.getAttribute('onclick');
            
            // No interceptar si tiene onclick (como los modales) o javascript:void
            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('http') && 
                !href.startsWith('mailto:') && 
                !href.startsWith('tel:') &&
                !href.startsWith('javascript:') &&
                !onclick &&
                !link.hasAttribute('target')) {
                
                link.addEventListener('click', (e) => {
                    // Verificar si no es un enlace de anclaje
                    if (!href.includes('#') || href.indexOf('#') > 0) {
                        handlePageExit(href, e);
                    }
                });
            }
        });

        // También interceptar botones que navegan (pero no los de modales)
        const navButtons = document.querySelectorAll('.btn-primary[href]:not([onclick])');
        navButtons.forEach(button => {
            const href = button.getAttribute('href');
            
            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('http') &&
                !href.startsWith('javascript:')) {
                
                button.addEventListener('click', (e) => {
                    handlePageExit(href, e);
                });
            }
        });
    }

    // Manejar la entrada de página
    function handlePageEntry() {
        // Asegurar que el overlay esté oculto
        setTimeout(() => {
            hideTransition();
            document.body.classList.remove('page-exit');
        }, 100);
    }

    // Guardar estado de scroll antes de salir
    function saveScrollPosition() {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    }

    // Restaurar posición de scroll (opcional)
    function restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition && window.location.hash === '') {
            // Solo restaurar si no hay hash en la URL
            window.scrollTo(0, parseInt(savedPosition, 10));
            sessionStorage.removeItem('scrollPosition');
        }
    }

    // Manejar navegación con el botón atrás/adelante del navegador
    function handleBrowserNavigation() {
        window.addEventListener('pageshow', (event) => {
            // Si la página se carga desde caché (botón atrás)
            if (event.persisted) {
                hideTransition();
                document.body.classList.remove('page-exit');
            }
        });

        // Guardar posición antes de salir
        window.addEventListener('beforeunload', saveScrollPosition);
    }

    // Inicializar el sistema de transiciones
    function init() {
        // Crear overlay
        createTransitionOverlay();

        // Manejar entrada de página
        handlePageEntry();

        // Interceptar enlaces
        interceptNavigationLinks();

        // Manejar navegación del navegador
        handleBrowserNavigation();

        // Opcional: restaurar scroll
        // restoreScrollPosition();

        console.log('✅ Sistema de transiciones de página inicializado');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-inicializar interceptores si se agrega contenido dinámico
    window.reinitPageTransitions = interceptNavigationLinks;

})();
