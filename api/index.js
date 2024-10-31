const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");

const serviceAccount = {
    type: "service_account",
    project_id: "bd-portfolio-c37f1",
    private_key_id: "cf481c002da5420032f78da1e4646a2f2669d590",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtIMwKbNrP/sh2\nFkQCCqebA/4ZrMw4YCSRkYI1mtHGOP00i3EfEtNN1ebRiPS6npphJtIAPJR1p9Zv\n3bp2mpGcfl/F+cF6Y3EF+3ZWK2fhDVYZUDFh8t7KE92JpCvkfCl2BF+P1D2A2QA6\nKXokV8+jpVsklFxCGZpYSP81c1oM/FzT4fEusQXLVCDCaIzMur6g6A/5hCW3Lext\nrgyBa3Z1UIOoqGxvDqDJc46vpiQ6agoUAz7Q5G048vz8AeRKOkU4CCD8y+zhxLt3\nejS1jdxlRrArl1PaEquHMOv9eZBVjcBbtgtS9PNw+oSTESmsbxM1LR7KFSoVUzEV\niN4IPbH/AgMBAAECggEAOXD17FqVIMhrv+tB2yrAkhUEAy0wJUHo6dhRLfIMedOJ\nRqa2ptvVEuhLaxudiO1toTYZrdP+9IdNMzkHd76Wok2cnqUTILYhBV12O4Z1OfeU\nkTozVDJUlKf+RN7fgRAwrPV/PqSfp2wpmW09uLsKwe4G55QGyz5PfK5mIAkK2dT6\np8EtOFxo9Bw+mh/ICG/HyB/4JfFS2hJSscr2vUM0+R4s5NIvVTtpSKoAn5OjTzGy\nHZLK0m7depabhJDvExJMc51eQlz2K2vDw3a/B3L1zi/QZwdrDZSJJt2fE2biDVUu\nyUrImEzB+WgMKRj7LITwGAxjCP7gmpV/jsU0RcN0EQKBgQD/XB8aPqbY5+yeWUA0\nP8t59IdHJCajnDSv1J8Xo+ktRVi174zHfso1nL5yGZapF7EwivTqVlT7FKSsPLSj\nNsnj3DFpPltS0LrutmpMQXq+EF+4HuJYh6Zr26rYnu4nL+rQAzElIYRSIUmy4pjk\n8eWElK2meQrXlypH2ZU8enAREQKBgQDtuPmol6l3Phc/3wEkcAIwH3pIVLmIFOAV\nsXxoXD97eCzrtV2YUlrGwABCgxOaV1TTlKr1W+cdClWeWSv+PmpZWIURhM3ISLh5\n36LJezXbUeKEUdLaVEq+ie4R3oh8FTma9jeUUI5zJDMvNvppriCBglPVRhWf5U4F\nhaIA0uGSDwKBgFHSK6kWIBHqJjgKsvbK5iC6iEn0PGk6GOup/hvuCj3WNXl+OyaE\n6rfI9IDM0Ch4De9W5ujbJrmYwLbrcJnHaWMYX8CwGUTs2qi4TFEIvhJ+Xp05UB87\nv8hZh2GHcxmdUei6zRlvpt1GCz5FOuZI19jmZsmriRzRM9v3zMinFpdxAoGAQDmb\nacsfw9GIon7zZg7E6I94kBYj0foh2HqNK/zQQeFj8YKceMy3Lb8t0spq/2XcyxT9\nYzCjLhteqltZIWVngiACQ4tntVbAUFz1NA4PrONgmXMpzka7suK86SMAKNXrLEyd\nE3r4IW+ETJtD6E1dBuBZGePHb92ZyLAj5qkSvE0CgYEA5APCFIQ+u2XXLXqYomd3\nr9Ewb6DjR8E7zZZGL75BpNNY/EzfOuw5aEtNqh7p2n1w+QaGkPYClq5xdZWKBP4j\nFz6eqQMb8LSpDKr1WM3VU9bqTf9+cYlP6y46CBTZAolZjwkosJ6WS2rVaZNL9pXq\nHAjoLsDDAHr5H4qZO7eII1U=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-jl6so@bd-portfolio-c37f1.iam.gserviceaccount.com",
    client_id: "115847679466451230661",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jl6so%40bd-portfolio-c37f1.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const db = admin.firestore();

const app = express();

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
    if(!title) {
        res.status(400).json({mensagem: "Nome do Cartão Inválido"})
        console.log('Novo cartão não cadastrado, Nome inválido')
    } else if (!icon_class) {
        res.status(400).json({mensagem: "Classe de ícone do Cartão Inválido"})
        console.log('Novo cartão não cadastrado, Classe do ícone inválido')
    } else if (!link) {
        res.status(400).json({mensagem: "Link do Cartão Inválido"})
        console.log('Novo cartão não cadastrado, Link inválido')
    } else if (!desc) {
        res.status(400).json({mensagem: "Descrição do Cartão Inválido"})
        console.log('Novo cartão não cadastrado, Descrição inválido')
    } else {

        try {
            // Adiciona um novo documento na coleção 'cartoes'
            const novoCartao = await db.collection('cartoes').add({
                title,
                icon_class,
                link,
                desc,
                criadoEm: admin.firestore.FieldValue.serverTimestamp()
            });
    
            res.status(201).json({ mensagem: "Cartão cadastrado com sucesso!", id: novoCartao.id });
        } catch (e) {
            console.log('Erro ao cadastrar o cartão:', e);
            res.status(500).json({ mensagem: "Erro ao cadastrar o cartão: " + e });
        }
    }
});

app.put('/cartoes', async (req, res) => {
    const { id, title, icon_class, link, desc } = req.body;

    try {
        // Verifica se o ID foi passado
        if (!id) {
            res.status(400).json({ mensagem: "ID do cartão não foi fornecido" });
            console.log('Cartao nao atualizado, ID inválido');
        } else {
            const cartaoRef = db.collection('cartoes').doc(id);
            const doc = await cartaoRef.get();
            if (!doc.exists) {
                res.status(404).json({ mensagem: 'Cartao com Id ' + id + ' nao encontrado' });
                console.log('Cartao nao Encontrado');
            } else {
                const dadosAtualizados = {};
                if (title) dadosAtualizados.title = title;
                if (icon_class) dadosAtualizados.icon_class = icon_class;
                if (link) dadosAtualizados.link = link;
                if (desc) dadosAtualizados.desc = desc;
                await cartaoRef.update(dadosAtualizados);
                res.status(200).json({ mensagem: 'Cartao com ID ' + id + ' atualizado' });
                console.log('Cartao com ID ' + id + ' atualizado');
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar Cartao:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar cartao' });
    }
});


app.delete('/delete', async (req, res) => {
    const id = req.body.cartao;
    console.log(`ID recebido para exclusão:`, id); // Adiciona log para depuração

    // Verifica se o ID foi fornecido
    if (!id) {
        return res.status(400).json({ mensagem: "ID do cartão não foi fornecido" });
    } else {
        try {
        // Exclui o documento com o ID fornecido
        const cartaoRef = await db.collection('cartoes').doc(id).delete();
        const doc = await cartaoRef.get()
        if (!doc.exists) {
            res.status(404).json({ mensagem: 'Cartão com ID' + cartao + 'nao encontrado' })
            console.log('cartao nao encontrado')
        } else {
            await cartaoRef.delete();
            res.status(200).json({ mensagem: 'Cartao com ID' + cartao + 'deletado'})
            console.log('Cartão com ID' + cartao + 'deletado')
        }
        } catch (e) {
            console.log('Erro ao excluir o cartão:', e);
            res.status(500).json({ mensagem: "Erro ao excluir o cartão: " + e });
        }
    }
});

module.exports = app;

app.listen(3000, () => {
    console.log('rodando')
})