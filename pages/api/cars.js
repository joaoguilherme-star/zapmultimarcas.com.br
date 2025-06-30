// pages/api/cars.js
import { db, collection, getDocs, authenticateUser } from '../../utils/firebase';

export default async function handler(req, res) {
    // Autentica o usuário antes de qualquer operação no Firestore
    const user = await authenticateUser();
    if (!user) {
        return res.status(401).json({ message: 'Não autorizado. Autenticação Firebase falhou.' });
    }

    if (!db) {
        console.error("Firestore DB not initialized.");
        return res.status(500).json({ message: 'Erro interno do servidor: Banco de dados não inicializado.' });
    }

    if (req.method === 'GET') {
        try {
            const carsCol = collection(db, 'artifacts', user.uid, 'cars'); // Caminho da coleção privada do usuário
            const carSnapshot = await getDocs(carsCol);
            const carsList = carSnapshot.docs.map(doc => ({
                id: doc.id, // O ID do documento Firestore será o ID do carro
                ...doc.data()
            }));
            res.status(200).json(carsList);
        } catch (error) {
            console.error("Erro ao buscar carros do Firestore:", error);
            res.status(500).json({ message: 'Erro ao buscar carros.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
