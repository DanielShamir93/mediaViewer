import { isImgOnShow, isNoImgOnShow, setAllImgsSize, setAllFramesSize, getImgsAsArr, imgShow, imgBackToGallery } from '../functions/gallery_func.js'

let lastImg = null;    // the image that was clicked last
let ImgOnShowDegrees = 0;

// show or hide image
document.addEventListener('click', e => {
    let element = e.target;
    // check that the event is an image and not in editable mode
    if (element.className === 'img' && !e.ctrlKey) {
        let imgPos = window.getComputedStyle(element).position;
        // if image clicked is currently on show
        if (lastImg !== null && lastImg !== element) {
            imgBackToGallery(lastImg, e.target);
        }
        // show or hide image depend on the image position
        switch (imgPos) {
            case 'relative':    imgShow(element);
                                // make the image on show editable
                                toMarkImgArr = [];
                                toMarkImgArr.push(element);
                                break;
            case 'fixed':       imgBackToGallery(element, element);
                                break;
        }
        lastImg = element;
    }
})

// slider to zoom the frames in gallery
document.getElementById('img-size-range').oninput = e => {
    // get the slider current value
    let sliderVal = parseInt(e.target.value);
    // set the size of all images in gallery
    setAllImgsSize(sliderVal);
    // set the size of all frames in gallery
    setAllFramesSize(sliderVal);
    // show the user the percentage of zooming in the gallery
    document.getElementById('img-size-percentage').innerText = sliderVal + 10 + '%';
}


// move frames while image on show
document.addEventListener('click', e => {
    const element = e.target;
    // if clicked move-frame element
    if (element.id === 'prev-frame-btn' || element.id === 'next-frame-btn') {
        // get the images as nodeList and convert to an array
        let imgArr = getImgsAsArr();
        let currImgIndex = imgArr.indexOf(lastImg);
        let currImg = null;
        // if preview button clicked
        if (element.id === 'prev-frame-btn') {
            let elem = imgArr[currImgIndex - 1];
            currImg = elem ? elem : imgArr[imgArr.length - 1];
            imgShow(currImg);
            // make the image on show editable
            toMarkImgArr = [];
            toMarkImgArr.push(currImg);
        } else {    // next button clicked
            let elem = imgArr[currImgIndex + 1];
            currImg = elem ? elem : imgArr[0];
            if (currImg === null) {
                return;
            }
            imgShow(currImg);
            // make the image on show editable
            toMarkImgArr = [];
            toMarkImgArr.push(currImg);
        }
        // if image clicked is not the last one clicked
        if (currImg !== lastImg) {
            imgBackToGallery(lastImg, element);
            lastImg = currImg;
        }
    }
})

// lights switch button
document.getElementById('lights-switch-checkbox').addEventListener('click', e => {
    let lightsOn = document.getElementById('lights-switch-checkbox').checked;
    if (lightsOn) {
        document.querySelector('body').style.backgroundColor = 'rgb(217, 227, 241)';
        document.querySelector('.gallery_wrapper').style.backgroundColor = 'white';
    }
    else {
        document.querySelector('body').style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        document.querySelector('.gallery_wrapper').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
});


let toMarkImgArr = [];
document.addEventListener('mousedown', e => {
    let img = e.target;
    if (img.className === 'img') {
        const imgProperties = window.getComputedStyle(img);
        let imgPos = imgProperties.position;
        if (imgPos === 'relative') {
            if (e.ctrlKey) {
                if (toMarkImgArr.includes(img)) {
                    img.style.opacity = '1';
                    toMarkImgArr = toMarkImgArr.filter(elem => {
                        return elem !== img;
                    });
                } else {
                    document.getElementById(img.id).style.opacity = '0.4';
                    toMarkImgArr.push(img);
                }
            }
            else if (toMarkImgArr.length > 0 && e.target.id !== 'remove-img-btn') {
                toMarkImgArr.forEach(elem => {
                    elem.style.opacity = '1';
                });
                toMarkImgArr = [];
            }
        }
    }
    else if (toMarkImgArr.length > 0 && e.target.id !== 'remove-img-btn') {
        toMarkImgArr.forEach(elem => {
            elem.style.opacity = '1';
        });
        toMarkImgArr = [];
    }

    // remove-img-btn state
    let oldGalleryArr = getImgsAsArr();
    let thereIsNoImgOnShow = oldGalleryArr.every(img => {
        if (isImgOnShow(img)) {
            return false;
        } else {
            return true;
        }
    });

    let removeImgBtn = document.getElementById('remove-img-btn');
    if (toMarkImgArr.length > 0) {
        Object.assign(removeImgBtn.style, {
            pointerEvents: 'auto',
            opacity: '1'
        });
    } else if (!e.target.classList.contains('control-btn') && thereIsNoImgOnShow){
        Object.assign(removeImgBtn.style, {
            pointerEvents: 'none',
            opacity: '0.4'
        });
    }
});

$('#remove-img-btn').click(e => {
    let idArr = [];
    toMarkImgArr.forEach(img => {
        idArr.push(img.id);
    });

    let startTime = Date.now();
    $.ajax({
        url: '/remove-media',
        method: 'POST',
        data: { 
            idArr 
        },
        contentType: 'application/x-www-form-urlencoded',
        success: res => {
            let oldGalleryArr = getImgsAsArr();

            let thereIsNoImgOnShow = oldGalleryArr.every(img => {
                if (isImgOnShow(img)) {
                    return false;
                } else {
                    return true;
                }
            });

            if (!thereIsNoImgOnShow) {
                document.getElementById('next-frame-btn').click();
            }

            oldGalleryArr.forEach(img => {
                if (!res.updatedGalleryArr.includes(img.id)) {
                    document.querySelector('.gallery').removeChild(document.getElementById('frame_' + img.id));
                }
            });

            if (!thereIsNoImgOnShow) {
                let imgShowNum = parseInt(document.querySelector('.img-show-num').textContent);
                if (res.updatedGalleryArr.length === 0) {
                    document.querySelector('.switch-frame').style.visibility = 'hidden';
                    document.querySelector('.img-show-num').textContent = '';
                    let lightsOn = document.getElementById('lights-switch-checkbox').checked;
                    if (!lightsOn) {
                        document.getElementById('lights-switch-checkbox').click();
                    }
                    let removeImgBtn = document.getElementById('remove-img-btn');
                    Object.assign(removeImgBtn.style, {
                        pointerEvents: 'none',
                        opacity: '0.4'
                    });
                }
                else if (res.updatedGalleryArr.length <= imgShowNum) {
                    document.querySelector('.img-show-num').textContent = imgShowNum - 1;
                } else {
                    document.querySelector('.img-show-num').textContent = '1';
                }
            }  

            let timeToRemoveInSec = (Date.now() - startTime) / 1000;
            let cardBody = document.querySelector('.card-body');
            while (cardBody.firstChild) {
                cardBody.removeChild(cardBody.lastChild);
            }
            res.serverMsgArr.forEach((msg, index) => {
                let pTag = document.createElement('p');
                pTag.className = 'upload-msg-paragraph';
                if (index === res.serverMsgArr.length - 1) {
                    pTag.innerText = msg + '\n[' + timeToRemoveInSec + 'sec]';
                } else {
                    pTag.innerText = `${msg}`;
                }
                msg.includes('successfully') ? pTag.style.color = 'green' : pTag.style.color = 'red';
                cardBody.appendChild(pTag);
            });
            
        },
        error: err => {
            console.log(err);
        }
    });
});


// animate gallery frames
document.addEventListener('mouseover', e => {
    // if event is an image and not on show
    if (e.target.className === 'img' && !isImgOnShow(e.target)) {
        e.target.style.transform = 'perspective(800px) rotateY(0deg) rotate(0deg)';
    }
})

// animate gallery frames to original state
document.addEventListener('mouseout', e => {
    // if event is an image and not on show
    if (e.target.className === 'img' && !isImgOnShow(e.target)) {
        e.target.style.transform = 'perspective(800px) rotateY(20deg) rotate(0deg)';
    }
})


let slideshowState = null;
// start slide show
document.addEventListener('click', e => {
    const element = e.target;
    const slideshowBtn = document.getElementById('slideshow-btn');
    // if slide show button was clicked
    let imgArr = getImgsAsArr();
    if (element === slideshowBtn) {
        // there are images in gallery
        if (imgArr.length > 0) {
            // slideshow is not running
            if (slideshowState === null) {
                slideshowBtn.style.backgroundImage = 'url(/icons/pause.png)';
                // if there is no images on show => start the slide show from the first image
                if (isNoImgOnShow(imgArr)) {
                    imgArr[0].click();
                }
                // show the next image in gallery
                slideshowState = setInterval( () => {
                    document.getElementById('next-frame-btn').click();
                }, 2000);
            } else {    // exit from slideshow
                slideshowBtn.style.backgroundImage = 'url(/icons/play.png)';
                clearInterval(slideshowState);
                slideshowState = null;
            }
        }
    }
})


document.getElementById('edit-img-btn').addEventListener('click', e => {
    if (lastImg !== null) {
        const properties = window.getComputedStyle(lastImg);
        let lastImgPos = properties.position;

        if (lastImgPos === 'fixed') {
            const canvas = document.querySelector('.canvas-block');
            const ctx = canvas.getContext('2d');
            const editor = document.querySelector('.editor');
            const nav = document.getElementById('nav');

            document.querySelector('.switch-frame').style.visibility = 'hidden';
            lastImg.style.visibility = 'hidden';
            editor.style.visibility = 'visible';
            
            if (nav.clientWidth > 0) {
                document.getElementById('nav-arrow_btn').click();
            }

            Object.assign(canvas.style, {
                visibility: 'visible',
                top: '50%',
                left: '50%',
                marginLeft: '-' + Math.floor(lastImg.naturalWidth / 2) + 'px',
                marginTop: '-' + Math.floor(lastImg.naturalHeight / 2) + 'px'
            });

            canvas.width = lastImg.naturalWidth;
            canvas.height = lastImg.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(lastImg, 0, 0);

        }
    }
    ImgOnShowDegrees = 0;
});



document.getElementById('rotate-img-btn').addEventListener('click', e => {
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');

    // change canvas angle and position
    let w = canvas.width;
    canvas.width = canvas.height;
    canvas.height = w;
    let ml = canvas.style.marginLeft;
    canvas.style.marginLeft = canvas.style.marginTop; 
    canvas.style.marginTop = ml;

    ImgOnShowDegrees = (ImgOnShowDegrees + 90) % 360;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(ImgOnShowDegrees * Math.PI / 180);
    ctx.drawImage(lastImg, -lastImg.naturalWidth / 2, -lastImg.naturalHeight / 2);

});


export { lastImg }