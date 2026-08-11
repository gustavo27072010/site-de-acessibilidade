document.addEventListener('DOMContentLoaded', () => {
  // Referências do Menu de Acessibilidade Flutuante
  const toggleAccBtn = document.getElementById('toggle-acc-menu');
  const accMenu = document.getElementById('acc-menu');

  // Botões de Ação
  const btnIncreaseFont = document.getElementById('btn-increase-font');
  const btnDecreaseFont = document.getElementById('btn-decrease-font');
  const btnHighContrast = document.getElementById('btn-high-contrast');
  const btnDyslexicFont = document.getElementById('btn-dyslexic-font');
  const btnResetAcc = document.getElementById('btn-reset-acc');

  // Alternar Exibição do Menu
  toggleAccBtn.addEventListener('click', () => {
    accMenu.classList.toggle('hidden');
  });

  // Controle de Tamanho da Fonte
  let currentFontSize = 16;

  btnIncreaseFont.addEventListener('click', () => {
    if (currentFontSize < 24) {
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

  // Modo Alto Contraste
  btnHighContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // Fonte para Dislexia
  btnDyslexicFont.addEventListener('click', () => {
    document.body.classList.toggle('dyslexia-font');
  });

  // Restaurar Configurações Padrão
  btnResetAcc.addEventListener('click', () => {
    currentFontSize = 16;
    document.documentElement.style.fontSize = '16px';
    document.body.classList.remove('high-contrast');
    document.body.classList.remove('dyslexia-font');
  });
});