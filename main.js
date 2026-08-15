/**
 * PORTAL DO CIDADÃO - SCRIPT PRINCIPAL
 * Funcionalidades:
 * 1. Pesquisa em tempo real (Filtra notícias e serviços)
 * 2. Filtro por categorias (Pílulas)
 * 3. Barra de acessibilidade (Aumentar/Diminuir Fonte, Contraste, Dislexia, Pausar)
 * 4. Menu responsivo mobile
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SISTEMA DE BUSCA EM TEMPO REAL
     ========================================================================== */
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchStats = document.getElementById('search-results-stats');
  const allCards = document.querySelectorAll('.card');
  const noResultsMsg = document.getElementById('no-results-msg');

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    // Mostrar/Ocultar botão de limpar
    if (query.length > 0) {
      searchClearBtn.classList.remove('hidden');
    } else {
      searchClearBtn.classList.add('hidden');
      searchStats.classList.add('hidden');
    }

    allCards.forEach(card => {
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const text = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      const keywords = card.getAttribute('data-keywords') || '';

      const match = title.includes(query) || text.includes(query) || keywords.includes(query);

      if (match || query === '') {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Atualizar estatísticas de resultado
    if (query.length > 0) {
      searchStats.classList.remove('hidden');
      searchStats.textContent = `Encontrados ${visibleCount} resultado(s) para "${query}"`;
    }

    // Mensagem de nenhum resultado
    if (visibleCount === 0 && query.length > 0) {
      noResultsMsg.classList.remove('hidden');
    } else {
      noResultsMsg.classList.add('hidden');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch();
      searchInput.focus();
    });
  }


  /* ==========================================================================
     2. FILTRO POR CATEGORIAS (PÍLULAS DE ABA)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover classe ativa dos outros
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      const newsCards = document.querySelectorAll('.card-news');
      newsCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'todos' || filterValue === cardCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ==========================================================================
     3. CONTROLE DA BARRA DE ACESSIBILIDADE
     ========================================================================== */
  const accSidebar = document.querySelector('.accessibility-sidebar');
  const accToggleBtn = document.getElementById('acc-toggle-btn');
  const btnFontIncrease = document.getElementById('btn-font-increase');
  const btnFontDecrease = document.getElementById('btn-font-decrease');
  const btnContrast = document.getElementById('btn-contrast');
  const btnPause = document.getElementById('btn-pause');
  const btnDyslexia = document.getElementById('btn-dyslexia');
  const btnReset = document.getElementById('btn-reset');
  const fontDots = document.querySelectorAll('.acc-dots .dot');

  let currentFontSizeLevel = 0; // 0 normal, 1, 2, 3
  const fontSizes = ['16px', '18px', '20px', '22px'];

  // Recolher / Expandir Painel
  if (accToggleBtn) {
    accToggleBtn.addEventListener('click', () => {
      accSidebar.classList.toggle('collapsed');
      accToggleBtn.textContent = accSidebar.classList.contains('collapsed') ? '‹' : '›';
    });
  }

  // Aumentar Fonte
  if (btnFontIncrease) {
    btnFontIncrease.addEventListener('click', () => {
      if (currentFontSizeLevel < fontSizes.length - 1) {
        currentFontSizeLevel++;
        updateFontSize();
      }
    });
  }

  // Diminuir Fonte
  if (btnFontDecrease) {
    btnFontDecrease.addEventListener('click', () => {
      if (currentFontSizeLevel > 0) {
        currentFontSizeLevel--;
        updateFontSize();
      }
    });
  }

  function updateFontSize() {
    document.documentElement.style.fontSize = fontSizes[currentFontSizeLevel];
    fontDots.forEach((dot, index) => {
      if (index <= currentFontSizeLevel) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Alternar Contraste
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      btnContrast.classList.toggle('active');
    });
  }

  // Pausar Animações
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      document.body.classList.toggle('pause-animations');
      btnPause.classList.toggle('active');
    });
  }

  // Modo Dislexia
  if (btnDyslexia) {
    btnDyslexia.addEventListener('click', () => {
      document.body.classList.toggle('font-dyslexia');
      btnDyslexia.classList.toggle('active');
    });
  }

  // Resetar Acessibilidade
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentFontSizeLevel = 0;
      updateFontSize();
      document.body.classList.remove('high-contrast', 'pause-animations', 'font-dyslexia');
      [btnContrast, btnPause, btnDyslexia].forEach(btn => btn && btn.classList.remove('active'));
    });
  }

});