var express = require('express');
var bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
var app = express();
var port = 3000;

app.set('view engine', 'ejs');    // Setamos que nossa engine será o ejs
app.use(bodyParser.urlencoded()); // Com essa configuração, vamos conseguir parsear o corpo das requisições
app.use(express.static('public'));

let currentUser;
let systemMessage = null;

let users = [
    {
        name: "Mycael",
        email: "mycael@gmail.com",
        password: "allsol"
    },
    {
        name: "Leo",
        email: "leo@gmail.com",
        password: "isaaceomelhormonitor"
    },
    {
        name: "Jorivaldo",
        email: "jorivaldo@gmail.com",
        password: "hb202006"
    },
    {
        name: "ADMIN",
        email: "admin@gmail.com",
        password: "senha",
    }
];

app.get('/home', (req, res) => {
    if (currentUser.email != "admin@gmail.com"){
        res.render('pages/home', {currentUser: currentUser, systemMessage: systemMessage});
        systemMessage = null;
    } else {
        res.render('pages/admin', {users: users, systemMessage: systemMessage});
        systemMessage = null;
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
     for (let i = 0; i < users.length; i++){
        if (users[i].email == email && users[i].password == password){
            currentUser = users[i];
            res.redirect('/home');
            return;
        } 
        if ((i + 1) == users.length){
            systemMessage = "O login não foi bem sucedido."
            res.redirect('/');
        }
    }
});

app.get('/', (req, res) => {
    currentUser = null;
    res.render('pages/index', {systemMessage: systemMessage});
    systemMessage = null;
});

app.get('/register', (req, res) => {
    res.render('pages/register', {systemMessage: systemMessage});
    systemMessage = null;
});

app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(users.email)
   
    let verifyEmail = users.every(x => x.email != email);
   
    if(password == confirmPassword){
       if (verifyEmail){
        var newUser = {
            name: name,
            email: email, 
            password: password,
        }
        currentUser = newUser;
        users.push(currentUser);
        res.redirect('/home');
       } else {
        systemMessage = "Esse email já está cadastrado!";
        res.redirect('/register')
       }
        
    } else {
        systemMessage = "O password e o Confirm Password estão diferentes!";
        res.redirect('/register')
    }
});

app.get('/delete/:name', (req, res) => {
    let name = req.params.name;
    if (name != "ADMIN"){
        for (let i = 0; i < users.length; i++){
            if (name == users[i].name){
                users = users.filter((x) => x.name != name);
                console.log(name);
            }
        }
        res.redirect('/home');
    } else {
        systemMessage = "Não é possível deletar o Administrador";
        res.redirect('/home');
    }
    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});