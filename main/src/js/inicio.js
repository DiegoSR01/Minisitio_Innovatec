// ==========================================================================
// Configuración y Variables Globales
// ==========================================================================

const CONFIG = {
    carousel: {
        autoSlideInterval: 4000,
        transitionDuration: 500,
        pauseOnHover: true
    },
    parallax: {
        intensity: 0.5,
        throttleMs: 16
    },
    scroll: {
        backToTopThreshold: 300,
        headerScrollThreshold: 50
    }
};

// Estado global
const state = {
    isScrolling: false,
    carouselIntervals: new Map(),
    mobileMenuOpen: false
};

// ==========================================================================
// Utilidades
// ==========================================================================

/**
 * Función throttle para optimizar rendimiento
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
 * Función debounce
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
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), duration);
}

// ==========================================================================
// Efectos de Scroll
// ==========================================================================

/**
 * Parallax mejorado con mejor rendimiento
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg');
    
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
 * Encabezado con efecto de scroll
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
 * Menú móvil tipo hamburguesa
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

/**
 * Manejo de navegación activa
 */
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';
    
    // Mapeo de páginas a enlaces
    const pageMap = {
        'inicio.html': 'inicio.html',
        'programa.html': 'programa.html',
        'estancia.html': 'estancia.html',
        'conocenos.html': 'conocenos.html',
        'noticias.html': 'noticias.html'
    };
    
    // Remover todas las clases active
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Agregar clase active al enlace correspondiente
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'inicio.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Manejar clicks en navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remover active de todos los enlaces
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            
            // Agregar active al enlace clickeado
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });
    });
}

// ==========================================================================
// Sistema de Carrusel Avanzado
// ==========================================================================

class EnhancedCarousel {
    constructor(carouselElement, options = {}) {
        this.carousel = carouselElement;
        this.options = {
            autoSlide: true,
            interval: options.interval || CONFIG.carousel.autoSlideInterval,
            pauseOnHover: CONFIG.carousel.pauseOnHover,
            showControls: true,
            showIndicators: true,
            random: options.random || false,
            ...options
        };
        
        this.currentSlide = 0;
        this.slides = [];
        this.intervalId = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupSlides();
        this.setupControls();
        this.setupIndicators();
        this.setupEventListeners();
        this.startAutoSlide();
        
        // Mostrar el primer slide
        this.showSlide(0);
    }
    
    setupSlides() {
        const track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(track.querySelectorAll('.carousel-slide'));
        
        // Asegurar que solo el primer slide esté activo inicialmente
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === 0);
        });
    }
    
    setupControls() {
        if (!this.options.showControls) return;
        
        const prevBtn = this.carousel.querySelector('.carousel-btn-prev');
        const nextBtn = this.carousel.querySelector('.carousel-btn-next');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }
    
    setupIndicators() {
        if (!this.options.showIndicators) return;
        
        const indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        // Limpiar indicadores existentes
        indicatorsContainer.innerHTML = '';
        
        // Crear indicadores dinámicamente
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', index);
            indicator.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
            
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    setupEventListeners() {
        if (this.options.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoSlide());
            this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        // Soporte para gestos táctiles básicos
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo 50px para considerar swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
    
    showSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        const previousSlide = this.currentSlide;
        
        // Actualizar slides
        this.slides[previousSlide].classList.remove('active');
        this.slides[index].classList.add('active');
        
        // Actualizar indicadores
        const indicators = this.carousel.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
        
        // Reset transitioning flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.carousel.transitionDuration);
        
        // Emitir evento personalizado
        this.carousel.dispatchEvent(new CustomEvent('slideChange', {
            detail: { currentSlide: index, previousSlide }
        }));
    }
    
    nextSlide() {
        if (this.options.random) {
            this.randomSlide();
        } else {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 
            ? this.slides.length - 1 
            : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    randomSlide() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.slides.length);
        } while (randomIndex === this.currentSlide && this.slides.length > 1);
        
        this.showSlide(randomIndex);
    }
    
    startAutoSlide() {
        if (!this.options.autoSlide) return;
        
        this.pauseAutoSlide(); // Limpiar intervalo anterior
        
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.options.interval);
    }
    
    pauseAutoSlide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    destroy() {
        this.pauseAutoSlide();
        // Remover event listeners si es necesario
    }
}

/**
 * Inicializar todos los carruseles
 */
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const carouselType = carousel.getAttribute('data-carousel');
        const options = {};
        
        // Configuraciones específicas por tipo
        switch (carouselType) {
            case 'projects':
                options.random = true;
                options.interval = 3500;
                break;
            case 'tournaments':
                options.random = false;
                options.interval = 4000;
                break;
        }
        
        const carouselInstance = new EnhancedCarousel(carousel, options);
        state.carouselIntervals.set(carousel, carouselInstance);
    });
}

// ==========================================================================
// Efectos de Animación e Interacción
// ==========================================================================

/**
 * Animaciones al hacer scroll (Intersection Observer)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
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
        '.feature-card, .carousel-container, .about-image, .section-header'
    );
    
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Efectos de hover mejorados para tarjetas
 */
function initCardEffects() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ==========================================================================
// Scroll Suave para navegación
// ==========================================================================

/**
 * Scroll suave para enlaces internos
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ==========================================================================
// Manejo de errores y alternativas
// ==========================================================================

/**
 * Carga diferida para imágenes
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
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
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Manejo de errores globales
 */
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('Error capturado:', e.error);
    });
    
    // Fallback para navegadores que no soportan smooth scroll
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Implementar polyfill o método alternativo si es necesario
        console.warn('Smooth scroll no soportado, usando scroll normal');
    }
}

// ==========================================================================
// Inicialización Principal
// ==========================================================================

/**
 * Inicializar todas las funcionalidades
 */
function init() {
    // Funcionalidades básicas
    initParallax();
    initHeaderEffects();
    initBackToTop();
    initMobileMenu();
    initActiveNavigation();
    initSmoothScroll();
    
    // Carruseles
    initCarousels();
    
    // Efectos y animaciones
    initScrollAnimations();
    initCardEffects();
    
    // Optimizaciones
    initLazyLoading();
    initErrorHandling();
    
    console.log('🚀 InnovaTECNM 2025 - Sitio web inicializado correctamente');
}

/**
 * Limpieza al salir de la página
 */
function cleanup() {
    // Limpiar intervalos de carrusel
    state.carouselIntervals.forEach(carousel => {
        carousel.destroy();
    });
    
    // Restaurar overflow del body
    document.body.style.overflow = '';
}

// ==========================================================================
// Event Listeners Principales
// ==========================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Limpieza al salir
window.addEventListener('beforeunload', cleanup);

// Manejo de redimensionamiento
window.addEventListener('resize', debounce(() => {
    // Reajustar elementos si es necesario
    state.mobileMenuOpen = false;
    document.querySelector('.nav-list')?.classList.remove('active');
    document.querySelector('.mobile-menu-btn')?.classList.remove('active');
    document.body.style.overflow = '';
}, 250));

// Manejo de cambio de visibilidad (pausar animaciones cuando no es visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        state.carouselIntervals.forEach(carousel => {
            carousel.pauseAutoSlide();
        });
    } else {
        state.carouselIntervals.forEach(carousel => {
            carousel.startAutoSlide();
        });
    }
});

// Exportar funciones para uso externo si es necesario
window.RAS_ITTOL = {
    init,
    cleanup,
    state,
    CONFIG
};