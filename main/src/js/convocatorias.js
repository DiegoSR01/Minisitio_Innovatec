// ==========================================================================
// Configuración y Variables Globales - Convocatorias
// ==========================================================================
const CONFIG = {
    parallax: {
        intensity: 0.5,
        throttleMs: 16
    },
    scroll: {
        backToTopThreshold: 300,
        headerScrollThreshold: 50
    },
    animations: {
        cardHoverDelay: 100,
        scrollAnimationThreshold: 0.1
    }
};

// Estado global
const state = {
    isScrolling: false,
    mobileMenuOpen: false,
    lastScrollTop: 0
};

// ==========================================================================
// Utilidades
// ==========================================================================

/**
 * Throttle function para optimizar performance
 */
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Animación suave para elementos
 */
function animateElement(element, className, duration = 300) {
    if (!element) return;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), duration);
}

// ==========================================================================
// Efectos de Scroll
// ==========================================================================

/**
 * Parallax mejorado con mejor performance
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg');
    
    if (!parallaxElements.length) return;
    
    const handleParallax = throttle(() => {
        if (state.isScrolling) return;
        
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * CONFIG.parallax.intensity;
            
            // Solo aplicar parallax si el elemento es visible
            const rect = element.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }, CONFIG.parallax.throttleMs);
    
    window.addEventListener('scroll', handleParallax, { passive: true });
}

/**
 * Header con efecto de scroll
 */
function initHeaderEffects() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const handleHeaderScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        
        if (scrolled > CONFIG.scroll.headerScrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Guardar posición actual del scroll
        state.lastScrollTop = scrolled;
    }, 16);
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
}

/**
 * Botón "Volver arriba" mejorado
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    const handleScrollVisibility = throttle(() => {
        const scrolled = window.pageYOffset;
        const shouldShow = scrolled > CONFIG.scroll.backToTopThreshold;
        
        if (shouldShow) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 16);
    
    // Event listeners
    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Animación del botón
        animateElement(backToTopBtn, 'clicked');
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================================================
// Navegación Móvil
// ==========================================================================

/**
 * Menú móvil hamburguesa
 */
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileBtn || !navList) return;
    
    // Toggle menú
    mobileBtn.addEventListener('click', () => {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        
        mobileBtn.classList.toggle('active');
        navList.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', state.mobileMenuOpen);
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.mobileMenuOpen) {
                mobileBtn.classList.remove('active');
                navList.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                state.mobileMenuOpen = false;
            }
        });
    });
    
    // Cerrar menú con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.mobileMenuOpen) {
            mobileBtn.click();
        }
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (state.mobileMenuOpen && 
            !mobileBtn.contains(e.target) && 
            !navList.contains(e.target)) {
            mobileBtn.click();
        }
    });
}

// ==========================================================================
// Efectos de Animación e Interacción
// ==========================================================================

/**
 * Animaciones al hacer scroll (Intersection Observer)
 */
function initScrollAnimations() {
    // Verificar soporte para Intersection Observer
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no soportado');
        return;
    }

    const observerOptions = {
        threshold: CONFIG.animations.scrollAnimationThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animateElements = document.querySelectorAll(
        '.convocatoria-card, .section-header'
    );
    
    animateElements.forEach(el => {
        if (el) observer.observe(el);
    });
}

/**
 * Efectos de hover mejorados para cards de convocatorias
 */
function initCardEffects() {
    const cards = document.querySelectorAll('.convocatoria-card');
    
    cards.forEach((card, index) => {
        // Agregar delay escalonado para animaciones
        card.style.animationDelay = `${index * CONFIG.animations.cardHoverDelay}ms`;
        
        // Efectos de hover personalizados
        card.addEventListener('mouseenter', () => {
            // Efecto de elevación y escala
            card.style.transform = 'translateY(-12px) scale(1.03)';
            card.style.zIndex = '10';
            
            // Efecto de sombra animada
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Restaurar estado original
            card.style.transform = '';
            card.style.zIndex = '';
            card.style.boxShadow = '';
        });
        
        // Efecto de click para mejor UX en móviles
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
        });
    });
}

/**
 * Animaciones para botones de llamada a la acción
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Efecto ripple al hacer click
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Prevenir doble click
        button.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    });
}

// ==========================================================================
// Smooth Scroll para navegación
// ==========================================================================

/**
 * Smooth scroll para enlaces internos
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            // Marcar que estamos scrolling para pausar parallax
            state.isScrolling = true;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Restaurar parallax después del scroll
            setTimeout(() => {
                state.isScrolling = false;
            }, 1000);
        });
    });
}

// ==========================================================================
// Manejo de errores y optimizaciones
// ==========================================================================

/**
 * Lazy loading para imágenes
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback: cargar todas las imágenes inmediatamente
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Manejo de errores globales
 */
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('Error capturado:', e.error);
        // Opcional: Enviar error a servicio de logging
    });
    
    // Fallback para navegadores que no soportan smooth scroll
    if (!('scrollBehavior' in document.documentElement.style)) {
        console.warn('Smooth scroll no soportado, usando scroll normal');
    }
    
    // Manejo de errores de carga de imágenes
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Error al cargar imagen:', this.src);
        });
    });
}

/**
 * Optimización de performance
 */
function initPerformanceOptimizations() {
    // Preload de recursos críticos
    const criticalImages = [
        '../assets/icons/ras_icon.jpg',
        '../assets/images/ras2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Optimización de fonts
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
}

// ==========================================================================
// Inicialización Principal
// ==========================================================================

/**
 * Inicializar todas las funcionalidades
 */
function init() {
    try {
        // Funcionalidades básicas
        initParallax();
        initHeaderEffects();
        initBackToTop();
        initMobileMenu();
        initSmoothScroll();
        
        // Efectos y animaciones
        initScrollAnimations();
        initCardEffects();
        initButtonEffects();
        
        // Optimizaciones
        initLazyLoading();
        initErrorHandling();
        initPerformanceOptimizations();
        
        console.log('🚀 RAS ITTOL Convocatorias - Sitio web inicializado correctamente');
        
        // Emitir evento personalizado
        document.dispatchEvent(new CustomEvent('rasConvocatoriasReady', {
            detail: { timestamp: Date.now() }
        }));
        
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

/**
 * Cleanup al salir de la página
 */
function cleanup() {
    // Restaurar overflow del body
    document.body.style.overflow = '';
    
    // Limpiar timeouts activos
    // (Los timeouts se limpian automáticamente al cambiar de página)
    
    console.log('Cleanup completado');
}

// ==========================================================================
// Funciones auxiliares
// ==========================================================================

/**
 * Detectar dispositivo móvil
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Obtener información del navegador
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
        isChrome: /Chrome/.test(ua),
        isFirefox: /Firefox/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
        isEdge: /Edge/.test(ua),
        isMobile: /Mobile|Android|iPhone|iPad/.test(ua)
    };
}

/**
 * Añadir estilos CSS dinámicamente si es necesario
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos para efecto ripple */
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Estilos para fonts cargadas */
        .fonts-loaded {
            font-display: swap;
        }
        
        /* Mejoras para dispositivos táctiles */
        @media (hover: none) and (pointer: coarse) {
            .convocatoria-card:hover {
                transform: none;
            }
            
            .convocatoria-card:active {
                transform: scale(0.98);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Funciones de accesibilidad
 */
function initAccessibility() {
    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-focus-visible', '');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-focus-visible');
        });
    });
    
    // Mejorar navegación del menú móvil con teclado
    const mobileMenu = document.querySelector('.nav-list');
    if (mobileMenu) {
        mobileMenu.addEventListener('keydown', (e) => {
            const focusableElements = mobileMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

/**
 * Funciones de analytics y tracking (placeholder)
 */
function initAnalytics() {
    // Tracking de interacciones con cards
    document.querySelectorAll('.convocatoria-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log(`Card clicked: ${index + 1}`);
            // Aquí se puede integrar con Google Analytics, etc.
        });
    });
    
    // Tracking de clicks en botones
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.trim();
            console.log(`Button clicked: ${buttonText}`);
        });
    });
}

// ==========================================================================
// Event Listeners Principales
// ==========================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    init();
    addDynamicStyles();
    initAccessibility();
    initAnalytics();
});

// Cleanup al salir
window.addEventListener('beforeunload', cleanup);

// Manejo de resize con debounce
window.addEventListener('resize', debounce(() => {
    // Reajustar elementos si es necesario
    state.mobileMenuOpen = false;
    const navList = document.querySelector('.nav-list');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (navList) navList.classList.remove('active');
    if (mobileBtn) {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
    }
    
    document.body.style.overflow = '';
    
    // Re-calcular elementos visibles para parallax
    const heroElements = document.querySelectorAll('.hero-bg');
    heroElements.forEach(element => {
        element.style.transform = '';
    });
    
}, 250));

// Manejo de cambio de visibilidad (pausar animaciones cuando no es visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar animaciones costosas cuando la pestaña no es visible
        state.isScrolling = true;
    } else {
        // Reanudar animaciones cuando la pestaña vuelve a ser visible
        setTimeout(() => {
            state.isScrolling = false;
        }, 100);
    }
});

// Manejo de orientación en dispositivos móviles
window.addEventListener('orientationchange', debounce(() => {
    // Forzar recalculo después de cambio de orientación
    setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY);
    }, 100);
}, 100));

// ==========================================================================
// Service Worker (opcional)
// ==========================================================================

/**
 * Registrar Service Worker para caching (opcional)
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registrado con éxito:', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed:', registrationError);
                });
        });
    }
}

// ==========================================================================
// Exportar funciones para uso externo
// ==========================================================================

// Exportar funciones para uso externo si es necesario
window.RAS_CONVOCATORIAS = {
    init,
    cleanup,
    state,
    CONFIG,
    utils: {
        throttle,
        debounce,
        animateElement,
        isMobile,
        getBrowserInfo
    }
};

// ==========================================================================
// Inicialización condicional basada en características del dispositivo
// ==========================================================================

// Detectar soporte para características modernas
const supportsIntersectionObserver = 'IntersectionObserver' in window;
const supportsCustomProperties = CSS.supports('color', 'var(--fake-var)');
const supportsGridLayout = CSS.supports('display', 'grid');

if (!supportsCustomProperties) {
    console.warn('CSS Custom Properties no soportadas');
    // Cargar polyfill o fallback
}

if (!supportsGridLayout) {
    console.warn('CSS Grid no soportado');
    // Aplicar fallback para flexbox
    document.body.classList.add('no-grid-support');
}

// Optimizaciones específicas para dispositivos de bajo rendimiento
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
if (isLowEndDevice) {
    CONFIG.parallax.throttleMs = 32; // Reducir frecuencia de parallax
    console.log('Dispositivo de bajo rendimiento detectado, aplicando optimizaciones');
}

// ==========================================================================
// Debugging y herramientas de desarrollo
// ==========================================================================

if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    // Herramientas de debug solo en desarrollo
    window.RAS_DEBUG = {
        logState: () => console.log('Estado actual:', state),
        logConfig: () => console.log('Configuración:', CONFIG),
        toggleAnimations: () => {
            document.body.classList.toggle('no-animations');
        },
        simulateMobile: () => {
            document.body.classList.toggle('simulate-mobile');
        }
    };
    
    console.log('🔧 Modo desarrollo activado. Usa window.RAS_DEBUG para herramientas de debug.');
}