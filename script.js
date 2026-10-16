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

const normalize = text => text.replace(/\s+/g, ' ').trim();
const translations = new Map(window.tropiTranslations);
const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
  const original = normalize(node.textContent);
  const english = window.tropiEnglishFixes[original] || original;
  if (translations.has(english)) textNodes.push({ node, english });
  else if (original.includes('Tropi Greek. Tropical flavor')) textNodes.push({ node, english: ' Tropi Greek. Tropical flavor with a Greek twist.', footer: true });
}
const imageLabels = [...document.querySelectorAll('img')].map(node => ({node, english: window.tropiEnglishFixes[node.alt] || node.alt}));
let language = 'es';
let craving = 'wraps';
const picks = {
  wraps: ['Chicken Pita Wrap', 'Grilled chicken, fresh toppings and house sauce wrapped in warm pita.', 'img/pita-pollo.png', 'Chicken pita wrap from Tropi Greek'],
  snacks: ['Layered Nachos', 'Loaded nachos with toppings, cheese and house-made spicy red sauce.', 'img/tropi-nachos.png', 'Layered nachos from Tropi Greek'],
  drinks: ['Frappe selection', 'Fruity and creamy frappes with Oreo, Nutella and more to cool you down.', 'img/tropi-fraps.png', 'Tropi Greek frappe selection']
};
const translate = text => language === 'es' ? (translations.get(text) || text) : text;
function renderCraving() {
  if (!document.getElementById('cravingTitle')) return;
  const [title, description, src, alt] = picks[craving];
  document.getElementById('cravingTitle').textContent = translate(title);
  document.getElementById('cravingDescription').textContent = translate(description);
  const image = document.getElementById('cravingImage');
  image.src = src;
  image.alt = translate(alt);
  document.getElementById('cravingLink').href = `menu.html?category=${craving}#menu`;
  document.querySelectorAll('[data-craving]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.craving === craving)));
}
function setLanguage(next) {
  language = next === 'en' ? 'en' : 'es';
  document.documentElement.lang = language;
  textNodes.forEach(({node, english, footer}) => {
    node.textContent = footer ? (language === 'es' ? ' Tropi Greek. Sabor tropical con un toque griego.' : english) : translate(english);
  });
  imageLabels.forEach(({node,english}) => { node.alt = translate(english); });
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  navToggle.setAttribute('aria-label', language === 'es' ? 'Abrir o cerrar menú' : 'Toggle menu');
  document.querySelector('.craving-options')?.setAttribute('aria-label', language === 'es' ? 'Elige tu antojo' : 'Choose your craving');
  const pageTitle = document.body.dataset.page === 'menu' ? 'Full menu' : document.body.dataset.page === 'about' ? 'About Tropi Greek' : 'Tropical flavor with a Greek twist';
  document.title = 'Tropi Greek | ' + translate(pageTitle);
  document.querySelector('meta[name="description"]').content = language === 'es' ? 'Tropi Greek en Aguadilla: pitas, burgers, nachos, quesadillas, ensaladas, frappés y cócteles con sabor boricua e inspiración griega.' : 'Tropi Greek in Aguadilla: pita wraps, burgers, nachos, quesadillas, salads, frappes and cocktails with Puerto Rican flavor and Greek inspiration.';
  renderCraving();
  try { localStorage.setItem('tropi-language', language); } catch {}
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
document.querySelectorAll('[data-craving]').forEach(button => button.addEventListener('click', () => { craving = button.dataset.craving; renderCraving(); }));
const requestedCategory = new URLSearchParams(window.location.search).get('category');
const requestedTab = [...tabButtons].find(button => button.dataset.category === requestedCategory);
requestedTab?.click();
let savedLanguage;
try { savedLanguage = localStorage.getItem('tropi-language'); } catch {}
setLanguage(savedLanguage || 'es');
