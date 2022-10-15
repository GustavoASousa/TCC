var actionButton = document.querySelectorAll('.action-button button')
var hiddenUpload = document.querySelector('.action-button .hidden-upload')
var image_workspaceSpan = document.querySelector('.image-workspace span')
var preview_containerSpan = document.querySelector('.preview-container span')
var zoom = document.querySelectorAll('.side-control-page-1 .zoom svg')
var setas = document.querySelectorAll('.side-control-page-1 .move svg')



// upload image
actionButton[0].onclick = () => hiddenUpload.click()
hiddenUpload.onchange = () => {
    // apdate on new file selected issue removed here
    document.querySelector('.image-workspace').innerHTML = `<img src="" alt="">`
    var image_workspace = document.querySelector('.image-workspace img')

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
            setas[0].onclick = () => cropper.move(0, -1)
            setas[1].onclick = () => cropper.move(-1, 0)
            setas[2].onclick = () => cropper.move(1, 0)
            setas[3].onclick = () => cropper.move(0, 1)

          

            // Enviar imagem para o tensorflow
            actionButton[1].onclick = () => {
                actionButton[1].innerText = '...'
                cropper.getCroppedCanvas({ width: 100, heigth: 200 }).toBlob((blob) => {
                    var downloadUrl = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = downloadUrl
                    a.download = 'cropped-image.jpg' // output image name
                    // a.click()
                    // actionButton[1].innerText = 'Download'
                })
            }
        }
    }

    var cropper = new Cropper(image_workspace, options)
}