document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const body = document.body;
  const toggleAccBtn = document.getElementById('toggle-acc-menu');
  const closeAccBtn = document.getElementById('btn-close-acc');
  const accMenu = document.getElementById('acc-menu');
  const themeToggleHeader = document.getElementById('theme-toggle-header');

  // Botões de Acessibilidade
  const btnThemeLight = document.getElementById('btn-theme-light');
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const btnHighContrast = document.getElementById('btn-high-contrast');
  const btnIncreaseFont = document.getElementById('btn-increase-font');
  const btnDecreaseFont = document.getElementById('btn-decrease-font');
  const btnLetterSpacing = document.getElementById('btn-letter-spacing');
  const btnDyslexicFont = document.getElementById('btn-dyslexic-font');
  const btnResetAcc = document.getElementById('btn-reset-acc');

  // Alternar Menu Flutuante
  toggleAccBtn.addEventListener('click', () => accMenu.classList.toggle('hidden'));
  closeAccBtn.addEventListener('click', () => accMenu.classList.add('hidden'));

  // 1. GERENCIAMENTO DE TEMAS (CLARO / ESCURO)
  function setTheme(themeName) {
    body.setAttribute('data-theme', themeName);
    body.classList.remove('high-contrast'); // Remove alto contraste ao trocar tema regular
    themeToggleHeader.textContent = themeName === 'dark' ? '☀️' : '🌙';
  }

  themeToggleHeader.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  btnThemeLight.addEventListener('click', () => setTheme('light'));
  btnThemeDark.addEventListener('click', () => setTheme('dark'));

  // 2. MODO ALTO CONTRASTE (PARA BAIXA VISÃO EXTREMA)
  btnHighContrast.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
  });

  // 3. CONTROLE DE TAMANHO DE FONTE (BAIXA VISÃO)
  let currentFontSize = 16;
  btnIncreaseFont.addEventListener('click', () => {
    if (currentFontSize < 26) {
      currentFontSize += 2;
      document.documentElement.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnDecreaseFont.addEventListener('click', () => {
    if (currentFontSize > 12) {
      currentFontSize -= 2;
      document.documentElement.style.fontSize = `${currentFontSize}px`;
    }
  });

  // 4. ESPAÇAMENTO DE TEXTO (BAIXA VISÃO / LEITURA)
  btnLetterSpacing.addEventListener('click', () => {
    body.classList.toggle('large-spacing');
  });

  // 5. FONTE PARA DISLEXIA
  btnDyslexicFont.addEventListener('click', () => {
    body.classList.toggle('dyslexia-font');
  });

  // 6. RESTAURAR CONFIGURAÇÕES PADRÃO
  btnResetAcc.addEventListener('click', () => {
    currentFontSize = 16;
    document.documentElement.style.fontSize = '16px';
    body.setAttribute('data-theme', 'light');
    body.classList.remove('high-contrast', 'dyslexia-font', 'large-spacing');
    themeToggleHeader.textContent = '🌙';
  });
});