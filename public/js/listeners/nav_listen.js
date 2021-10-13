import { closeNavBar, openNavBar} from '../functions/nav_func.js';
const NAV_OPEN_WIDTH = 300;

// open and close navigation bar
document.getElementById('nav-arrow_btn').addEventListener('click', () => {
    const nav_cont = document.getElementById('nav-cont');
    const nav = document.getElementById('nav');
    const nav_arrow = document.getElementById('nav-arrow_btn');
    // if navigate bar is open
    if (nav_cont.clientWidth === NAV_OPEN_WIDTH) {
        closeNavBar(nav_cont, nav, nav_arrow);
    } else {
        openNavBar(nav_cont, nav, nav_arrow);
    }
})

// allow user to upload files
document.getElementById('upload-input').addEventListener('change', e => {
    let uploadBtn = document.querySelector('.btn.btn-primary');
    let userInput = document.getElementById('upload-input');
    // if files to upload where picked
    if (userInput.value !== '') {
        uploadBtn.style.pointerEvents = 'auto';
    }
});

// server status messages coloring
window.onload = () => {
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


