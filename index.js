const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");

const serviceAccount = require("./chave-firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const db = admin.firestore();

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const response = await db.collection('cartoes').get()
        const cards = response.docs.map(doc => ({
            id: doc.id, ...doc.data(),
        }));
        console.log(cards);
        res.status(200).json({ cards });
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensagem: 'Erro: ' + e });
        console.log('Erro ao buscar dados: ' + e);
    }
});

app.post('/cadastrar', async (req, res) => {
    const { title, icon_class, link, desc } = req.body;

    try {
        // Adiciona um novo documento na coleção 'cartoes'
        const novoCartao = await db.collection('cartoes').add({
            title: title,
            icon_class: icon_class,
            link: link,
            desc: desc
        });

        res.status(201).json({ mensagem: "Cartão cadastrado com sucesso!", id: novoCartao.id });
    } catch (e) {
        console.log('Erro ao cadastrar o cartão:', e);
        res.status(500).json({ mensagem: "Erro ao cadastrar o cartão: " + e });
    }
});

app.put('/cartoes', async (req, res) => {
    const { id, title, icon_class, link, desc } = req.body;

    try {
        // Verifica se o ID foi passado
        if (!id) {
            return res.status(400).json({ mensagem: "ID do cartão não foi fornecido" });
        }

        // Atualiza o documento com o ID fornecido
        await db.collection('cartoes').doc(id).update({
            title: title,
            icon_class: icon_class,
            link: link,
            desc: desc
        });

        res.status(200).json({ mensagem: "Cartão atualizado com sucesso!" });
    } catch (e) {
        console.log('Erro ao atualizar o cartão:', e);
        res.status(500).json({ mensagem: "Erro ao atualizar o cartão: " + e });
    }
});


app.delete('/delete', async (req, res) => {
    const { id } = req.body;

    console.log("ID recebido para exclusão:", id); // Adiciona log para depuração

    try {
        // Verifica se o ID foi fornecido
        if (!id) {
            return res.status(400).json({ mensagem: "ID do cartão não foi fornecido" });
        }

        // Exclui o documento com o ID fornecido
        await db.collection('cartoes').doc(id).delete();

        res.status(200).json({ mensagem: "Cartão excluído com sucesso!" });
    } catch (e) {
        console.log('Erro ao excluir o cartão:', e);
        res.status(500).json({ mensagem: "Erro ao excluir o cartão: " + e });
    }
});


app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});