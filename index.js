const express = require('express');
const cors = require('cors');

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());


const cards = [
    {
        title: 'Network',
        icon_class:'fa-solid fa-network-wired',
        link: 'https://github.com/Ayrton-Machado/network',
        desc: `Implementei uma rede social usando Python, JavaScript, HTML e CSS. 
        O projeto permite que usuários façam publicações, sigam outros usuários, editem posts, curtam, vejam perfis, e 
        utilizem paginação. Interações são atualizadas de forma assíncrona sem recarregar a página.`
    },
    {
        title: 'Email',
        icon_class: 'fa-solid fa-envelope',
        link: 'https://github.com/Ayrton-Machado/mail',
        desc: `Implementei um cliente de email single-page-app usando JavaScript, HTML e CSS. 
        O projeto permite enviar, arquivar, desarquivar, visualizar e responder emails. Além disso, 
        os emails são organizados em caixas como Inbox, Enviados e Arquivados. A aplicação realiza 
        atualizações assíncronas sem recarregar a página.`
    },
    {
        title: 'Commerce',
        icon_class: 'fa-solid fa-shopping-cart', // Escolhido com base no título
        link: 'https://github.com/Ayrton-Machado/commerce',
        desc: `Implementei uma plataforma de leilões usando Django, permitindo que usuários façam e acompanhem ofertas em 
        tempo real. Os usuários podem criar leilões, fazer lances, comentar, adicionar itens à lista de interesse e 
        gerenciar categorias. Integração com a interface admin do Django.`
    },
    {
        title: 'Tic-Tac-Toe IA',
        icon_class: 'fa-solid fa-brain', // Escolhido com base no título
        link: 'https://github.com/Ayrton-Machado/tictactoe',
        desc: `Implementei um jogo da velha com uma IA usando Python. A IA utiliza o algoritmo Minimax para determinar 
        as melhores jogadas, analisando todas as possíveis combinações de movimentos e definindo o vencedor com base nas 
        regras do jogo. O projeto inclui funções como jogadas possíveis, resultado de ações e a verificação do vencedor.`
    },
    {
        title: 'Wiki',
        icon_class: 'fa-solid fa-book', // Escolhido com base no título
        link: 'https://github.com/Ayrton-Machado/wiki',
        desc: `Implementei uma enciclopédia colaborativa usando Python e Django. O projeto permite a criação, edição e visualização 
        de entradas em formato Markdown, com conversão automática para HTML. Inclui funcionalidades como pesquisa dinâmica, 
        páginas aleatórias e manipulação de entradas por meio de uma interface amigável.`
    },
    {
        title: 'Google Search',
        icon_class: 'fa-solid fa-magnifying-glass', // Escolhido com base no título
        link: 'https://github.com/Ayrton-Machado/google_search_page',
        desc: `Clone da página de busca do Google desenvolvido com HTML e CSS. O projeto inclui funcionalidades de busca regular, 
        busca de imagens e busca avançada, além de um botão "I'm Feeling Lucky". As páginas imitam o layout e a estética 
        da interface original do Google, com botões e barras de pesquisa centralizados e arredondados.`
    }
]

app.get("/", (req, res) => {
    res.status(200).json({cards});
    console.log("Success");
});

app.post('/cadastrar', (req, res) => {
    const{title, icon_class, link, desc} = req.body;
    cards.push({title: title, icon_class: icon_class, link: link, desc: desc})
    res.status(201).json({mensagem: "deu boa o POST"})
})

app.put('/cartoes', (req, res) => {
    console.log(req.body);
    const {id, title, icon_class, desc} = req.body;
    cards[id] = {title:title, icon_class:icon_class, desc:desc}
    res.status(201).json({mensagem: "deu bom o put"})
})

app.delete('/delete', (req, res) => {
    const {card} = req.body;
    cards.splice(card, 1);
    res.status(201).json({mensagem: 'deu bom o delete'})
})

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});