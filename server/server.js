const express = require('express');
const mysql = require('mysql2');
const fs = require('fs')
const cors = require('cors');
const port = 3000

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Webcrud',
    port: 3306
  });

  db.connect((err) => {
    if (err) {
      console.error('Erro na conexão com o banco de dados:', err);
      return;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida');
  });

const app = express();
app.use(cors())
app.use(express.static('../public'))

app.get('/', (req, res)=>{
    fs.readFile('../public/html/index.html', (err, data)=>{
        if(err){
            res.end('erro ao ler o arquivo')
        }else{
            res.end(data)
        }
    })
    console.log('path')
})
app.get('/login', (req, res)=>{
    var emailUrl = req.query.email
    var senhaUrl = req.query.senha
    var user = '';
    var perfil = '';
    var acesso = false
    var query = `SELECT * FROM acessos`
    db.query(query, (err, resultado) =>{
        if(err) {
            console.error('Erro na consulta SQL:', err);
            res.status(500).json({ error: 'Erro ao buscar dados' });
            return;
        }
        for(let i = 0; i < resultado.length; i++){
            if(resultado[i].email == emailUrl && resultado[i].senha == senhaUrl){
                user = resultado[i].acessoId;
                perfil = resultado[i].nome;
                console.log(perfil)
                acesso = true;
                break;
            }
        }
        res.send({
            'acesso': acesso,
            'user': user,
            'perfil': perfil
    })
    })
})
app.get('/data', (req, res)=>{
    var query = 'SELECT * FROM acessos WHERE ativo = true;'
    db.query(query, (err, resultado)=>{
        if(err) {
            console.error('erro na consulta', err)
            return
        }else{
            res.send(resultado)
        }
    })
})
app.get('/update', (req, res)=>{
    var id = req.query.id;
    var nome = req.query.nome;
    var nascimento = req.query.nascimento;
    console.log(nascimento)
    var email = req.query.email;
    var query = `UPDATE acessos
    SET nome = '${nome}',
    dataNascimento = '${nascimento}',
    email = '${email}'
    WHERE acessoId = '${id}';`
    db.query(query, (err, resultado)=>{
        if(err) {
            console.error('erro na alteraçao dos dados', err)
            res.send(false)
            return
        }else{
            res.send(true)
        }
    })
})
app.get('/like', (req, res)=>{
    var id = req.query.id;
    var newLike = req.query.like;
    var user = req.query.user;
    var sql = `UPDATE comentarios
    SET likes = '${newLike}'
    WHERE comentario_id = ${id};`;
    var sqlLikeRelacao = `insert into likesrelacao(id_perfil, comentario) values (${user}, ${id})`;
    db.query(sqlLikeRelacao, (err, resultado)=>{
        if(err){
            console.log('erro no insert likerelaçao'+err)
        }
    })
    db.query(sql, (err, resultado)=>{
        if(err) {
            console.error('erro na alteraçao dos dados', err)
            res.send(false)
            return
        }else{
            res.send(true)
        }
    })
    if(req.query.deslike){
        console.log(req.query.deslike)
        var sqlDelete = `delete from likesrelacao where comentario = ${id};`;
        db.query(sqlDelete, (err, resultado)=>{
            if(err){
                console.log('err na exclusao da linha like relaçao' + err)
            }
        })
    }
})
app.get('/delete', (req, res)=>{
    var status= false;
    var id = req.query.id;
    var sql = `DELETE FROM acessos WHERE acessoId = ${id}`;
    db.query(sql, (err, resultado)=>{
        if(err){
            console.error('erro na remoçao de perfil', err);
            res.send(status)
            return
        }else{
            status = true
            res.send(status)
        }
    })
})
app.post('/insert', (req, res)=>{
    var status = false
    var nome = req.query.nome
    var nascimento = req.query.nascimento
    var email = req.query.email
    var senha = req.query.senha
    var sql = `INSERT INTO acessos (nome, dataNascimento, senha, email, ativo) VALUES ('${nome}', '${nascimento}', '${senha}', '${email}', true)`
    db.query(sql, (err, resultado)=>{
        if(err){
            console.error('erro na inserçao', err)
            res.send(status)
        }else{
            status = true
            res.send(status)
        }
    })
})
app.post('/comentar', (req, res)=>{
    var pai = req.query.pai;
    if(pai == undefined){
        pai = 0;
    }
    var comentario = req.query.comentario;
    var perfil = req.query.perfil;
    var status = false;
    var sql = `INSERT INTO comentarios (comentario, likes, pai, id_perfil) VALUES ('${comentario}', 0, ${pai}, ${perfil})`;
    db.query(sql, (err, resultado)=>{
        if(err){
            console.log(err);
        }else{
            status = true;
            res.send(status);
        }
    })
})
app.get('/comcom', (req, res)=>{
    var pai = req.query.pai;
    var sql = `select comentarios.comentario_id, comentarios.comentario, acessos.nome from comentarios join acessos where  acessos.acessoId = comentarios.id_perfil and pai = ${pai
    };`;
    db.query(sql, (err, resultado)=>{
        if(err){
            console.log('erro na consulta de comcom' + err)
        }else{
            res.send(resultado);
        }
    })
})
app.get('/posts', (req, res)=>{
    var sql = 'select acessos.nome, comentarios.comentario, comentarios.likes, comentarios.comentario_id from comentarios join acessos where comentarios.id_perfil = acessos.acessoId and pai = 0';
    db.query(sql, (err, resultado)=>{
        if(err){
            console.log('erro na busca dos comentarios', err)
        }else{
            res.send(resultado)
        }
    })
})
app.get('/likes-relacao', (req, res)=>{
    var sql = `SELECT * FROM likesrelacao`
    db.query(sql, (err, resultado)=>{
        if(err){
            console.log('erro na busca de dados likesrelacao')
        }else{
            res.send(resultado)
        }
    })
})

app.listen(port, () => {
  console.log(`Servidor Node.js rodando na porta ${port}`);
});