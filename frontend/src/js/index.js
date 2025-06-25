document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Script started.');

    // Inicializa o Swiper para o Carrossel do Hero
    const heroSwiper = new Swiper('.hero-carousel', {
        loop: true, // Habilita loop infinito
        autoplay: {
            delay: 5000, // 5 segundos de atraso
            disableOnInteraction: false, // Continua o autoplay após a interação do usuário
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Torna os bullets da paginação clicáveis
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    console.log('Swiper carousel initialized.');

    // Alternador de navegação para celular
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    const mainHeaderContainer = document.querySelector('.main-header .container');
    if (mainHeaderContainer) {
        mainHeaderContainer.prepend(menuToggle);
        console.log('Menu toggle added to header.');
    } else {
        console.error('Main header container not found. Cannot add menu toggle.');
    }

    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            console.log('Mobile menu toggled. Active:', mainNav.classList.contains('active'));
        });
    } else {
        console.error('Main navigation not found. Mobile menu toggle might not work.');
    }

    // Funcionalidade do Modal de Imagem
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const modalLeftArrow = document.getElementById('modalLeftArrow');
    const modalRightArrow = document.getElementById('modalRightArrow');

    if (!imageModal || !modalImage || !closeButton || !modalLeftArrow || !modalRightArrow) {
        console.error('One or more modal elements not found. Modal functionality may be broken.');
    }

    let currentImageIndex = 0;
    let currentImages = [];

    // Função para abrir o modal
    function openModal(images, startIndex) {
        currentImages = images;
        currentImageIndex = startIndex;
        modalImage.src = currentImages[currentImageIndex];
        imageModal.style.display = 'flex'; // Usa flex para centralizar
        console.log('Modal opened with image:', modalImage.src);
    }

    // Função para navegar pelas imagens
    function navigateModal(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = currentImages.length - 1;
        } else if (currentImageIndex >= currentImages.length) {
            currentImageIndex = 0;
        }
        modalImage.src = currentImages[currentImageIndex];
        console.log('Navigated modal to image:', modalImage.src, 'Index:', currentImageIndex);
    }

    // Ouvintes de eventos para cards de carros com galerias de imagens
    document.querySelectorAll('.car-card .car-image-container').forEach(container => {
        const imgElement = container.querySelector('img');
        if (!imgElement) {
            console.warn('Car image element not found in container:', container);
            return;
        }

        let imagesData = [];
        try {
            if (imgElement.dataset.images) {
                imagesData = JSON.parse(imgElement.dataset.images);
                console.log('Images data parsed for card:', imagesData);
            } else {
                console.warn('data-images attribute not found for a car card image:', imgElement);
                // Fallback to single image if data-images is missing
                imagesData = [imgElement.src];
            }
        } catch (e) {
            console.error('Error parsing data-images for card:', imgElement, e);
            imagesData = [imgElement.src]; // Fallback to single image on error
        }

        const leftArrow = container.querySelector('.left-arrow');
        const rightArrow = container.querySelector('.right-arrow');

        let currentCardImageIndex = 0;

        // Exibe a imagem inicial
        if (imagesData.length > 0) {
            imgElement.src = imagesData[currentCardImageIndex];
        } else {
            console.warn('No image data available for card image:', imgElement);
        }

        // Clique na imagem para abrir o modal
        imgElement.addEventListener('click', () => {
            console.log('Image clicked, opening modal.');
            openModal(imagesData, currentCardImageIndex);
        });

        // Setas de navegação dentro do card
        if (leftArrow) {
            leftArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Previne que o modal abra
                currentCardImageIndex--;
                if (currentCardImageIndex < 0) {
                    currentCardImageIndex = imagesData.length - 1;
                }
                imgElement.src = imagesData[currentCardImageIndex];
                console.log('Navigated card image left. New index:', currentCardImageIndex);
            });
        } else {
            console.warn('Left arrow not found for car card:', container);
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Previne que o modal abra
                currentCardImageIndex++;
                if (currentCardImageIndex >= imagesData.length) {
                    currentCardImageIndex = 0;
                }
                imgElement.src = imagesData[currentCardImageIndex];
                console.log('Navigated card image right. New index:', currentCardImageIndex);
            });
        } else {
            console.warn('Right arrow not found for car card:', container);
        }
    });

    // Clique em imagens de cards de carros regulares (sem galeria) para abrir um modal simplificado
    document.querySelectorAll('.car-card:not(.car-image-container) > img').forEach(img => {
        img.addEventListener('click', () => {
            console.log('Simple car image clicked, opening modal.');
            // Para imagens simples, cria um array de uma única imagem para o modal
            openModal([img.src], 0);
            // Oculta as setas de navegação para uma única imagem no modal
            if (modalLeftArrow) modalLeftArrow.style.display = 'none';
            if (modalRightArrow) modalRightArrow.style.display = 'none';
        });
    });

    // Botão de fechar modal
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            imageModal.style.display = 'none';
            // Mostra as setas de navegação novamente se elas foram ocultadas
            if (modalLeftArrow) modalLeftArrow.style.display = 'flex';
            if (modalRightArrow) modalRightArrow.style.display = 'flex';
            console.log('Modal closed.');
        });
    }

    // Setas de navegação do modal
    if (modalLeftArrow) {
        modalLeftArrow.addEventListener('click', () => {
            navigateModal(-1);
        });
    }

    if (modalRightArrow) {
        modalRightArrow.addEventListener('click', () => {
            navigateModal(1);
        });
    }

    // Fecha o modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            imageModal.style.display = 'none';
            // Mostra as setas de navegação novamente se elas foram ocultadas
            if (modalLeftArrow) modalLeftArrow.style.display = 'flex';
            if (modalRightArrow) modalRightArrow.style.display = 'flex';
            console.log('Modal closed by clicking outside.');
        }
    });
});
