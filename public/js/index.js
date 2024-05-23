function verifyAccount() {
    var email = document.getElementById("email").value
    var senha = document.getElementById("senha").value
    var url = `http://localhost:3000/login?email=${email}&senha=${senha}`;
fetch(url)
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao fazer a requisição: ' + response.status);
    }
    return response.json();
})
.then(data => {
    if(data.acesso){
        sessionStorage.setItem('user', data.user);
        sessionStorage.setItem('perfil', data.perfil);
        window.location = '../html/logado.html';
    }else(
        alert("Email ou Senha errado")
        )
})
.catch(error => {
    console.error('Erro na requisição:', error);
});
}
function redirectCriarPerfil() {
    window.location = '../html/criarPerfil.html'
}
function redirectLogin() {
    window.location.href = 'http://localhost:3000/'
}
function addPerfil() {
    var nome = document.getElementById('nome').value
    var nascimento = document.getElementById('nascimento').value
    var email = document.getElementById('email').value
    var senha = document.getElementById('senha1').value
    var senhaRep = document.getElementById('senha2').value
    if(nome == '' || nascimento == '' || email == '' || senha == '' || senhaRep == '') {
        alert('Por favor preencher todos os campos abaixo')
    }else if(senha != senhaRep) {
        alert('As senhas tem que ser iguais')
    }else{
        fetch(`http://localhost:3000/data`)
        .then(response =>{
            return response.json()
        })
        .then(data =>{
            for(let i = 0; i < data.length; i++) {
                if(data[i].email == email){
                    alert(`O email ${email} ja esta cadastrado`)
                    return
                }
            }
            var url = `http://localhost:3000/insert?nome=${nome}&nascimento=${nascimento}&email=${email}&senha=${senha}`
            fetch(url, {method: 'post'})
            .then(response =>{
                return response.json()
            })
            .then(data=>{
                if(!data){
                    throw new Error('Erro ao fazer a requisição: ' + data.status);
                }
                if(data == true){
                    nome = ''
                    nascimento = ''
                    email = ''
                    senha = ''
                    senhaRep = ''
                    alert(`Usuario: ${nome} incluido no banco`)
                }
            })
        })
    }
}