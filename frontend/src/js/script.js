document.addEventListener('DOMContentLoaded', function() {

    

 // 1. Pega o elemento do carrossel
    const carouselContainer = document.querySelector('.hero-carousel-container');

    // 2. Variáveis de controle para saber o estado do arraste
    let isDown = false; // Flag para saber se o mouse está pressionado
    let startX;         // Posição X inicial do clique
    let scrollLeft;     // Posição de scroll inicial do container

    // 3. Adiciona os eventos do mouse ao container
    if (carouselContainer) { // Garante que o container existe na página
        
        carouselContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            carouselContainer.classList.add('grabbing'); // Adiciona classe para feedback visual
            startX = e.pageX - carouselContainer.offsetLeft;
            scrollLeft = carouselContainer.scrollLeft;
            });
            } // <-- Fecha o if (carouselContainer)
        }); // <-- Fecha o DOMContentLoaded

        carouselContainer.addEventListener('mouseleave', () => {
            isDown = false;
            carouselContainer.classList.remove('grabbing');
        });

        carouselContainer.addEventListener('mouseup', () => {
            isDown = false;
            carouselContainer.classList.remove('grabbing');
        });

        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return; // Se o mouse não estiver pressionado, não faz nada
            e.preventDefault(); // Previne comportamentos padrão (como selecionar texto)
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 2; // O '* 2' aumenta a sensibilidade do arraste. Ajuste se quiser.
            carouselContainer.scrollLeft = scrollLeft - walk;
        });

    // --- 1. Menu Hambúrguer para Dispositivos Móveis ---
    const hamburger = document.getElementById('hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('is-active');

        // Alterna o ícone entre barras e 'X'
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- 2. Header Fixo (Sticky Header) ---
    const header = document.querySelector('.main-header');
    const headerOffset = header.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > headerOffset) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });


    // --- 3. Animação de "Fade-in" ao Rolar ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // A animação começa quando 10% do elemento está visível
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- 4. Validação Simples do Formulário ---
    const searchForm = document.getElementById('search-form');
    
    searchForm.addEventListener('submit', function(event) {
        // Pega os valores selecionados
        const make = searchForm.querySelector('select[name="make"]').value;
        const model = searchForm.querySelector('select[name="model"]').value;
        const year = searchForm.querySelector('select[name="year"]').value;

        // Verifica se todos os campos estão vazios
        if (make === "" && model === "" && year === "") {
            event.preventDefault(); // Impede o envio do formulário
            alert('Por favor, selecione pelo menos uma opção para pesquisar.');
        }
    });
    // --- 5. Efeito de "Scroll Suave" ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o comportamento padrão do link
            const targetId = this.getAttribute('href').substring(1); // Remove o '#'
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Animação suave
                });
            }
        });
    });