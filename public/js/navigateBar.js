document.getElementById('nav-arrow_btn').addEventListener('click', () => {
    const nav = document.getElementById('nav');
    const nav_cont = document.getElementById('nav-cont');
    const arrow = document.getElementById('nav-arrow_btn');

    if (nav_cont.clientWidth === 300) {
        nav_cont.style.width = '0px';
        nav.style.width ='0px';
        setTimeout(() => {
            Object.assign(arrow.style, {
                transform: 'scaleX(-1)', 
                borderRadius: '0 0 0 15px'
            });
        }, 800);
    } else {
        nav_cont.style.width = '300px';
        nav.style.width ='300px';
        setTimeout(() => {
            Object.assign(arrow.style, {
                transform: 'scaleX(1)', 
                borderRadius: '0 0 15px 0'
            });
        }, 800);
    }
});

// allow user to upload files
document.getElementById('upload-input').addEventListener('change', e => {
    let uploadBtn = document.querySelector('.btn.btn-primary');
    let userInput = document.getElementById('upload-input');
    if (userInput.value !== '') {
        uploadBtn.style.pointerEvents = 'auto';
    }
});

// uploads status massages
window.onload = () =>{
    let uploadMsgs = document.querySelectorAll('.upload-msg-paragraph');
    if (uploadMsgs) {
        uploadMsgs.forEach(msg => {
            if (msg.textContent.includes('successfully')) {
                msg.style.color = 'green';
            }
            else if (msg.textContent.includes('exists')) {
                msg.style.color = 'red';
            }
        });
    }
};


