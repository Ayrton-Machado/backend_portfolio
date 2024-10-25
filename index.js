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


// const cards = [
//     {
//         title: 'Network',
//         icon_class:'fa-solid fa-network-wired',
//         link: 'https://github.com/Ayrton-Machado/network',
//         desc: `Implementei uma rede social usando Python, JavaScript, HTML e CSS. 
//         O projeto permite que usuários façam publicações, sigam outros usuários, editem posts, curtam, vejam perfis, e 
//         utilizem paginação. Interações são atualizadas de forma assíncrona sem recarregar a página.`
//     },
//     {
//         title: 'Email',
//         icon_class: 'fa-solid fa-envelope',
//         link: 'https://github.com/Ayrton-Machado/mail',
//         desc: `Implementei um cliente de email single-page-app usando JavaScript, HTML e CSS. 
//         O projeto permite enviar, arquivar, desarquivar, visualizar e responder emails. Além disso, 
//         os emails são organizados em caixas como Inbox, Enviados e Arquivados. A aplicação realiza 
//         atualizações assíncronas sem recarregar a página.`
//     },
//     {
//         title: 'Commerce',
//         icon_class: 'fa-solid fa-shopping-cart', // Escolhido com base no título
//         link: 'https://github.com/Ayrton-Machado/commerce',
//         desc: `Implementei uma plataforma de leilões usando Django, permitindo que usuários façam e acompanhem ofertas em 
//         tempo real. Os usuários podem criar leilões, fazer lances, comentar, adicionar itens à lista de interesse e 
//         gerenciar categorias. Integração com a interface admin do Django.`
//     },
//     {
//         title: 'Tic-Tac-Toe IA',
//         icon_class: 'fa-solid fa-brain', // Escolhido com base no título
//         link: 'https://github.com/Ayrton-Machado/tictactoe',
//         desc: `Implementei um jogo da velha com uma IA usando Python. A IA utiliza o algoritmo Minimax para determinar 
//         as melhores jogadas, analisando todas as possíveis combinações de movimentos e definindo o vencedor com base nas 
//         regras do jogo. O projeto inclui funções como jogadas possíveis, resultado de ações e a verificação do vencedor.`
//     },
//     {
//         title: 'Wiki',
//         icon_class: 'fa-solid fa-book', // Escolhido com base no título
//         link: 'https://github.com/Ayrton-Machado/wiki',
//         desc: `Implementei uma enciclopédia colaborativa usando Python e Django. O projeto permite a criação, edição e visualização 
//         de entradas em formato Markdown, com conversão automática para HTML. Inclui funcionalidades como pesquisa dinâmica, 
//         páginas aleatórias e manipulação de entradas por meio de uma interface amigável.`
//     },
//     {
//         title: 'Google Search',
//         icon_class: 'fa-solid fa-magnifying-glass', // Escolhido com base no título
//         link: 'https://github.com/Ayrton-Machado/google_search_page',
//         desc: `Clone da página de busca do Google desenvolvido com HTML e CSS. O projeto inclui funcionalidades de busca regular, 
//         busca de imagens e busca avançada, além de um botão "I'm Feeling Lucky". As páginas imitam o layout e a estética 
//         da interface original do Google, com botões e barras de pesquisa centralizados e arredondados.`
//     }
// ]

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