;document.addEventListener('DOMContentLoaded', () => {
  subscribeHashLinks();
  subscribeMobileMenuButtons();
  // todo: activate mobile menu links by scroll position
});

function subscribeHashLinks() {
  const menuElement = document.getElementById('menu');

  document.body.addEventListener('click', event => {
    const link = event.target.getAttribute('href');
    const emptyHashLink = '#';

    if (!link?.startsWith(emptyHashLink) || link === emptyHashLink) return;

    const target = document.getElementById(link.slice(1));
    if (!target) return;

    if (menuElement.classList.contains('opened')) {
      document.body.classList.remove('no-scroll');
      menuElement.classList.remove('opened');
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

function subscribeMobileMenuButtons() {
  const showMenuButton = document.getElementById('show-menu');
  const closeMenuButton = document.getElementById('close-menu');
  const menuElement = document.getElementById('menu');

  showMenuButton.addEventListener('click', () => {
    document.body.classList.add('no-scroll');
    menuElement.classList.add('opened');
  });

  closeMenuButton.addEventListener('click', () => {
    document.body.classList.remove('no-scroll');
    menuElement.classList.remove('opened');
  });
}
