const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const year = document.getElementById('year');
const tabButtons = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    menuPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === category);
    });
  });
});