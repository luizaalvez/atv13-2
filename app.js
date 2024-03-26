const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configurando o EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para analisar dados de formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para gerenciar sessões e cookies
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));

// Array de usuários cadastrados (simulação)
const users = [
    { email: 'admin@gmail.com', password: '123', name: 'Admin' },
    { email: 'user@gmail.com', password: '123', name: 'User' }
];

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para a página de login
app.get('/login', (req, res) => {
    // Verificar se o usuário já está autenticado
    if (req.session.user) {
        // Se o usuário já estiver autenticado, redireciona para a página de perfil
        res.redirect('/perfil');
    } else {
        // Caso contrário, renderiza a página de login normalmente
        res.render('login');
    }
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Verificar as credenciais do usuário
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Autenticar o usuário criando uma sessão e definindo um cookie
        req.session.user = user;
        res.redirect('/profile');
    } else {
        res.redirect('/login_failed');
    }
});

// Rota para a página de perfil do usuário
app.get('/profile', verificaAutenticacao, (req, res) => {
    // Verificar se o usuário está autenticado
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Destruir a sessão do usuário (apagar o cookie)
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            res.sendStatus(500);
        } else {
            res.redirect('/login');
        }
    });
});

// Rota para renderizar a página de lista de usuários
app.get('/lista', verificaAutenticacao, (req, res) => {
    // Verificar se o usuário está autenticado
    if (req.session.user) {
        res.render('lista');
    } else {
        res.redirect('/login');
    }
});

// Middleware para verificar se o usuário está autenticado
function verificaAutenticacao(req, res, next) {
    if (req.session.user) {
        // Se o usuário estiver autenticado, avança para a próxima função de middleware
        next();
    } else {
        // Se o usuário não estiver autenticado, redireciona para a página de login
        res.redirect('/login');
    }
}

// Outras rotas...

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
