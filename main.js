document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. BARRA FLUTUANTE DE ACESSIBILIDADE (ABRIR/FECHAR)
  =================================================== */
  const sidebar = document.getElementById('sidebarAcessibilidade');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');

      if (sidebar.classList.contains('active')) {
        toggleBtn.textContent = '›';
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        toggleBtn.textContent = '♿';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===================================================
     2. AJUSTE DE FONTE (AUMENTAR, DIMINUIR E FONTE GRANDE)
  =================================================== */
  let fontScale = 1.0;
  const maxScale = 1.4;
  const minScale = 0.8;

  const btnAumentar = document.getElementById('btnAumentarFonte');
  const btnDiminuir = document.getElementById('btnDiminuirFonte');
  const btnFonteGrande = document.getElementById('btnFonteGrande');

  function aplicarTamanhoFonte(escala) {
    document.documentElement.style.fontSize = `${escala * 100}%`;
  }

  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (fontScale < maxScale) {
        fontScale += 0.1;
        aplicarTamanhoFonte(fontScale);
      }
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (fontScale > minScale) {
        fontScale -= 0.1;
        aplicarTamanhoFonte(fontScale);
      }
    });
  }

  if (btnFonteGrande) {
    btnFonteGrande.addEventListener('click', () => {
      fontScale = fontScale === 1.2 ? 1.0 : 1.2;
      aplicarTamanhoFonte(fontScale);
    });
  }

  /* ===================================================
     3. RECURSO DE DISLEXIA E OUTROS EFEITOS
  =================================================== */
  const btnDislexia = document.getElementById('btnDislexia');
  const btnContraste = document.getElementById('btnContraste');
  const btnPausar = document.getElementById('btnPausarAnimacoes');
  const btnResetar = document.getElementById('btnResetar');

  if (btnDislexia) {
    btnDislexia.addEventListener('click', () => {
      document.body.classList.toggle('fonte-dislexia');
    });
  }

  if (btnContraste) {
    btnContraste.addEventListener('click', () => {
      document.body.classList.toggle('alto-contraste');
    });
  }

  if (btnPausar) {
    btnPausar.addEventListener('click', () => {
      document.body.classList.toggle('sem-animacoes');
    });
  }

  if (btnResetar) {
    btnResetar.addEventListener('click', () => {
      fontScale = 1.0;
      aplicarTamanhoFonte(fontScale);
      document.body.classList.remove('alto-contraste', 'fonte-dislexia', 'sem-animacoes');
    });
  }

  /* ===================================================
     4. BUSCA INTERNA NO SITE (FILTRO EM TEMPO REAL)
  =================================================== */
  const searchBtn = document.querySelector('.search-btn');

  if (searchBtn) {
    // Cria o campo de entrada de busca dinamicamente ao clicar na lupa
    searchBtn.addEventListener('click', () => {
      let searchInput = document.getElementById('campoBuscaInterna');

      if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.id = 'campoBuscaInterna';
        searchInput.type = 'text';
        searchInput.placeholder = 'Digite para buscar no site...';
        searchInput.className = 'input-busca-head';

        searchBtn.parentNode.insertBefore(searchInput, searchBtn);
        searchInput.focus();

        // Evento para filtrar o conteúdo do site ao digitar
        searchInput.addEventListener('input', (e) => {
          const termo = e.target.value.toLowerCase().trim();
          filtrarConteudoInterno(termo);
        });
      } else {
        searchInput.classList.toggle('escondido');
        if (!searchInput.classList.contains('escondido')) {
          searchInput.focus();
        }
      }
    });
  }

  function filtrarConteudoInterno(termo) {
    const cards = document.querySelectorAll('.card, .news-card');

    cards.forEach(card => {
      const textoCard = card.textContent.toLowerCase();
      if (textoCard.includes(termo)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ===================================================
     5. FILTRO DOS CHIPS DE PÚBLICO
  =================================================== */
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

});