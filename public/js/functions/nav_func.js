const NAV_OPEN_WIDTH = 300;

const closeNavBar = (nav_cont, nav, nav_arrow) => {
    nav_cont.style.width = '0px';
    nav.style.width ='0px';
    setTimeout(() => {
        Object.assign(nav_arrow.style, {
            transform: 'scaleX(-1)', 
            borderRadius: '0 0 0 15px'
        });
    }, 800);
}

const openNavBar = (nav_cont, nav, nav_arrow) => {
    nav_cont.style.width = `${NAV_OPEN_WIDTH}px`;
    nav.style.width = `${NAV_OPEN_WIDTH}px`;
    setTimeout(() => {
        Object.assign(nav_arrow.style, {
            transform: 'scaleX(1)', 
            borderRadius: '0 0 15px 0'
        });
    }, 800);
}

export { closeNavBar, openNavBar }