
let isRenderRunning = false;
let isApplyingRunning = false;

// filters variables
let filtersObj = {
    brightness: 0,
    vibrance: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    hue: 0,
    sepia: 0,
    gamma: 1,
    clip: 0,
    sharpen: 0,
    stackBlur: 0
};

//effects variables
let lastEffect = undefined;
let newEffect = undefined;
let lastEffectBtn = undefined;


document.addEventListener('click', e => {

    if (e.target.classList.contains('revert-rendering')) {
        for (filter in filtersObj) {
            filtersObj[filter] = 0;
        }
        filtersObj['gamma'] = 1;
    } else if (!isRenderRunning && (e.target.classList.contains('filter-btn') || e.target.classList.contains('effect-btn'))) {

        if (e.target.classList.contains('filter-btn')) {
            let filterName = e.target.classList[4];
            switch(filterName) {
                case 'gamma(+)':        filtersObj['gamma'] += 0.1;
                                        break;
                case 'gamma(-)':        filtersObj['gamma'] += 0.1;
                                        break;
                case 'stackBlur(+)':    filtersObj['stackBlur'] += 1;
                                        break;
                case 'stackBlur(+)':    filtersObj['stackBlur'] += 1;
                                        break;
                default:                filtersObj[filterName.match(/[a-z]+/)[0]] += 5;
            }
        } else if (e.target.classList.contains('effect-btn')) {
            newEffect = e.target.classList[4];
            if (newEffect === lastEffect){
                return;
            }
            lastEffect = newEffect;
        }

        Caman('#canvas-block', lastImg, function() {

            isRenderRunning = true;
            this.revert(false);

            switch (newEffect) {
                case 'vintage':         this.vintage();
                                        break;
                case 'lomo':            this.lomo();
                                        break;
                case 'clarity':         this.clarity();
                                        break;
                case 'sinCity':         this.sinCity();
                                        break;
                case 'sunrise':         this.sunrise();
                                        break;
                case 'crossProcess':    this.crossProcess();
                                        break;
                case 'orangePeel':      this.orangePeel();
                                        break;
                case 'love':            this.love();
                                        break;
                case 'grungy':          this.grungy();
                                        break;
                case 'jarques':         this.jarques();
                                        break;
                case 'oldBoot':         this.oldBoot();
                                        break;
                case 'glowingSun':      this.glowingSun();
                                        break;
                case 'hazyDays':        this.hazyDays();
                                        break;
                case 'herMajesty':      this.herMajesty();
                                        break;
                case 'nostalgia':       this.nostalgia();
                                        break;
                case 'hemingway':       this.hemingway();
                                        break;
                case 'concentrate':     this.concentrate();
                                        break;
            }

            this.brightness(filtersObj.brightness)
            .vibrance(filtersObj.vibrance)
            .contrast(filtersObj.contrast)
            .saturation(filtersObj.saturation)
            .exposure(filtersObj.exposure)
            .hue(filtersObj.hue)
            .sepia(filtersObj.sepia)
            .gamma(filtersObj.gamma)
            .clip(filtersObj.clip)
            .sharpen(filtersObj.sharpen)
            .stackBlur(filtersObj.stackBlur)
            .render(() => {
                e.target.style.opacity = '0.7';
                if (lastEffectBtn) {
                    lastEffectBtn.style.opacity = '1';
                }
                lastEffectBtn = e.target;
                isRenderRunning = false;
            });
        });

    }
});


document.getElementById('clear-edit-btn').addEventListener('click', e => {
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');
    ctx.restore();

    Caman('#canvas-block', lastImg, function() {
        isRenderRunning = true;
        this.revert(false);
        this.render(() => {
            isRenderRunning = false;
        });
    });
    
    if (lastEffectBtn) {
        lastEffectBtn.style.opacity = '1';
        lastEffect = undefined;
        lastEffectBtn = undefined;
    }
});

document.getElementById('cancel-edit-btn').addEventListener('click', e => {
    let editor = document.querySelector('.editor');
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');
    ctx.restore();

    canvas.removeAttribute('data-caman-id');
    editor.style.visibility = 'hidden';
    canvas.style.visibility = 'hidden';
    lastImg.style.visibility = 'visible';
    document.querySelector('.switch-frame').style.visibility = 'visible';
    if (lastEffectBtn) {
        lastEffectBtn.style.opacity = '1';
        lastEffect = undefined;
        lastEffectBtn = undefined;
    }
});

document.getElementById('apply-edit-btn').addEventListener('click', e => {
    if (isApplyingRunning) {
        alert("Can't apply while processing previews changes");
        return;
    }

    let editor = document.querySelector('.editor');
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');
    ctx.restore();

    // change img angle and position
    lastImg.style.width = canvas.width + 'px';
    lastImg.style.height = canvas.height + 'px';
    lastImg.style.marginLeft = canvas.style.marginLeft; 
    lastImg.style.marginTop = canvas.style.marginTop;

    let canvasURL = canvas.toDataURL();
    lastImg.src = canvasURL;

    let fileName = lastImg.id;
    let contentType = canvasURL.match(/(?<=:).+(?=;)/)[0];
    let imageBase64 = canvasURL.match(/(?<=,).+/)[0];
    let mediaData = {
        fileName,
        contentType,
        imageBase64
    };

    isApplyingRunning = true;
    let startTime = Date.now();
    $.ajax({
        url: '/update-media',
        method: 'POST',
        data: { mediaData },
        contentType: 'application/x-www-form-urlencoded',
        success: res => {
            let timeToUpdateInSec = (Date.now() - startTime) / 1000;
            let msg = res.serverMsgArr[0];
            let pTag = document.createElement('p');
            pTag.className = 'upload-msg-paragraph';
            pTag.innerText = `${msg}[${timeToUpdateInSec}sec]`;
            if (msg.includes('successfully')) {
                pTag.style.color = 'green';
            }
            else {
                pTag.style.color = 'red';
            }
            document.querySelector('.card-body').appendChild(pTag);
            isApplyingRunning = false;
        },
        error: err => {
            console.log(err);
            isApplyingRunning = false;
        }
    });

    // change the DOM
    canvas.removeAttribute('data-caman-id');
    editor.style.visibility = 'hidden';
    canvas.style.visibility = 'hidden';
    lastImg.style.visibility = 'visible';
    document.querySelector('.switch-frame').style.visibility = 'visible';
    if (lastEffectBtn) {
        lastEffectBtn.style.opacity = '1';
        lastEffect = undefined;
        lastEffectBtn = undefined;
    }
});

document.getElementById('crop-img-btn').addEventListener('click', e => {
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');
    ctx.restore();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 50;
    canvas.height = 50;
    ctx.drawImage(lastImg, 0, 0, 50, 50);
});

document.getElementById('img-resize-range').oninput = e => {
    let canvas = document.querySelector('.canvas-block');
    let ctx = canvas.getContext('2d');

    let sliderVal = parseInt(e.target.value) / 50;
    let imgResizeWidth = lastImg.naturalWidth * sliderVal;
    let imgResizeHeight = lastImg.naturalHeight * sliderVal;

    canvas.width = imgResizeWidth;
    canvas.height = imgResizeHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(lastImg, 0, 0, imgResizeWidth, imgResizeHeight);

    Object.assign(canvas.style, {
        left: '50%',
        top: '50%',
        marginLeft: '-' + Math.floor(imgResizeWidth / 2) + 'px',
        marginTop: '-' + Math.floor(imgResizeHeight / 2) + 'px'
    });
};