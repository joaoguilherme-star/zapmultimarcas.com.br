document.addEventListener('DOMContentLoaded', function() {
    
     const heroSwiper = new Swiper('.hero-carousel', {
        loop: true, // Para o carrossel ser infinito
        autoplay: {
            delay: 3000, // Tempo em milissegundos entre os slides (3 segundos)
            disableOnInteraction: false, // Continua o autoplay mesmo se o usuário interagir
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Adicione mais opções conforme precisar
    });
    // ----------------------------------------------------
    // FIM: Inicialização do Swiper.js
    // ---------------------------------------------------- 

    // ----------------------------------------------------
    // INÍCIO: Variáveis e Lógica para Galeria de Imagens e Modal
    // ----------------------------------------------------

    // Seleciona todos os tipos de cards que terão galerias de imagens
    // Adicione mais classes aqui se tiver outras seções com galerias (ex: '.product-card')
    const carCards = document.querySelectorAll('.car-card');

    // Elementos do Modal (eles são globais pois um único modal serve para todas as galerias)
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const modalLeftArrow = document.getElementById('modalLeftArrow');
    const modalRightArrow = document.getElementById('modalRightArrow');

    // Variáveis globais para controlar as imagens no modal
    let currentImages = []; // Array das imagens do carro atualmente visível no modal
    let currentImageIndex = 0; // Índice da imagem atual no array 'currentImages'

    // Itera sobre cada card de carro para adicionar a funcionalidade da galeria
    carCards.forEach(card => {
        // Seleciona o wrapper da imagem e o elemento img dentro dele
        const imageWrapper = card.querySelector('.car-image-wrapper');
        let imgElement = imageWrapper.querySelector('img'); // Use 'let' aqui para poder reatribuir
        
        // Seletores para as setas DENTRO de CADA CARD
        const leftArrow = card.querySelector('.left-arrow');
        const rightArrow = card.querySelector('.right-arrow');
        
        // Pega o array de URLs de imagem do atributo data-images
        const images = JSON.parse(imgElement.dataset.images);

        let currentCardImageIndex = 0; // Índice da imagem atual para ESTE CARD específico
        let isAnimating = false; // Flag para evitar cliques múltiplos durante a animação

        // Função para atualizar a imagem no card com animação
        const updateCardImage = (newIndex, direction) => {
            if (isAnimating) return; // Se já estiver animando, ignora o clique
            isAnimating = true; // Define a flag como true para iniciar a animação

            const prevImg = imgElement; // A imagem que está saindo
            
            // Calcula o índice da próxima imagem (garantindo que ele "dobre" no array)
            const nextActualIndex = (newIndex % images.length + images.length) % images.length;
            const nextImgSrc = images[nextActualIndex];

            // Cria um novo elemento <img> para a próxima imagem
            const nextImg = document.createElement('img');
            nextImg.src = nextImgSrc;
            nextImg.alt = imgElement.alt; // Copia o alt text da imagem anterior
            nextImg.classList.add('transition-image'); // Adiciona uma classe temporária para a transição (se precisar de estilos específicos)

            // Posiciona a nova imagem fora da tela (esquerda ou direita)
            if (direction === 'left') {
                nextImg.style.transform = 'translateX(-100%)';
            } else if (direction === 'right') {
                nextImg.style.transform = 'translateX(100%)';
            }
            nextImg.style.opacity = '0'; // Começa invisível

            // Anexa a nova imagem ao wrapper
            imageWrapper.appendChild(nextImg);

            // Força um reflow para garantir que as propriedades de transição sejam aplicadas
            void nextImg.offsetWidth; 

            // Aplica as classes de animação
            if (direction === 'left') {
                prevImg.classList.add('slide-out-right'); // A imagem atual sai para a direita
                nextImg.classList.add('slide-in-left'); // A nova imagem entra pela esquerda
            } else if (direction === 'right') {
                prevImg.classList.add('slide-out-left'); // A imagem atual sai para a esquerda
                nextImg.classList.add('slide-in-right'); // A nova imagem entra pela direita
            }

            // Define um timeout para remover a imagem antiga e limpar as classes
            setTimeout(() => {
                prevImg.remove(); // Remove a imagem que saiu
                nextImg.classList.remove('slide-in-left', 'slide-in-right', 'transition-image'); // Remove classes de entrada
                nextImg.style.transform = ''; // Limpa a transformação
                nextImg.style.opacity = ''; // Limpa a opacidade
                
                imgElement = nextImg; // Atualiza a referência global 'imgElement' para a nova imagem
                currentCardImageIndex = nextActualIndex; // Atualiza o índice do card
                isAnimating = false; // Libera a animação para o próximo clique
            }, 300); // Tempo da transição CSS (ajuste se seu CSS for diferente)
        };

        // Event listener para clique na seta esquerda (card)
        leftArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique na seta abra o modal
            updateCardImage(currentCardImageIndex - 1, 'left');
        });

        // Event listener para clique na seta direita (card)
        rightArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique na seta abra o modal
            updateCardImage(currentCardImageIndex + 1, 'right');
        });

        // Event listener para clique na imagem para abrir o modal
        imgElement.addEventListener('click', () => {
            currentImages = images; // Define as imagens globais do modal para as imagens DESTE carro
            currentImageIndex = currentCardImageIndex; // Define o índice inicial do modal para a imagem atual do card
            modalImage.src = currentImages[currentImageIndex];
            imageModal.style.display = 'block'; // Mostra o modal
        });
    });

    // ----------------------------------------------------
    // Lógica para o Modal (fora do loop dos cards)
    // ----------------------------------------------------

    // Função para atualizar a imagem no modal
    const updateModalImage = () => {
        modalImage.src = currentImages[currentImageIndex];
    };

    // Event listener para clique na seta esquerda do modal
    modalLeftArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    });

    // Event listener para clique na seta direita do modal
    modalRightArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
    });

    // Event listener para o botão de fechar o modal
    closeButton.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    // Fecha o modal se clicar fora da imagem (no overlay)
    window.addEventListener('click', (event) => {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // Navegação por teclado para o modal (opcional)
    document.addEventListener('keydown', (event) => {
        if (imageModal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                modalLeftArrow.click();
            } else if (event.key === 'ArrowRight') {
                modalRightArrow.click();
            } else if (event.key === 'Escape') {
                closeButton.click();
            }
        }
    });

    // ----------------------------------------------------
    // FIM: Lógica para Galeria de Imagens e Modal
    // ----------------------------------------------------


    // --- 1. Menu Hambúrguer para Dispositivos Móveis ---
    const hamburger = document.getElementById('hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) { // Verificação para garantir que os elementos existam
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('is-active');

            // Alterna o ícone entre barras e 'X'
            const icon = hamburger.querySelector('i');
            if (icon) { // Verificação para garantir que o ícone exista
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- 2. Header Fixo (Sticky Header) ---
    const header = document.querySelector('.main-header');
    if (header) { // Verificação para garantir que o elemento exista
        const headerOffset = header.offsetTop;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > headerOffset) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // --- 3. Animação de "Fade-in" ao Rolar ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) { // Verificação para garantir que elementos existam
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
    }

    // --- 4. Validação Simples do Formulário ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) { // Verificação para garantir que o elemento exista
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
    }

    // --- 5. Efeito de "Scroll Suave" ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    if (scrollLinks.length > 0) { // Verificação para garantir que elementos existam
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
    }
});