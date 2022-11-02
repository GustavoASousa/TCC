var actionButton = document.querySelectorAll('.action-button button')
var hiddenUpload = document.querySelector('.action-button .hidden-upload')
var image_workspaceSpan = document.querySelector('.image-workspace span')
var preview_containerSpan = document.querySelector('.preview-container span')
var zoom = document.querySelectorAll('.side-control-page-1 .zoom svg')
var rotate = document.querySelectorAll('.side-control-page-1 .rotate svg')
var flip = document.querySelectorAll('.side-control-page-1 .flip svg')
var move = document.querySelectorAll('.side-control-page-1 .move svg')
var aspectRatio = document.querySelectorAll('.side-control-page-2 .aspect li')
var controlCropper = document.querySelectorAll('.bottom-control .ctrl-cropper svg')
var lockCropper = document.querySelectorAll('.bottom-control .lock svg')
var dargMode = document.querySelectorAll('.bottom-control .drag-mode svg')
var spanresposta = document.getElementById("resultadoApiImagem")



// upload image
actionButton[0].onclick = () => hiddenUpload.click()
hiddenUpload.onchange = () => {
    // apdate on new file selected issue removed here
    document.querySelector('.image-workspace').innerHTML = `<img src="" alt="">`
    var image_workspace = document.querySelector('.image-workspace img')
    spanresposta.innerHTML = ""

    var file = hiddenUpload.files[0]
    var url = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }))
    image_workspace.src = url
    image_workspaceSpan.style.display = 'none'
    preview_containerSpan.style.display = 'none'

    var options = {
        dragMode: 'move',
        preview: '.img-preview',
        viewMode: 2,
        modal: false,
        background: false,
        ready: function () {

            // zoom
            zoom[0].onclick = () => cropper.zoom(0.25)
            zoom[1].onclick = () => cropper.zoom(-0.25)

            // ajustar imagem
            move[0].onclick = () => cropper.move(0, -1)
            move[1].onclick = () => cropper.move(-1, 0)
            move[2].onclick = () => cropper.move(1, 0)
            move[3].onclick = () => cropper.move(0, 1)

            // // lock cropper
            // lockCropper[0].onclick = () => cropper.disable()
            // lockCropper[1].onclick = () => cropper.enable()

            // Enviar imagem para o tensorflow
            actionButton[1].onclick = () => {
                actionButton[1].innerText = '...'
                spanresposta.innerHTML = ""
                document.getElementsByClassName("loader")[0].style.display = "block"
                cropper.getCroppedCanvas({ width: 100, heigth: 200 }).toBlob((blob) => {
                    var downloadUrl = window.URL.createObjectURL(blob)
                    console.log("blob => ")
                    console.log(blob)
                    var a = document.createElement('a')
                    a.href = downloadUrl
                    console.log(downloadUrl)
                    a.download = 'cropped-image.jpg' // output image name
                    var data = {
                        "url": downloadUrl
                    }

                    var arquivo = new File([blob], "pupa.png", { type: blob.type })
                    uploadImagemEctare(arquivo)
                    // a.click()
                    // actionButton[1].innerText = 'Download'
                })
            }
        }
    }

    var cropper = new Cropper(image_workspace, options)
}
function Promessa(parametros, load) { // Faz a comunicação com o servidor 
    const u = new URLSearchParams(parametros).toString();
    var url = `http://127.0.0.1:5000/?${u}`

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(parametros),
            // body: parametros,
            headers: {
                "Content-Type": "application/json"
                // 'Content-Type': 'application/json; charset=UTF-8'
                // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }

        }) // return this promise
            .then(resp => {
                var token = resp.headers.get('token')
                if (token) {
                    sessionStorage.setItem('token', token);
                    myApp.data.expirada = false
                    salvaSessionStorage();
                }
                return resp
            })
            .then(response => response.arrayBuffer())
            .then(buffer => {
                let tipo = "iso-8859-1";
                let decoder = new TextDecoder(tipo);
                // let decoder = new TextDecoder("utf-8");
                let text = decoder.decode(buffer);

                let result = JSON.parse(text);
                resolve(result)

            })


    });
}


function uploadImagemEctare(url) {


    let req = new XMLHttpRequest();
    let formData = new FormData();

    req.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var resposta = req.responseText;
            console.log(resposta)

            var data = {
                "url": `C:/Ectare/${resposta}`
            }


            var CNN = new Promessa(data, undefined);
            CNN.then(
                function (dados) {
                    actionButton[1].innerText = 'Exibir resultado'
                    document.getElementsByClassName("loader")[0].style.display = "none"
                    preencheResultado(dados.message)
                })

        }
    });

    formData.append('url', url);
    // req.open('POST', "https://server.ectarepay.com.br/" + "_e" + "/ectare_adm?tela=SetUploadDocumentos&dbteste=false&idpessoa=" + idpessoa + "&tipo=" + nome, true);doradinho
    // req.open("POST", "https://server.ectarepay.com.br/" + myApp.data.versao + "/ectare_adm?tela=InserePessoasExcelSextou&dbteste=false&user=" + myApp.data.usuario.pessoa.idpessoa + "&idsextou_solicitacao=" + document.getElementById('idsextou_solicitacao').value, true);
    req.open("POST", "http://localhost:8080/EctareServer" + "/ectare_adm?tela=insereimgpupa&dbteste=false", true);
    // req.open('POST', "https://server.ectarepay.com.br/" + "doradinho_e" + "/ectare_adm?tela=SetUploadDocumentos&dbteste=false&idpessoa=" + idpessoa +
    // "&idtipodocumento=" + idtipodocumento, true);
    // req.setRequestHeader('Authorization', `Bearer ${sessionStorage.token}`, )
    req.send(formData);
}

function preencheResultado(resultado) {


    if (resultado == "waste_pupae") {
        spanresposta.innerHTML = "Waste Pupae"
    } else if (resultado == 'parasitized_pupae') {
        spanresposta.innerHTML = "Parasitized Pupae"
    } else {
        spanresposta.innerHTML = "Erro ao classificar imagem tente novamente"
    }
}