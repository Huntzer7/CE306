// Navbar scroll
const nav = document.getElementById('mainNav');
if (Nav) {
    window.addEventListener('scroll' , () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// Filter tabs (Prices page)
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// FAB pulse on load
const fab = document.querySelector('.fab-book');
if (fab) {
    setTimeout(() => {
        fab.style.transition = 'transform .3, box-shadow .3s';
        fab.style.transform = 'scale(1.08)';
        setTimeout(() => {fab.style.tranform = '';}, 300); 
    }, 1500);
}