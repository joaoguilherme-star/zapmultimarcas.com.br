// pages/admin/index.js
import React, { useState, useEffect } from 'react';
// Removido: import Head from 'next/head'; (next/head não é resolvido neste ambiente)
// Removido: import Link from 'next/link'; (substituído por <a> para compatibilidade)

// Importações e inicialização do Firebase movidas para este ficheiro para garantir a resolução
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// As variáveis globais __firebase_config e __initial_auth_token são fornecidas pelo ambiente.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicializa o Firebase
let app;
if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
} else {
    console.error("Firebase config not found. Firebase will not be initialized.");
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Função para autenticar o usuário (anônima ou com token customizado)
async function authenticateUser() {
    if (!auth) {
        console.error("Firebase Auth not initialized.");
        return null;
    }

    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Usuário autenticado:", user.uid);
                unsubscribe(); // Para de escutar após a autenticação inicial
                resolve(user);
            } else {
                console.log("Nenhum usuário autenticado. Tentando autenticação...");
                try {
                    if (initialAuthToken) {
                        const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                        console.log("Autenticado com token customizado:", userCredential.user.uid);
                        resolve(userCredential.user);
                    } else {
                        const userCredential = await signInAnonymously(auth);
                        console.log("Autenticado anonimamente:", userCredential.user.uid);
                        resolve(userCredential.user);
                    }
                } catch (error) {
                    console.error("Erro na autenticação Firebase:", error);
                    resolve(null);
                } finally {
                    unsubscribe(); // Para de escutar mesmo em caso de erro
                }
            }
        });
    });
}


// Componentes Header e Footer (reutilizados para consistência de UI)
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

export default function AdminPage() {
    const [carData, setCarData] = useState({
        id: '',
        name: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        transmission: '',
        fuel: '',
        price: '',
        color: '',
        doors: '',
        description: '',
        images: [], // Array de URLs de imagens
        status: 'Disponível',
    });
    const [imageInput, setImageInput] = useState(''); // Para adicionar URLs de imagem uma por uma
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Estado para o usuário autenticado

    useEffect(() => {
        // Autentica o usuário ao carregar a página
        authenticateUser().then(loggedInUser => {
            if (loggedInUser) {
                setUser(loggedInUser);
                console.log("Admin panel authenticated user:", loggedInUser.uid);
            } else {
                setMessage("Erro: Não foi possível autenticar o usuário. Verifique a configuração do Firebase.");
            }
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageAdd = () => {
        if (imageInput.trim() && !carData.images.includes(imageInput.trim())) {
            setCarData(prevData => ({
                ...prevData,
                images: [...prevData.images, imageInput.trim()]
            }));
            setImageInput('');
        }
    };

    const handleImageRemove = (index) => {
        setCarData(prevData => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!user || !db) {
            setMessage("Erro: Usuário não autenticado ou Firebase DB não inicializado.");
            setLoading(false);
            return;
        }

        try {
            // Converte campos numéricos
            const parsedData = {
                ...carData,
                year: parseInt(carData.year),
                mileage: parseInt(carData.mileage),
                price: parseFloat(carData.price),
                doors: parseInt(carData.doors),
                createdAt: new Date(), // Adiciona timestamp de criação
                updatedAt: new Date(), // Adiciona timestamp de atualização
            };

            // Validação básica (pode ser mais robusta)
            if (!parsedData.id || !parsedData.name || !parsedData.make || !parsedData.model || !parsedData.price || parsedData.images.length === 0) {
                setMessage("Por favor, preencha todos os campos obrigatórios (ID, Nome, Marca, Modelo, Preço, Imagens).");
                setLoading(false);
                return;
            }

            // Caminho da coleção privada do usuário: /artifacts/{appId}/users/{userId}/cars
            // O Firestore criará o documento com um ID automático se você usar addDoc.
            // Se você quiser usar o carData.id como ID do documento, usaria setDoc(doc(db, 'cars', carData.id), parsedData);
            const carsCollectionRef = collection(db, 'artifacts', user.uid, 'cars');
            await addDoc(carsCollectionRef, parsedData);

            setMessage("Carro adicionado com sucesso!");
            // Limpa o formulário
            setCarData({
                id: '', name: '', make: '', model: '', year: '', mileage: '',
                transmission: '', fuel: '', price: '', color: '', doors: '',
                description: '', images: [], status: 'Disponível',
            });
            setImageInput('');
        } catch (error) {
            console.error("Erro ao adicionar carro ao Firestore:", error);
            setMessage(`Erro ao adicionar carro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Título da página diretamente no documento para este ambiente */}
            <title>Admin - Adicionar Carro</title>
            <link rel="icon" type="image/png" href="/LOGO ZAP MULTIMARCAS.png" />

            <Header />

            <main className="admin-main">
                <div className="container">
                    <h1>Painel de Administração - Adicionar Carro</h1>
                    <p>ID do Usuário: {user ? user.uid : 'Carregando...'}</p> {/* Mostra o ID do usuário */}

                    {message && <p className="form-message">{message}</p>}

                    <form onSubmit={handleSubmit} className="car-form">
                        <div className="form-group">
                            <label htmlFor="id">ID do Carro (URL Slug):</label>
                            <input type="text" id="id" name="id" value={carData.id} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nome Completo:</label>
                            <input type="text" id="name" name="name" value={carData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="make">Marca:</label>
                            <input type="text" id="make" name="make" value={carData.make} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Modelo:</label>
                            <input type="text" id="model" name="model" value={carData.model} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="year">Ano:</label>
                            <input type="number" id="year" name="year" value={carData.year} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mileage">Quilometragem (km):</label>
                            <input type="number" id="mileage" name="mileage" value={carData.mileage} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="transmission">Transmissão:</label>
                            <select id="transmission" name="transmission" value={carData.transmission} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Auto">Automática</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fuel">Combustível:</label>
                            <select id="fuel" name="fuel" value={carData.fuel} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Petrol">Gasolina</option>
                                <option value="Etanol">Etanol</option>
                                <option value="Flex">Flex</option>
                                <option value="Hybrid">Híbrido</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Eletrico">Elétrico</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Preço (R$):</label>
                            <input type="number" id="price" name="price" value={carData.price} onChange={handleChange} step="0.01" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="color">Cor:</label>
                            <input type="text" id="color" name="color" value={carData.color} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doors">Portas:</label>
                            <input type="number" id="doors" name="doors" value={carData.doors} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Descrição:</label>
                            <textarea id="description" name="description" value={carData.description} onChange={handleChange}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="images">URLs das Imagens:</label>
                            <div className="image-input-group">
                                <input
                                    type="url"
                                    id="imageInput"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="Adicionar URL da imagem"
                                />
                                <button type="button" onClick={handleImageAdd} className="btn btn-dark">Adicionar Imagem</button>
                            </div>
                            <div className="image-preview-list">
                                {carData.images.map((imgUrl, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img src={imgUrl} alt={`Imagem ${index + 1}`} />
                                        <button type="button" onClick={() => handleImageRemove(index)}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select id="status" name="status" value={carData.status} onChange={handleChange}>
                                <option value="Disponível">Disponível</option>
                                <option value="Vendido">Vendido</option>
                                <option value="Reservado">Reservado</option>
                                <option value="Em Preparação">Em Preparação</option>
                            </select>
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Adicionando...' : 'Adicionar Carro'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />

            {/* Estilos específicos para o formulário de administração (pode ser movido para style.css) */}
            <style jsx>{`
                .admin-main {
                    padding: 3rem 0;
                    background-color: var(--light-color);
                }
                .admin-main h1 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: var(--dark-color);
                }
                .admin-main .form-message {
                    text-align: center;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border-radius: var(--border-radius);
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .admin-main .form-message.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                .car-form {
                    background-color: #fff;
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: var(--text-color);
                }
                .form-group input[type="text"],
                .form-group input[type="number"],
                .form-group input[type="url"],
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ced4da;
                    border-radius: var(--border-radius);
                    font-size: 1rem;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    outline: none;
                }
                .form-group textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                .image-input-group {
                    display: flex;
                    gap: 0.5rem;
                }
                .image-input-group input {
                    flex-grow: 1;
                }
                .image-preview-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .image-preview-item {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border: 1px solid #ddd;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                .image-preview-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .image-preview-item button {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background-color: rgba(220, 53, 69, 0.8);
                    color: white;
                    border: none;
                    border-radius: 0 0 0 var(--border-radius);
                    padding: 0.2rem 0.5rem;
                    cursor: pointer;
                    font-size: 0.8rem;
                    line-height: 1;
                }
                .btn[disabled] {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </>
    );
}
