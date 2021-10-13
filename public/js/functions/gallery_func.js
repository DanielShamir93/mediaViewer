const AMPLIFY = 5;
const MIN_IMG_WIDTH = 180;
const MIN_IMG_HEIGHT = MIN_IMG_WIDTH - 30;

// return true if the image 'img' is on show, false if not
const isImgOnShow = img => {
    const properties = window.getComputedStyle(img);
    let imgPos = properties.position;
    return imgPos === 'fixed';
}

// return true if no image is on show, false if there is
const isNoImgOnShow = imgArr => {
    return imgArr.every(img => {
        const properties = window.getComputedStyle(img);
        let imgPos = properties.position;
        return imgPos === 'relative';
    })
}

// zoom images in the gallery
const setAllImgsSize = sliderVal => {
    document.querySelectorAll('.img').forEach( elem => {
        if (elem.style.position !== 'fixed') {
            elem.style.width = MIN_IMG_WIDTH + AMPLIFY * sliderVal + 'px';
            elem.style.height = MIN_IMG_HEIGHT + AMPLIFY * sliderVal + 'px';
        }
    })
}

// zoom frames in the gallery
const setAllFramesSize = sliderVal => {
    document.querySelectorAll('.frame').forEach( elem => {
        if (elem.style.position !== 'fixed') {
            elem.style.width = MIN_IMG_WIDTH + AMPLIFY * sliderVal + 'px';
            elem.style.height = MIN_IMG_HEIGHT + AMPLIFY * sliderVal + 'px';
        }
    })
}

// convert nodeList of images to array
const getImgsAsArr = () => {
    let imgNodeList = document.querySelectorAll('.img');
    return Array.prototype.slice.call(imgNodeList);
}

// prompt image to be on show
const imgShow = img => {
    let imgArr = getImgsAsArr();
    let imgWidth = 0;
    let imgHeight = 0;
    let sizeRatio = 0;
    // if there are images in gallery
    if (imgArr.length > 0) {
        // state the ratio between the width and height of the image
        if (img.naturalWidth <= img.naturalHeight) {
            sizeRatio = img.naturalWidth / img.naturalHeight;
            imgWidth = (window.innerHeight / 1.5) * sizeRatio;
            imgHeight = window.innerHeight / 1.5;
        } else {
            sizeRatio = img.naturalHeight / img.naturalWidth;
            imgHeight = (window.innerWidth / 2) * sizeRatio;
            imgWidth = window.innerWidth / 2;
        }
        // prompt image on show interface and style
        document.querySelector('.switch-frame').style.visibility = 'visible';
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
        })
        let removeImgBtn = document.getElementById('remove-img-btn');
        Object.assign(removeImgBtn.style, {
            pointerEvents: 'auto',
            opacity: '1'
        })
        // turn off lights
        if (isLightOn()) {
            document.getElementById('lights-switch-checkbox').click();
        }
    }
}

// hide image from show state
const imgBackToGallery = (img, eventTarget) => {
    // get the value of the zoom slider
    let sliderVal = document.getElementById('img-size-range').value;
    // get image on show back to the gallery
    Object.assign(img.style, {
        position: 'relative',
        left: '0',
        top: '0',
        marginLeft: '0',
        marginTop: '0',
        zIndex: '0',
        width: MIN_IMG_WIDTH + sliderVal * AMPLIFY + 'px',
        height: MIN_IMG_HEIGHT + sliderVal * AMPLIFY + 'px',
        transform: 'perspective(800px) rotateY(20deg) rotate(0deg)'
    })
    // if the element clicked is the image on show => set no image on show interface
    if (eventTarget.id !== 'prev-frame-btn' && eventTarget.id !== 'next-frame-btn') {
        document.querySelector('.switch-frame').style.visibility = 'hidden';
        document.querySelector('.img-show-num').textContent = '';
        // turn on lights
        if (!isLightOn()) {
            document.getElementById('lights-switch-checkbox').click();
        }
        // prevent the remove image button
        let removeImgBtn = document.getElementById('remove-img-btn');
        Object.assign(removeImgBtn.style, {
            pointerEvents: 'none',
            opacity: '0.4'
        });
    }
}

// return if the light are on or not
const isLightOn = () => {
    return document.getElementById('lights-switch-checkbox').checked;
}


export { isImgOnShow, isNoImgOnShow, setAllImgsSize, setAllFramesSize, getImgsAsArr, imgShow, imgBackToGallery }