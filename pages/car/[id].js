// pages/car/[id].js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'; // Importar a instância db do Firebase
import { doc, getDoc } from 'firebase/firestore';   // Importar funções do Firestore

// Componente Header (para reutilização) - Mantido como estava
const Header = () => {
    useEffect(() => {
        // Lógica do menu mobile para o cabeçalho
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        const mainHeaderContainer = document.querySelector('.main-header .container');
        // Adiciona o botão de toggle apenas se ainda não existir
        if (mainHeaderContainer && !mainHeaderContainer.querySelector('.menu-toggle')) {
            mainHeaderContainer.prepend(menuToggle);
        }

        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            const handleMenuToggleClick = () => {
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
            };
            menuToggle.addEventListener('click', handleMenuToggleClick);

            // Função de limpeza para remover o event listener e o elemento menuToggle
            return () => {
                menuToggle.removeEventListener('click', handleMenuToggleClick);
                if (menuToggle.parentNode) {
                    menuToggle.parentNode.removeChild(menuToggle);
                }
            };
        }
    }, []); 

    return (
        <header className="main-header">
            <div className="container">
                <a href="/" className="logo">
                    <img className="logo_img" src="https://res.cloudinary.com/duk5infgc/image/upload/v1751050225/LOGO_ZAP_MULTIMARCAS_mep5ef.png" alt="ZAP Logo" />
                </a>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Sobre nós</a></li>
                        <li><a href="#">Compras</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </nav>
                <div className="header-actions">
                    <a href="#">Sign Up</a>
                    <button className="btn-contact">Get a Quote</button>
                </div>
            </div>
        </header>
    );
};

// Componente Footer (para reutilização) - Mantido como estava
const Footer = () => (
    <footer className="main-footer">
        <div className="footer-top">
            <div className="container">
                <h2>O que é a ZAP Multimarcas ?</h2>
                <div className="ratings-grid">
                    <div className="rating-box">
                        <p>REVIEWS ON</p>
                        <h4>Carfax</h4>
                        <div className="stars">★★★★★ 4.9/5.0</div>
                    </div>
                    <div className="rating-box">
                        <p>REVIEWS ON</p>
                        <h4>Google</h4>
                        <div className="stars">★★★★★ 4.9/5.0</div>
                    </div>
                    <div className="rating-box">
                        <p>REVIEWS ON</p>
                        <h4>Pundsay</h4>
                        <div className="stars">★★★★★ 4.9/5.0</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 ZAP Multimarcas. Todos os direitos reservados.</p>
        </div>
    </footer>
);

// Removido o array carsData estático que estava aqui.

export async function getServerSideProps(context) {
    let id = null;
    if (context && context.params) {
        id = context.params.id;
    }

    if (!id) {
        // Este caso não deve ser alcançado se o Next.js estiver funcionando como esperado
        // para uma rota dinâmica como /car/[id]
        return {
            props: {
                car: null,
                error: "ID do carro não encontrado nos parâmetros da rota.",
            },
        };
    }

    let carData = null;
    let error = null;

    try {
        const carDocRef = doc(db, 'cars', id); // Referência ao documento do carro no Firestore
        const carDocSnap = await getDoc(carDocRef);

        if (carDocSnap.exists()) {
            // Combina o ID do documento com os dados do documento
            carData = { id: carDocSnap.id, ...carDocSnap.data() };
        } else {
            // Carro não encontrado
            error = 'Carro não encontrado.';
        }
    } catch (e) {
        console.error("Erro ao buscar dados do carro no Firebase:", e);
        error = 'Erro ao carregar dados do carro.';
    }

    return {
        props: {
            car: carData, // Passa os dados do carro (ou null) como prop
            error: error, // Passa a mensagem de erro (ou null)
        },
    };
}


export default function CarDetailsPage({ car: initialCarData, error }) { // Recebe 'car' e 'error' como props
    // O estado 'car' agora é inicializado com os dados de getServerSideProps
    const [car, setCar] = useState(initialCarData);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    useEffect(() => {
        setCar(initialCarData);
        setMainImageIndex(0); // Reset index when car data changes
        setModalImageIndex(0); // Reset modal index too
        setIsModalOpen(false); // Ensure modal is closed if car data changes
    }, [initialCarData]);

    const currentImages = car && car.images && Array.isArray(car.images) ? car.images : [];

    // Função para navegar pelas imagens da galeria do carro
    const navigateGallery = (direction) => {
        if (currentImages.length === 0) return;
        setMainImageIndex(prevIndex => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) {
                newIndex = currentImages.length - 1;
            } else if (newIndex >= currentImages.length) {
                newIndex = 0;
            }
            return newIndex;
        });
    };

    // Função para abrir o modal
    const openModal = (initialIndex) => {
        if (currentImages.length === 0) return;
        setModalImageIndex(initialIndex);
        setIsModalOpen(true);
    };

    // Função para navegar pelas imagens dentro do modal
    const navigateModal = (direction) => {
        if (currentImages.length === 0) return;
        setModalImageIndex(prevIndex => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) {
                newIndex = currentImages.length - 1;
            } else if (newIndex >= currentImages.length) {
                newIndex = 0;
            }
            return newIndex;
        });
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (error) { // Prioritize showing the error message from getServerSideProps
        return (
            <>
                <Header />
                <main className="car-detail-main">
                    <div className="container">
                        <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> Voltar para Carros</a>
                        <h1>Erro ao Carregar</h1>
                        <p style={{textAlign: 'center'}}>{error}</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!car) { // This will now primarily catch cases where getServerSideProps might somehow return no error but also no car
        return (
            <>
                <Header />
                <main className="car-detail-main">
                    <div className="container">
                        {/* Substituído Link por <a> tag */}
                        <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> Voltar para Carros</a>
                        <h1>Carro não encontrado.</h1>
                        <p style={{textAlign: 'center'}}>Desculpa, não conseguimos encontrar os detalhes para este carro.</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* Removido <Head>, veja _app.js para importações globais */}
            {/* O favicon e o título são definidos no _app.js para um projeto Next.js real. */}

            <Header />

            <main className="car-detail-main">
                <div className="container">
                    {/* Substituído Link por <a> tag */}
                    <a href="/" className="back-link"><i className="fas fa-arrow-left"></i> Voltar para Carros</a>
                    <h1>{car.name}</h1>

                    <div className="car-detail-content">
                        <div className="car-detail-image-gallery">
                            {currentImages.length > 0 ? (
                                <div className="car-image-container">
                                    <div className="car-image-wrapper">
                                        <img
                                            id="main-car-image"
                                            src={currentImages[mainImageIndex]}
                                            alt={car.name}
                                            onClick={() => openModal(mainImageIndex)}
                                        />
                                    </div>
                                    {currentImages.length > 1 && (
                                        <>
                                            <div className="arrow left-arrow" onClick={() => navigateGallery(-1)}><i className="fas fa-chevron-left"></i></div>
                                            <div className="arrow right-arrow" onClick={() => navigateGallery(1)}><i className="fas fa-chevron-right"></i></div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="car-image-placeholder">Sem imagens disponíveis</div>
                            )}
                        </div>

                        <div className="car-detail-info">
                            <div className="car-specs">
                                <span><i className="fas fa-tachometer-alt"></i> {car.mileage || 'N/A'}</span>
                                <span><i className="fas fa-cogs"></i> {car.transmission || 'N/A'}</span>
                                <span><i className="fas fa-gas-pump"></i> {car.fuel || 'N/A'}</span>
                            </div>
                            <div className="car-price">{car.price || 'Preço sob consulta'}</div>
                            <p id="car-description">
                                {car.description || 'Descrição não disponível.'}
                            </p>
                            <button className="btn btn-contact">Solicitar Proposta</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para Imagem Ampliada */}
            {isModalOpen && currentImages.length > 0 && (
                <div id="imageModal" className="modal" style={{ display: 'flex' }} onClick={closeModal}>
                    <span className="close-button" onClick={closeModal}>&times;</span>
                    <img 
                        className="modal-content" 
                        id="modalImage" 
                        src={currentImages[modalImageIndex]} 
                        alt={car.name} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                    {currentImages.length > 1 && (
                        <>
                            <div className="modal-arrow left-arrow" id="modalLeftArrow" onClick={(e) => { e.stopPropagation(); navigateModal(-1); }}><i className="fas fa-chevron-left"></i></div>
                            <div className="modal-arrow right-arrow" id="modalRightArrow" onClick={(e) => { e.stopPropagation(); navigateModal(1); }}><i className="fas fa-chevron-right"></i></div>
                        </>
                    )}
                </div>
            )}

            <Footer />
        </>
    );
}