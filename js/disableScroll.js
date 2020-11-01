const disableScroll = function() {
    document.body.disScroll = window.scrollY;

    const scrollWidth = window.innerWidth - document.body.offsetWidth;

    document.body.style.cssText = `
        overflow: hidden;
        width: 100%;
        top: ${-window.scrollY}px;
        left: 0;
        padding-right: ${scrollWidth}px;
        position: fixed;
        height: 100vh;
    `;
}

const enableScroll = function() {
    document.body.style.cssText = ''; 
    window.scroll({top: document.body.disScroll});
}

export {disableScroll, enableScroll};