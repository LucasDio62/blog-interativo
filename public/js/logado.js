//controlador das respostas
var contador = 0;
async function likesrelacao() {
    var value = '';
    await fetch('http://localhost:3000/likes-relacao')
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        value = data;
    })
    return value;
}
async function verifyRelacaoLike(idComentario){
    var values = await likesrelacao();
    var liked = false;
    for(let i = 0; i < values.length; i++){
        if(sessionStorage.getItem('user') == values[i].id_perfil && values[i].comentario == idComentario){
            liked = true;
            break;
        }
    }
    return liked;
}
function exibirComentarios(){
    var dados = [];
    fetch('http://localhost:3000/posts')
    .then((response)=>{
        return response.json();
    })
    .then(async (data)=>{
        dados = data;
        dados.reverse();
        // var likesrelacao = likesrelacao();
        var feed = document.getElementById('feed-inside');
        var perfil = sessionStorage.getItem('user');
        var perfilName = sessionStorage.getItem('perfil');
        var navBar = document.getElementById('nav-bar');
        var pElementNavBar = document.createElement('p');
        var pContent = document.createTextNode(perfilName);
        navBar.style.padding = '1%'
        navBar.style.boxSizing = 'border-box'
        pElementNavBar.appendChild(pContent);
        navBar.appendChild(pElementNavBar)
        for(let i = 0; i < dados.length; i++){
            var divDoComentario = document.createElement('div');
            var divComCom = document.createElement('div');
            var divUser = document.createElement('div');
            var comentarioTextArea = document.createElement('textarea');
            var likes = document.createElement('div');
            //////////////////////////////////////////////////////////////////////
            
            var divcomComContent = document.createElement('div');
            divcomComContent.id = dados[i].comentario_id + 'com';
            divcomComContent.style.width = '100%';
            divcomComContent.style.display = 'none';

            //////////////////////////////////////////////////////////////////////
            var inputComentario = document.createElement('input');
            inputComentario.placeholder = 'responder ...'
            inputComentario.id = dados[i].comentario_id + 'i';
            inputComentario.maxLength = '255';
            inputComentario.addEventListener('keydown', (e)=>{
                var input = document.getElementById(dados[i].comentario_id + 'i');
                var pai = document.getElementById(dados[i].comentario_id)
                var perfil = sessionStorage.getItem('user')
                if(e.key == 'Enter'){
                    if(input.value ==''){
                        return
                    }
                    fetch(`http://localhost:3000/comentar?comentario=${input.value}&perfil=${perfil}&pai=${pai.id}`, {method: 'post'})
                    .then((data)=>{
                        alert('comentario adicionado :)');
                        location.reload(true);
                    })
                }
            })
            divComCom.id = dados[i].comentario_id;
            likes.style.width = '100%';
            var comentar = document.createElement('p');
            comentar.style.width = '50%';
            comentar.style.display = 'inline';
            comentar.style.fontSize = '12';
            comentar.style.marginLeft = '10px';
            comentar.style.cursor = 'pointer';
            inputComentario.style.display = 'none';
            comentar.addEventListener('click', async ()=>{
                var input = document.getElementById(dados[i].comentario_id + 'i');
                var comentario = document.getElementById(dados[i].comentario_id + 'com');
                //link para colocar as respostaas n local certo
                var link = document.getElementById(dados[i].comentario_id).id;
                if(input.style.display == 'block'){
                    comentario.style.display = 'none';
                    input.style.display = 'none';
                }else{
                    comentario.style.display = 'block';
                    input.style.display = 'block';
                    if(contador == 0){
                        
                    await fetch(`http://localhost:3000/comcom?pai=${link}`)
                    .then((data)=>{
                        return data.json();
                    })
                    .then((resposta)=>{
                        resposta.reverse();
                        console.log(resposta)
                        for(let i = 0; i < resposta.length; i++){
                            var divResposta = document.createElement('div');
                            var respostaContent = document.createTextNode( resposta[i].nome + ' respondeu: ' + resposta[i].comentario)
                            divResposta.style.backgroundColor = 'grey';
                            divResposta.style.margin = '1%';
                            divResposta.style.borderRadius = '10px';
                            divResposta.style.padding = '1%';
                            // divResposta.style.height = '40%';
                            divResposta.appendChild(respostaContent)
                            comentario.appendChild(divResposta)
                        }
                    })
                    contador++;
                    }
                }
            })
            comentar.appendChild(document.createTextNode('Comentar'));
            
            var imgCora = document.createElement('img');
            var liked = await verifyRelacaoLike(dados[i].comentario_id);
            var likesContent = document.createTextNode(`  Likes ${dados[i].likes}`);
            imgCora.style.cursor = 'pointer';
            if(liked){
                imgCora.src = '../images/coracao(1).png';
                imgCora.id = dados[i].comentario_id + 'co';
                imgCora.style.width = '14.6px';
            }else{
                imgCora.src = '../images/coracao.png';
                imgCora.id = dados[i].comentario_id + 'co';
                imgCora.style.width = '14.6px';
            }
            imgCora.addEventListener('click', async ()=>{
                var coracao = document.getElementById(dados[i].comentario_id + 'co');
                if(coracao.src == 'http://localhost:3000/images/coracao(1).png'){
                    await fetch(`http://localhost:3000/like?id=${dados[i].comentario_id}&like=${dados[i].likes-1}&user=${perfil}&deslike=true`)
                    .then((data)=>{
                        if(data){
                            location.reload(true)
                            coracao.src = '../images/coracao.png';
                        }
                    })
                }else{
                    console.log('deslike')
                    await fetch(`http://localhost:3000/like?id=${dados[i].comentario_id}&like=${dados[i].likes+1}&user=${perfil}`)
                    .then((data)=>{
                        if(data){
                            location.reload(true)
                            coracao.src = '../images/coracao(1).png';
                        }
                    })
                }
            })
            likes.appendChild(imgCora);
            var textAreaContent = document.createTextNode(dados[i].comentario)
            likes.appendChild(likesContent);
            likes.appendChild(comentar)
            divUser.append(dados[i].nome);
            comentarioTextArea.appendChild(textAreaContent);
            divDoComentario.appendChild(divUser);
            divDoComentario.appendChild(comentarioTextArea);
            divDoComentario.appendChild(likes);
            
            //estilo da div que vai o comentario
            divDoComentario.style.borderRadius = '15px';
            divDoComentario.style.padding = '2%';
            divDoComentario.style.boxSizing = 'border-box';
            divDoComentario.style.width = '100%';
            divDoComentario.style.height = '30%';
            divDoComentario.style.backgroundColor = '#C4AFE0';
            divDoComentario.style.marginBottom = '3%';
            // estilo do comentario
            comentarioTextArea.style.width = '100%';
            comentarioTextArea.style.height = '50%';
            comentarioTextArea.style.color = '#9246F2';
            comentarioTextArea.style.padding = '1%';
            comentarioTextArea.style.border = '1px solid grey';
            comentarioTextArea.style.borderRadius = '10px';
            comentarioTextArea.style.boxSizing = 'border-box';
            comentarioTextArea.disabled = true;
            divComCom.appendChild(divDoComentario);
            divComCom.appendChild(inputComentario);
            divComCom.appendChild(divcomComContent);
            feed.appendChild(divComCom);
        }
    })
}
function comentar() {
    var textValue = document.getElementById('text').value;
    var perfil = sessionStorage.getItem('user');
    if(textValue==''){
        return;
    }
    fetch(`http://localhost:3000/comentar?comentario=${textValue}&perfil=${perfil}`, {method: 'post'})
    .then((data)=>{
        if(data){
            alert('comentario adicionado :)')
            location.reload(true);
        }
    })
}
exibirComentarios();