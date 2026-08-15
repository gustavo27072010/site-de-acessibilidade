document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. LÓGICA DA BARRA DE BUSCA EM TEMPO REAL
     ========================================================================== */
  const searchBtnToggle = document.getElementById('search-btn-toggle');
  const searchBarContainer = document.getElementById('search-bar-container');
  const searchInput = document.getElementById('search-input');
  const searchCloseBtn = document.getElementById('search-close-btn');

  // Seleciona todos os cards e elementos interativos pesquisáveis no portal
  const searchableItems = document.querySelectorAll(
    '.cards-grid .card, .agenda-item, .news-card, .help-card, .programa-card'
  );

  // Exibir ou oculta a caixa de texto de busca
  searchBtnToggle.addEventListener('click', () => {
    const isHidden = searchBarContainer.classList.contains('hidden');
    
    if (isHidden) {
      searchBarContainer.classList.remove('hidden');
      searchBtnToggle.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    } else {
      closeSearch();
    }
  });

  // Fechar no botão X
  searchCloseBtn.addEventListener('click', closeSearch);

  // Filtragem dinâmica dos cards conforme digitação
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    searchableItems.forEach((item) => {
      const itemText = item.textContent.toLowerCase();

      if (itemText.includes(searchTerm)) {
        item.classList.remove('search-hidden');
      } else {
        item.classList.add('search-hidden');
      }
    });
  });

  // Função para resetar e fechar a busca
  function closeSearch() {
    searchBarContainer.classList.add('hidden');
    searchBtnToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    
    searchableItems.forEach((item) => {
      item.classList.remove('search-hidden');
    });
  }

  /* ==========================================================================
     2. PAINEL E RECURSOS DE ACESSIBILIDADE
     ========================================================================== */
  const toggleAccMenuBtn = document.getElementById('toggle-acc-menu');
  const accMenu = document.getElementById('acc-menu');
  const btnCloseAcc = document.getElementById('btn-close-acc');
  
  const themeToggleHeader = document.getElementById('theme-toggle-header');
  const btnThemeLight = document.getElementById('btn-theme-light');
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const btnHighContrast = document.getElementById('btn-high-contrast');
  
  const btnIncreaseFont = document.getElementById('btn-increase-font');
  const btnDecreaseFont = document.getElementById('btn-decrease-font');
  const btnLetterSpacing = document.getElementById('btn-letter-spacing');
  const btnDyslexicFont = document.getElementById('btn-dyslexic-font');
  const btnResetAcc = document.getElementById('btn-reset-acc');

  let currentFontSize = 100; // Porcentagem do tamanho da fonte
  let isCustomSpacing = false;

  // Abrir / Fechar menu de acessibilidade
  toggleAccMenuBtn.addEventListener('click', () => {
    accMenu.classList.toggle('hidden');
  });

  btnCloseAcc.addEventListener('click', () => {
    accMenu.classList.add('hidden');
  });

  // Alternador do tema via botão rápido no cabeçalho
  themeToggleHeader.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Botões de tema no menu flutuante
  btnThemeLight.addEventListener('click', () => setTheme('light'));
  btnThemeDark.addEventListener('click', () => setTheme('dark'));
  btnHighContrast.addEventListener('click', () => setTheme('high-contrast'));

  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggleHeader.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Aumentar/Diminuir Fonte
  btnIncreaseFont.addEventListener('click', () => {
    if (currentFontSize < 140) {
      currentFontSize += 10;
      document.documentElement.style.setProperty('--font-scale', `${currentFontSize}%`);
    }
  });

  btnDecreaseFont.addEventListener('click', () => {
    if (currentFontSize > 80) {
      currentFontSize -= 10;
      document.documentElement.style.setProperty('--font-scale', `${currentFontSize}%`);
    }
  });

  // Aumentar Espaçamento
  btnLetterSpacing.addEventListener('click', () => {
    isCustomSpacing = !isCustomSpacing;
    document.documentElement.style.setProperty(
      '--letter-spacing', 
      isCustomSpacing ? '0.12em' : 'normal'
    );
  });

  // Fonte para Dislexia
  btnDyslexicFont.addEventListener('click', () => {
    document.body.classList.toggle('dyslexic-font');
  });

  // Restaurar Padrões de Acessibilidade
  btnResetAcc.addEventListener('click', () => {
    setTheme('light');
    currentFontSize = 100;
    isCustomSpacing = false;
    document.documentElement.style.setProperty('--font-scale', '1rem');
    document.documentElement.style.setProperty('--letter-spacing', 'normal');
    document.body.classList.remove('dyslexic-font');
  });
});