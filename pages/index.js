// pages/index.js
import React, { useEffect } from 'react';
// Removido: import Head from 'next/head'; (next/head não é resolvido em ambientes de Immersive)
// Removido: import Link from 'next/link'; (substituído por <a> para compatibilidade em Immersive)

// Componente Header (para reutilização)
// O menu toggle é manipulado com JavaScript DOM normal.
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
            // quando o componente é desmontado. Importante para React.
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
                    <img className="logo_img" src="https://res.cloudinary.com/duk5infgc/image/upload/v1751050225/LOGO_ZAP_MULTIMARCAS_mep5ef.png" alt="ZAP Logo" />
                </a>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Sobre nós</a></li>
                        <li><a href="#">Nossos Carros</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </nav>
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

// Dados simulados dos carros (para a lista na página inicial)
// Adicionando múltiplas imagens para cada carro
const carsData = [
    { id: 'up-move', name: 'UP! MOVE 1.0 TSI TOTAL FLEX 12V 5P QHX-4I28', mileage: '20k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 57.000,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1750703170/IMG_0090_h8ksmk.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750703171/IMG-20250616-WA0290_kmqtxm.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750703151/IMG_0105_h1pzzz.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750703170/IMG_0090_h8ksmk.jpg' },
    { id: 'jetta-trendline', name: 'JETTA TRENDLINE 1.4 TSI 16V 4P AUT. PGW-0454', mileage: '35k', transmission: 'Auto', fuel: 'Hybrid', price: 'R$ 90.000,00', images:['https://res.cloudinary.com/duk5infgc/image/upload/v1750793025/IMG_0288_famih1.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793030/IMG_0292_dwy4ud.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793027/IMG_0294_nkvqqk.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793030/IMG_0350_md6qbp.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793035/IMG_0360_kh8ztl.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793036/IMG_0351_qkoezy.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793030/IMG_0305_bjuwov.jpg' },
    { id: 'nivus-highline', name: 'NIVUS HIGHLINE 1.0 200 TSI FLEX AUT. RLC-2E41', mileage: '15k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 30.500,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1750793154/IMG_9810_gbcrsm.jpg','https://res.cloudinary.com/duk5infgc/image/upload/v1750793162/IMG_9878_popjjt.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793164/IMG_9888_yvdwxj.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793160/IMG_9833_ykmxzw.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793161/IMG_9840_nkdtgy.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793158/IMG_9823_jsd2te.jpg' },
    { id: 'l200-triton', name: 'L200 TRITON GLX 3.2 CD TB INT.DIESEL MEC PZO-6C91', mileage: '5k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 115.000,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1751035422/IMG_0401_wcyshm.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1751035432/IMG_0402_bucsls.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1751035437/IMG_0400_tnjgwk.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1751035444/IMG_0397_ora5kt.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1751035444/IMG_0398_poylrq.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1751035444/IMG_0398_poylrq.jpg' },
    { id: 'cb250-twister', name: 'CB 250 TWISTER/FLEXONE QHV-0I49', mileage: '5k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 17.500,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0367_i14jyb.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0368_z2x2z2.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0369_y3y3y3.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750782941/IMG_0367_i14jyb.jpg' },
    { id: 'fusca-1300', name: 'FUSCA 1.300 IEY-1B30', mileage: '5k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 38.000,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9762_s3melj.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9763_a4s4a4.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9764_s5d5s5.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793366/IMG_9762_s3melj.jpg' },
    { id: 'cruze-ltz', name: 'CRUZE LTZ', mileage: '5k', transmission: 'Auto', fuel: 'Petrol', price: 'R$ 38.000,00', images: ['https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0290_hbzzux.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0291_q6w6q6.jpg', 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0292_z7x7z7.jpg'], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793273/IMG_0290_hbzzux.jpg' },
    { id: 'gol-1000', name: 'GOL 1000', mileage: '5k', transmission: 'Manual', fuel: 'Petrol', price: 'R$ 38.000,00', images: ["https://res.cloudinary.com/duk5infgc/image/upload/v1750793434/IMG_0307_wdz5jr.jpg", "https://res.cloudinary.com/duk5infgc/image/upload/v1750793432/IMG_0306_ydkmv2.jpg", "https://res.cloudinary.com/duk5infgc/image/upload/v1750793430/IMG_0289_oq3vzv.jpg"], imageUrl: 'https://res.cloudinary.com/duk5infgc/image/upload/v1750793434/IMG_0307_wdz5jr.jpg' },
];

export default function HomePage() {
    // Estado para controlar o índice da imagem atual para cada carro
    const [currentImageIndexes, setCurrentImageIndexes] = React.useState({});

    useEffect(() => {
        // Inicializa os índices de imagem para cada carro em 0
        const initialIndexes = {};
        carsData.forEach(car => {
            initialIndexes[car.id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);


        // Adiciona a folha de estilo do Swiper dinamicamente se não estiver já presente
        const swiperCssLink = document.createElement('link');
        swiperCssLink.rel = 'stylesheet';
        swiperCssLink.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        // Verifica se o link já existe para evitar duplicação
        if (!document.head.querySelector(`link[href="${swiperCssLink.href}"]`)) {
            document.head.appendChild(swiperCssLink);
        }

        // Inicializa o Swiper após o CSS ser adicionado e o DOM estar pronto.
        // Acesso direto ao objeto global Swiper (disponível através do script no HTML principal)
        const initializeSwiper = () => {
            // Verifica se Swiper está disponível no objeto window
            if (typeof window !== 'undefined' && window.Swiper) {
                new window.Swiper('.hero-carousel', {
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            } else {
                console.error("Swiper não está disponível no objeto window. Verifique se o script do Swiper foi carregado.");
            }
        };

        // Pequeno atraso para garantir que o script do Swiper tenha carregado completamente
        // antes de tentar inicializá-lo. Em um Next.js real, você usaria `next/script`
        // com a estratégia `afterInteractive`.
        const swiperLoadCheck = setInterval(() => {
            if (typeof window !== 'undefined' && window.Swiper) {
                initializeSwiper();
                clearInterval(swiperLoadCheck);
            }
        }, 100); // Tenta a cada 100ms

        // Limpeza: remove o CSS do Swiper e o intervalo quando o componente é desmontado
        return () => {
            clearInterval(swiperLoadCheck);
            if (document.head.querySelector(`link[href="${swiperCssLink.href}"]`)) {
                document.head.removeChild(swiperCssLink);
            }
        };
    }, []); // Array de dependências vazio para executar apenas uma vez na montagem

    return (
        <>
            {/* O favicon e o título são definidos no _app.js para um projeto Next.js real ou no HTML pai para este ambiente Immersive */}

            <Header />

            <main>
                <section className="hero">
                    <div className="container">
                        <h1 className="texto" style={{ color: 'white' }}>Bem-vindo à ZAP Multimarcas em Curitibanos</h1>
                        <div className="hero-carousel swiper">
                            <div className="swiper-wrapper">
                               
                            </div>
                        </div>
                        
                    </div>
                </section>

                <section className="browse-type">
                    <div className="container">
                        <h2>Encontre Pelo Tipo</h2>
                        <div className="type-grid">
                            <div className="type-item"><span></span> Sedan</div>
                            <div className="type-item"><span></span> Coupe</div>
                            <div className="type-item"><span></span> SUV</div>
                            <div className="type-item"><span></span> Hatchback</div>
                            <div className="type-item"><span></span> Sport</div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="container cta-container">
                        <div className="cta-box cta-look">
                            <div className="cta-icon">ICONE</div>
                            <h3>Quero comprar um carro</h3>
                            <p>Nós encontramos o melhor carro para você! Confira nosso estoque.</p>
                            <button className="btn">Search Cars</button>
                        </div>
                        <div className="cta-box cta-sell">
                            <div className="cta-icon">ICON</div>
                            <h3>Quero vender um carro</h3>
                            <p>Receive the best price for your car and get paid quickly.</p>
                            <button className="btn btn-dark">Sell Your Car</button>
                        </div>
                    </div>
                </section>

                <section className="car-listing">
                    <div className="container">
                        <h2>CONFIRA OS NOSSOS CARROS</h2>
                        <div className="car-grid">
                            {carsData.map(car => {
                                const currentIndex = currentImageIndexes[car.id] || 0;
                                const navigateCarImage = (direction, carId, images) => {
                                    setCurrentImageIndexes(prevIndexes => {
                                        const newIndex = (prevIndexes[carId] + direction + images.length) % images.length;
                                        return { ...prevIndexes, [carId]: newIndex };
                                    });
                                };

                                return (
                                    <div key={car.id} className="car-card">
                                        <div className="car-image-container">
                                            <a href={`/car/${car.id}`} className="car-image-link">
                                                <img 
                                                    src={car.images[currentIndex]} 
                                                    alt={car.name} 
                                                    className="car-card-image" // Adicionada uma classe específica se necessário
                                                />
                                            </a>
                                            {car.images.length > 1 && (
                                                <>
                                                    <button 
                                                        className="arrow left-arrow car-card-arrow" 
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateCarImage(-1, car.id, car.images); }}
                                                    >
                                                        <i className="fas fa-chevron-left"></i>
                                                    </button>
                                                    <button 
                                                        className="arrow right-arrow car-card-arrow" 
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateCarImage(1, car.id, car.images); }}
                                                    >
                                                        <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <a href={`/car/${car.id}`} className="car-info-link">
                                            <div className="car-info">
                                                <h3>{car.name}</h3>
                                                <div className="car-specs">
                                                    <span><i className="fas fa-tachometer-alt"></i> {car.mileage}</span>
                                                    <span><i className="fas fa-cogs"></i> {car.transmission}</span>
                                                    <span><i className="fas fa-gas-pump"></i> {car.fuel}</span>
                                                </div>
                                                <div className="car-price">{car.price}</div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="why-us">
                    <div className="container">
                        <h2>Por que pode confiar ?</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <div className="feature-icon">ICON</div>
                                <h4>Ofertas de Financiamento Especiais</h4>
                                <p>Oferecemos opções de financiamento especiais para se adequarem ao seu orçamento.</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">ICON</div>
                                <h4>Concessionária de Carros de Confiança</h4>
                                <p>Os nossos clientes confiam em nós pela nossa qualidade e fiabilidade.</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">ICON</div>
                                <h4>Preços Transparentes</h4>
                                <p>Sem taxas ocultas. Acreditamos em preços justos e claros.</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">ICON</div>
                                <h4>Serviço de Carros Especializado</h4>
                                <p>A nossa equipa de especialistas garante que o seu carro está em perfeitas condições.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
// Nota: Este código é uma adaptação para o ambiente Immersive, onde não se pode usar Next.js diretamente.
// Em um projeto Next.js real, você usaria o sistema de roteamento e componentes adequados, como `next/head` para gerenciar o título e favicon, e `next/link` para navegação entre páginas. Além disso, o Swiper seria importado como um componente React e não diretamente manipulado via DOM. 
// O CSS do Swiper seria importado no arquivo `__app.js` ou diretamente no componente onde é usado, dependendo da configuração do projeto.
// As imagens e ícones devem ser substituídos por URLs válidos ou importados de um diretório local, conforme necessário. 
// O código acima é uma simplificação para fins de