document.body.addEventListener('click', event => {
    const link = event.target.getAttribute('href');
    if (!link?.startsWith('#')) return;

    const target = document.getElementById(link.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
});
