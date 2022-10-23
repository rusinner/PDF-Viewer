//declaring variables
const url = '../docs/Asimov_the_foundation.pdf';
const zoomButton = document.getElementById('zoom')
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');

let pdfDoc = null,
pageNum = 1,
pageIsRendering = false,
pageNumIsPending = null;

const scale = 1.8,
      canvas = document.querySelector('#pdf-render'),
      ctx = canvas.getContext('2d');

//  Render the page

const renderPage = num => {
pageIsRendering = true;

//get the page
pdfDoc.getPage(num).then(page => {
const viewport = page.getViewport({scale});
canvas.height = viewport.height;
canvas.width = viewport.width;

const renderCtx = {
    canvasContext:ctx,
    viewport
}

page.render(renderCtx).promise.then(() => {
    pageIsRendering = false;

    if(pageNumIsPending !== null){
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
    }
});

//Output current Page
document.querySelector('#page-num').textContent = num;
});
}

//Check for PAges rendering

const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num;

    }else{
        renderPage(num);
    }
}

//Show Prev Page
const showPrevPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

//Show Next Page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}




//get the document

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
pdfDoc =pdfDoc_;
document.querySelector('#page-count').textContent = pdfDoc.numPages;

renderPage(pageNum);

})
.catch(err => {
    //Display Error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div,canvas);
    //remove top bar
    document.querySelector('.top-bar').getElementsByClassName.display = 'none';

});

//Button Events

document.querySelector('#prev-page').addEventListener('click',showPrevPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);