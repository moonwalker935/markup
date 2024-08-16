;document.addEventListener('DOMContentLoaded', () => {
  handleHashLinks();
  handleMobileMenuButtons();
});

const emptyHashLink = '#';

function handleHashLinks() {
  const menuElement = document.getElementById('menu');

  document.body.addEventListener('click', event => {
    const link = event.target.getAttribute('href');

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

function handleMobileMenuButtons() {
  const showMenuButton = document.getElementById('show-menu');
  const closeMenuButton = document.getElementById('close-menu');
  const menuElement = document.getElementById('menu');
  const menuLinkElements = [...menuElement.getElementsByClassName('nav-link')];
  const sections = [
    'contact',
    'portfolio',
    'features',
    'home',
  ];

  showMenuButton.addEventListener('click', () => {
    document.body.classList.add('no-scroll');
    menuElement.classList.add('opened');

    const visibleSectionId = sections.find(id => isElementVisible(document.getElementById(id)));
    if (!visibleSectionId) return;

    const visibleSectionLinkElement = menuLinkElements.find(el => {
      return el.getAttribute('href').slice(emptyHashLink.length) === visibleSectionId;
    });

    if (!visibleSectionLinkElement) return;

    menuLinkElements.forEach(el => el.classList.remove('active'));
    visibleSectionLinkElement.classList.add('active');
  });

  closeMenuButton.addEventListener('click', () => {
    document.body.classList.remove('no-scroll');
    menuElement.classList.remove('opened');
  });
}

function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  // todo: fix logic
  return rect.top <= 0 || rect.bottom <= windowHeight;
}
