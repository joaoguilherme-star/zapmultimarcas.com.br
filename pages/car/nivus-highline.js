// pages/car/[id].js
import React, { useEffect, useState } from 'react';
// Removido: import Head from 'next/head'; (next/head não é resolvido em ambientes de Immersive)
// Removido: import Link from 'next/link'; (substituído por <a> para compatibilidade em Immersive)
// Removido: import { useRouter } from 'next/router'; (substituído por lógica de window.location)

// Componente Header (para reutilização)
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
    }, []); // Array de dependências vazio para executar apenas uma vez na montagem

    return (
        <header className="main-header">
            <div className="container">
                {/* Substituído Link por <a> tag */}
                <a href="/" className="logo">
                    <img className="logo_img" src="https://res.cloudinary.com/duk5infgc/image/upload/v1750703156/LOGO_ZAP_MULTIMARCAS_pm321f.png" alt="ZAP Multimarcas Logo" />
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

// Componente Footer (para reutilização)
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


// Dados simulados dos carros (DEVE SER O MESMO DATA EM AMBAS AS PÁGINAS PARA CONSISTÊNCIA)
const carsData = [
    {
        id: 'up-move',
        name: 'UP! MOVE 1.0 TSI TOTAL FLEX 12V 5P QHX-4I28',
        mileage: '20k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$57.000,00',
        description: 'O Volkswagen Up! Move é um carro compacto com motor 1.0 TSI, oferecendo excelente desempenho e economia de combustível, ideal para o dia a dia na cidade.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750703170/IMG_0090_h8ksmk.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750703171/IMG-20250616-WA0290_kmqtxm.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750703151/IMG_0105_h1pzzz.jpg'
        ]
    },
    {
        id: 'jetta-trendline',
        name: 'JETTA TRENDLINE 1.4 TSI 16V 4P AUT. PGW-0454',
        mileage: '35k',
        transmission: 'Auto',
        fuel: 'Hybrid',
        price: 'R$90.000,00',
        description: 'O Jetta Trendline combina elegância e performance, com motor 1.4 TSI e transmissão automática, garantindo uma experiência de condução suave e eficiente.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793030/IMG_0305_bjuwov.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793030/IMG_0292_dwy4ud.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0290_hbzzux.jpg'
        ]
    },
    {
        id: 'nivus-highline',
        name: 'NIVUS HIGHLINE 1.0 200 TSI FLEX AUT. RLC-2E41',
        mileage: '15k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$30.500,00',
        description: 'O Nivus Highline é um SUV coupé moderno e tecnológico, perfeito para quem busca estilo e versatilidade no dia a dia urbano e em viagens.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793158/IMG_9823_jsd2te.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793175/IMG_9824_z8j1g1.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793170/IMG_9825_g0w1x2.jpg'
        ]
    },
    {
        id: 'l200-triton',
        name: 'L200 TRITON GLX 3.2 CD TB INT.DIESEL MEC PZO-6C91',
        mileage: '5k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$115.000,00',
        description: 'A L200 Triton GLX é uma picape robusta e potente, ideal para trabalho e aventura. Com motor diesel, oferece força e durabilidade em qualquer terreno.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793244/IMG_0374_urjkvm.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793244/IMG_0375_pizc4q.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793244/IMG_0376_j9q5o6.jpg'
        ]
    },
    {
        id: 'cb250-twister',
        name: 'CB 250 TWISTER/FLEXONE QHV-0I49',
        mileage: '5k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$17.500,00',
        description: 'A Honda CB 250 Twister é uma motocicleta ágil e econômica, perfeita para o uso urbano e pequenas viagens. Versátil e com design moderno.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0367_i14jyb.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0368_z2x2z2.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0369_y3y3y3.jpg'
        ]
    },
    {
        id: 'fusca-1300',
        name: 'FUSCA 1.300 IEY-1B30',
        mileage: '5k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$38.000,00',
        description: 'Um clássico atemporal, o Fusca 1.300 é um ícone da engenharia automotiva. Perfeito para colecionadores e entusiastas que buscam um pedaço da história.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9762_s3melj.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9763_a4s4a4.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9764_s5d5s5.jpg'
        ]
    },
    {
        id: 'cruze-ltz',
        name: 'CRUZE LTZ',
        mileage: '5k',
        transmission: 'Auto',
        fuel: 'Petrol',
        price: 'R$38.000,00',
        description: 'O Chevrolet Cruze LTZ oferece um design sofisticado e tecnologias avançadas, proporcionando conforto e segurança para toda a família.',
        images: [
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0290_hbzzux.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0291_q6w6q6.jpg',
            'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0292_z7x7z7.jpg'
        ]
    },
    {
        id: 'gol-1000',
        name: 'GOL 1000',
        mileage: '5k',
        transmission: 'Manual', // Assumindo manual para carros mais antigos
        fuel: 'Petrol',
        price: 'R$38.000,00',
        description: 'O Gol 1000 é um carro popular e confiável, ideal para o dia a dia. Com sua manutenção acessível e durabilidade, é uma excelente opção para quem busca praticidade.',
        images: [
            "https://res.cloudinary.com/duk5infgc/image/upload/v1750793434/IMG_0307_wdz5jr.jpg",
            "https://res.cloudinary.com/duk5infgc/image/upload/v1750793432/IMG_0306_ydkmv2.jpg",
            "https://res.cloudinary.com/duk5infgc/image/upload/v1750793430/IMG_0289_oq3vzv.jpg"
        ]
    }
];

export default function CarDetailsPage() {
    // A lógica do router foi removida e substituída por window.location.pathname
    // const router = useRouter();
    // const { id } = router.query;
    const [car, setCar] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    useEffect(() => {
        // Obtém o ID do carro do caminho da URL (ex: /car/up-move -> up-move)
        const pathSegments = window.location.pathname.split('/');
        // Filtra segmentos vazios e pega o último
        const carId = pathSegments.filter(segment => segment !== '').pop();

        if (carId) {
            const foundCar = carsData.find(c => c.id === carId);
            setCar(foundCar);
            setMainImageIndex(0); // Reinicia o índice da imagem principal ao carregar um novo carro
            setModalImageIndex(0); // Reinicia o índice da imagem do modal
        }
    }, []); // Não há necessidade de 'id' nas dependências, já que é lido diretamente do pathname

    // Função para navegar pelas imagens da galeria do carro
    const navigateGallery = (direction) => {
        if (!car || !car.images) return;
        setMainImageIndex(prevIndex => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) {
                newIndex = car.images.length - 1;
            } else if (newIndex >= car.images.length) {
                newIndex = 0;
            }
            return newIndex;
        });
    };

    // Função para abrir o modal
    const openModal = (initialIndex) => {
        if (!car || !car.images) return;
        setModalImageIndex(initialIndex);
        setIsModalOpen(true);
    };

    // Função para navegar pelas imagens dentro do modal
    const navigateModal = (direction) => {
        if (!car || !car.images) return;
        setModalImageIndex(prevIndex => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) {
                newIndex = car.images.length - 1;
            } else if (newIndex >= car.images.length) {
                newIndex = 0;
            }
            return newIndex;
        });
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (!car) {
        return (
            <>
                {/* Removido <Head>, veja _app.js para importações globais */}
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
                            <div className="car-image-container">
                                <div className="car-image-wrapper">
                                    <img
                                        id="main-car-image"
                                        src={car.images[mainImageIndex]}
                                        alt={car.name}
                                        onClick={() => openModal(mainImageIndex)} // Abre o modal ao clicar na imagem principal
                                    />
                                </div>
                                {car.images.length > 1 && ( // Só mostra as setas se houver mais de uma imagem
                                    <>
                                        <div className="arrow left-arrow" onClick={() => navigateGallery(-1)}><i className="fas fa-chevron-left"></i></div>
                                        <div className="arrow right-arrow" onClick={() => navigateGallery(1)}><i className="fas fa-chevron-right"></i></div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="car-detail-info">
                            <div className="car-specs">
                                <span><i className="fas fa-tachometer-alt"></i> <span id="car-mileage">{car.mileage}</span></span>
                                <span><i className="fas fa-cogs"></i> <span id="car-transmission">{car.transmission}</span></span>
                                <span><i className="fas fa-gas-pump"></i> <span id="car-fuel">{car.fuel}</span></span>
                            </div>
                            <div className="car-price" id="car-price">{car.price}</div>
                            <p id="car-description">
                                {car.description}
                            </p>
                            <button className="btn btn-contact">Solicitar Proposta</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para Imagem Ampliada */}
            {isModalOpen && (
                <div id="imageModal" className="modal" onClick={closeModal}>
                    <span className="close-button" onClick={closeModal}>&times;</span>
                    <img className="modal-content" id="modalImage" src={car.images[modalImageIndex]} alt={car.name} onClick={(e) => e.stopPropagation()} /> {/* impede clique de fechar o modal */}
                    {car.images.length > 1 && (
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