document.addEventListener('DOMContentLoaded', function() {

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

});