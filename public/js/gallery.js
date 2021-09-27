let lastImg = undefined;
const AMPLIFY = 5;
const MIN_IMG_WIDTH = 180;
const MIN_IMG_HEIGHT = MIN_IMG_WIDTH - 30;
let ImgOnShowDegrees = 0;

// gallery img class listener
document.addEventListener('click', e => {

    if (e.target.className !== 'img' || e.ctrlKey) {
        return;
    }

    let img = e.target;
    const properties = window.getComputedStyle(img);
    let imgPos = properties.position;

    if (lastImg !== undefined && lastImg !== img) {
        imgBackToGallery(lastImg, e.target);
    }
    lastImg = img;

    if (imgPos === 'relative') {
        imgShow(img);
    } 
    else if (imgPos === 'fixed') {
        imgBackToGallery(img, e.target);
    }

});



// slider listener for showing imgs in full quality
document.getElementById('img-size-range').oninput = e => {
    let sliderVal = parseInt(e.target.value);
    document.querySelectorAll('.img').forEach( elem => {
        if (elem.style.position !== 'fixed') {
            elem.style.width = MIN_IMG_WIDTH + AMPLIFY * sliderVal + 'px';
            elem.style.height = MIN_IMG_HEIGHT + AMPLIFY * sliderVal + 'px';
        } 
    });
    document.querySelectorAll('.frame').forEach( elem => {
        if (elem.style.position !== 'fixed') {
            elem.style.width = MIN_IMG_WIDTH + AMPLIFY * sliderVal + 'px';
            elem.style.height = MIN_IMG_HEIGHT + AMPLIFY * sliderVal + 'px';
        } 
    });

    document.getElementById('img-size-percentage').innerText = sliderVal + 10 + '%';
};

document.addEventListener('click', e => {
    const moveImg = e.target;

    // clicked move-frame element
    if (moveImg.id === 'prev-frame-btn' || moveImg.id === 'next-frame-btn') {
        let imgNodeList = document.querySelectorAll('.img');
        let imgArr = Array.prototype.slice.call(imgNodeList);
        let currImgIndex = imgArr.indexOf(lastImg);

        // preview button
        if (moveImg.id === 'prev-frame-btn') {
            let elem = imgArr[currImgIndex - 1];
            currImg = elem ? elem : imgArr[imgArr.length - 1];
            imgShow(currImg);
        } else {    // next button
            let elem = imgArr[currImgIndex + 1];
            currImg = elem ? elem : imgArr[0];
            if (currImg === null) {
                return;
            }
            imgShow(currImg);
        }

        if (currImg !== lastImg) {
            imgBackToGallery(lastImg, moveImg);
            lastImg = currImg;
        }
    }
});

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

let imgShow = (img) => {
    let imgArr = Array.prototype.slice.call(document.querySelectorAll('.img'));
    let imgWidth = 0;
    let imgHeight = 0;
    let sizeRatio = 0;

    if (img.naturalWidth <= img.naturalHeight) {
        sizeRatio = img.naturalWidth / img.naturalHeight;
        imgWidth = (window.innerHeight / 1.5) * sizeRatio;
        imgHeight = window.innerHeight / 1.5;
    } else {
        sizeRatio = img.naturalHeight / img.naturalWidth;
        imgHeight = (window.innerWidth / 2) * sizeRatio;
        imgWidth = window.innerWidth / 2;
    }

    document.querySelector('.switch-frame').style.visibility = 'visible';
    if (imgArr.length === 0) {
        return;
    }
    document.querySelector('.img-show-num').textContent = imgArr.indexOf(img) + 1;
    Object.assign(img.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        marginLeft: '-' + Math.floor(imgWidth / 2) + 'px',
        marginTop: '-' + Math.floor(imgHeight / 2) + 'px',
        zIndex: '100',
        width: imgWidth + 'px',
        height: imgHeight + 'px',
        transform: 'perspective(800px) rotateY(0deg) rotate(0deg)'
    });
    let removeImgBtn = document.getElementById('remove-img-btn');
    Object.assign(removeImgBtn.style, {
        pointerEvents: 'auto',
        opacity: '1'
    });
    toMarkImgArr = [];
    toMarkImgArr.push(img);
    let lightsOn = document.getElementById('lights-switch-checkbox').checked;
    if (lightsOn) {
        document.getElementById('lights-switch-checkbox').click();
    }
}

let imgBackToGallery = (img, eventTarget) => {
    let imgSliderVal = document.getElementById('img-size-range').value;
    Object.assign(img.style, {
        position: 'relative',
        left: '0',
        top: '0',
        marginLeft: '0',
        marginTop: '0',
        zIndex: '0',
        width: MIN_IMG_WIDTH + imgSliderVal * AMPLIFY + 'px',
        height: MIN_IMG_HEIGHT + imgSliderVal * AMPLIFY + 'px',
        transform: 'perspective(800px) rotateY(20deg) rotate(0deg)'
    });
    if (eventTarget.id !== 'prev-frame-btn' && eventTarget.id !== 'next-frame-btn') {
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
}


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
    let removeImgBtn = document.getElementById('remove-img-btn');
    if (toMarkImgArr.length > 0) {
        Object.assign(removeImgBtn.style, {
            pointerEvents: 'auto',
            opacity: '1'
        });
    } else {
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
    $.ajax({
        url: '/remove-media',
        method: 'POST',
        data: { idArr },
        contentType: 'application/x-www-form-urlencoded',
        success: res => {
            let oldGalleryArr = Array.prototype.slice.call(document.querySelectorAll('.img'));

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

            let cardBody = document.querySelector('.card-body');
            while (cardBody.firstChild) {
                cardBody.removeChild(cardBody.lastChild);
            }
            res.serverMsgArr.forEach(msg => {
                let pTag = document.createElement('p');
                pTag.className = 'upload-msg-paragraph';
                pTag.innerText = msg;
                if (msg.includes('successfully')) {
                    pTag.style.color = 'green';
                }
                else {
                    pTag.style.color = 'red';
                }
                cardBody.appendChild(pTag);
            });
            
        },
        error: err => {
            console.log(err);
        }
    });
});


// animate gallery
document.addEventListener('mouseover', e => {
    if (e.target.className === 'img' && !isImgOnShow(e.target)) {
        e.target.style.transform = 'perspective(800px) rotateY(0deg) rotate(0deg)';
    }
});

document.addEventListener('mouseout', e => {
    if (e.target.className === 'img' && !isImgOnShow(e.target)) {
        const properties = window.getComputedStyle(e.target);
        let imgPos = properties.position;
        if (imgPos === 'relative') {
            e.target.style.transform = 'perspective(800px) rotateY(20deg) rotate(0deg)';
        }
    }
});


let slideshow = 0;
document.getElementById('slideshow-btn').addEventListener('click', e => {    
    let imgArr = Array.prototype.slice.call(document.querySelectorAll('.img'));
    if (imgArr.length === 0) {
        return;
    }
    if (slideshow === 0) {  // slideshow is not running
        if (isNOImgOnShow(imgArr)) {
            imgArr[0].click();
        }
        slideshow = setInterval(() => {
            document.getElementById('next-frame-btn').click();
        }, 2000);
    } else {
        clearInterval(slideshow);
        slideshow = 0;
    }
});

document.addEventListener('click', e => {
    if (e.target.id !== 'slideshow-btn' && e.target.id !== 'next-frame-btn') {
        clearInterval(slideshow);
        slideshow = 0;
    }
});


document.getElementById('edit-img-btn').addEventListener('click', e => {
    if (lastImg !== undefined) {
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


let isImgOnShow = img => {
    const properties = window.getComputedStyle(img);
    let imgPos = properties.position;
    return imgPos === 'fixed';
}

let isNOImgOnShow = imgArr => {
    return imgArr.every(image =>{
        const properties = window.getComputedStyle(image);
        let imgPos = properties.position;
        return imgPos === 'relative';
    });
}

let getOnShowImg = imgArr => {
    return imgArr.filter(image =>{
        const properties = window.getComputedStyle(image);
        let imgPos = properties.position;
        return imgPos === 'fixed';
    })[0];
}

