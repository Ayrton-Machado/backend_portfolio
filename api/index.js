const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");

const serviceAccount = {
    type: "service_account",
    project_id: "bd-portfolio-c37f1",
    private_key_id: "ad8d46c55fea01096978c4809af0fd1572f95e79",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOM3boCP88rzKi\nXkYZvI8kVq+NPGukF3swT9PbqMDP4m+IJkEDa5xKENzABjeboWqzDXlCtUppNikl\nLJTsvEADP05NE90T7DgUsTyzemD7ULQm3xz9gXhG2Lrr5U1Zu3+IQx8shzw7/l7V\nsfnOJLJ0VLZD2uDyIfB6qXGeT//J7xLen3E/eDYlXpKtL8/lhi9cxRPS496eMiUL\nGxSkgt5MjSfiQ/JxPy1SVwHksKccubRCQKwJuJFNaLbZFySCDQ6H/2eXUi9PeyP6\n0d8pVMhPfZ+yvzn3H6WwX0df6gIRlaacuyYTKhD72vkUemkTaP+WBwFPoJPZHhG/\npxrGe491AgMBAAECggEAEDgmGzxR71EMl474zp9xVvdmmaJuCRs7umIdFQMiH3f9\nM+VmacF2KrFG2+fhSeGZhfoCVsfx0XLMK7tk/3YTRu4c150/X4jOJHqIfsmahUok\n0YXtPteHQXNcyJ9hxTQlZO96rUL57vIkPYThVGC4lMPxDkdSOFmJE+zuHfjG8vgy\nA8F02PmA5u5h4IHejlnUlaZ6fbqrJgRPLZIbFFNM7/CzPbftGoC8LR9OimrAJg7C\nsvT3FtTsboCcDmlY5zJdymyDTnLHLertz+4/nUJuvUjfTAkfofUXM5QFFgoogPdV\nO+JaSVkbtsaFARjx3PuRejLYgMH2IGtpbGzAy1VGRQKBgQDvgK6561/YfWoi3/bG\nmgQUGOvHQj24pIiRKj+hM70qYoM1xPYYrcr05adba24OYnAmWcXcqOawgfSQWI8Q\nev6eipDdDuThtuA9XAYcr32lhMcJCDi9/Nco69cTmD7eI29P3u1ZizU+J1G9VdD+\nmP3u+dfbN/asmAt7WhFFt4LriwKBgQDcZ40RMVC8ld1BOb5fJaXQzM82AkOtdvub\nbsXdsU/lHad1vmUAVBLNacgmUEaXTAujxdVWw0vIF6GDKuWSyKtdhtPP9dMs4otS\nJG3sg190P8hJ2Ios9ripoKqIy7qCFJhZdkN8ZNOlsc/P2fpD5UQoaLhGvTV0hPtB\nPLS10VbQ/wKBgH23nX/oJnJ8Opc92sqbE+L8xd7dTYq7ixgwBiB3CSfTeC5kSg3g\nRDXSyst5E9cnItlurCbM3fLu9FJEuiwbc8YC1FHFPK2ikgiDYo3yLFES5ms+TpKj\nwskvKsGVXAK8tPRG/23OXc9XUlfBUSgjZL/pk731nV0xnm1MdN6UmntLAoGBALv9\nyvH+KUohXY3Tzc/kEbGt75O2jLk5QlSKQFTedzIKgBpK4mVMUJlKf8BGOl+0Kj1v\ncY9Glq29kjKJ9TSk2p20cZfwqkWfmYvfrK7OQy2pdZGfFARUEKAGfU6ezp9DJ8su\nt1MzwN6Ucpdr6i3dMKxy3bLgkeanwpMbT1vBiZZLAoGBAOF+I85PzrNaLEFBCAPb\n0LtEsBxnuW1s/6dLbPIYS0Mk4SVeyxwU/e9aiOQIYdIrZDBWBr4j3Al3mS04YleR\nledtU8P8Rz0iC8vmaxW+0gwoKNNYQEqEN1V5bMwqCT3KX1WUgVWhHq8YLoAB+4WU\n7klbC8ZfjBarOomZMZwtiGO6\n-----END PRIVATE KEY-----\n",
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

    console.log("ID recebido para exclusão:", id); // Adiciona log para depuração

    try {
        // Verifica se o ID foi fornecido
        if (!id) {
            return res.status(400).json({ mensagem: "ID do cartão não foi fornecido" });
        }

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
});

module.exports = app;

app.listen(3000, () => {
    console.log('rodando')
})