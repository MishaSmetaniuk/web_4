function scrollToTop() {
    let position = document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
        window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
        scrollAnimation = setTimeout("scrollToTop()", 10);
    } else {
        clearTimeout(scrollAnimation);
    }
}


window.addEventListener('scroll', function() {
    let scrollButton = document.querySelector('.scroll-top');
    if (window.scrollY > 400) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});
