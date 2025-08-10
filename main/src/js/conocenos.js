// Código de inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    initCarousel();
    // Inicializar gráfico
    initChart();
});

// Funciones de navegación
function openNav() {
    document.getElementById("sideNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
}

// Funciones del carrusel
function initCarousel() {
    const slides = document.querySelector('.carrusel-slides');
    const images = slides.querySelectorAll('img');
    
    let currentIndex = 0;
    let interval;

    // Inicializar imágenes
    images[0].classList.add('active');

    function moveToNextSlide() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        images[currentIndex].classList.add('active');
    }

    function startAutoPlay() {
        interval = setInterval(moveToNextSlide, 3000);
    }

    function stopAutoPlay() {
        clearInterval(interval);
    }

    startAutoPlay();
    slides.addEventListener('mouseenter', stopAutoPlay);
    slides.addEventListener('mouseleave', startAutoPlay);
}

// Funciones del gráfico
function initChart() {
    const ctx = document.getElementById('miGrafico').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Eventos', 'Miembros', 'Proyectos'],
            datasets: [{
                label: 'Cantidad',
                data: [10, 50, 5],
                backgroundColor: ['#333', '#333', '#333']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que se ajuste al tamaño del contenedor
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
