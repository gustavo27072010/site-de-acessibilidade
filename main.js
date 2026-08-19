/**
  * Arquivo principal de interações do Portal do Cidadão
  * Garante o funcionamento de todos os recursos de acessibilidade e busca
  */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. CONTROLE DA BARRA FLUTUANTE DE ACESSIBILIDADE
  =================================================== */
  const sidebar = document.getElementById('sidebarAcessibilidade');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      // Alterna a classe 'active' que desliza o painel para dentro/fora da tela
      sidebar.classList.toggle('active');

      const estaAberto = sidebar.classList.contains('active');

      // Atualiza o texto do botão e os atributos ARIA para leitores de tela
      toggleBtn.textContent = estaAberto ? '›' : '♿';
      toggleBtn.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });
  }

  /* ===================================================
     2. AJUSTE DINÂMICO DE TAMANHO DA FONTE
  =================================================== */
  let fontScale = 1.0; // 1.0 = 100% do tamanho padrão
  const maxScale = 1.4; // Limite máximo de aumento (140%)
  const minScale = 0.8; // Limite mínimo de redução (80%)

  const btnAumentar = document.getElementById('btnAumentarFonte');
  const btnDiminuir = document.getElementById('btnDiminuirFonte');
  const btnFonteGrande = document.getElementById('btnFonteGrande');

  // Atualiza o tamanho da fonte no elemento raiz (HTML)
  function aplicarTamanhoFonte(escala) {
    document.documentElement.style.fontSize = `${escala * 100}%`;
  }

  // Aumenta a fonte gradualmente
  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (fontScale < maxScale) {
        fontScale += 0.1;
        aplicarTamanhoFonte(fontScale);
      }
    });
  }

  // Diminui a fonte gradualmente
  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (fontScale > minScale) {
        fontScale -= 0.1;
        aplicarTamanhoFonte(fontScale);
      }
    });
  }

  // Alterna diretamente para a versão Fonte Grande
  if (btnFonteGrande) {
    btnFonteGrande.addEventListener('click', () => {
      fontScale = fontScale === 1.2 ? 1.0 : 1.2;
      aplicarTamanhoFonte(fontScale);
    });
  }

  /* ===================================================
     3. RECURSOS DE MODOS DE LEITURA (DISLEXIA E CONTRASTE)
  =================================================== */
  const btnDislexia = document.getElementById('btnDislexia');
  const btnContraste = document.getElementById('btnContraste');
  const btnPausar = document.getElementById('btnPausarAnimacoes');
  const btnResetar = document.getElementById('btnResetar');

  // Modo Dislexia: Alterna fonte com maior espaçamento
  if (btnDislexia) {
    btnDislexia.addEventListener('click', () => {
      document.body.classList.toggle('fonte-dislexia');
    });
  }

  // Modo Alto Contraste
  if (btnContraste) {
    btnContraste.addEventListener('click', () => {
      document.body.classList.toggle('alto-contraste');
    });
  }

  // Pausa de transições visuais
  if (btnPausar) {
    btnPausar.addEventListener('click', () => {
      document.body.classList.toggle('sem-animacoes');
    });
  }

  // Botão Resetar:Restaura todas as opções para o estado inicial
  if (btnResetar) {
    btnResetar.addEventListener('click', () => {
      fontScale = 1.0;
      aplicarTamanhoFonte(fontScale);
      document.body.classList.remove('alto-contraste', 'fonte-dislexia', 'sem-animacoes');
    });
  }

  /* ===================================================
     4. SISTEMA DE BUSCA INTERNA EM TEMPO REAL
  =================================================== */
  const searchBtn = document.getElementById('btnBuscar');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      let searchInput = document.getElementById('campoBuscaInterna');

      // Se o campo de texto ainda não existir na tela, ele é criado dinamicamente
      if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.id = 'campoBuscaInterna';
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar no site...';
        searchInput.className = 'input-busca-head';

        // Insere o campo antes do ícone de lupa
        searchBtn.parentNode.insertBefore(searchInput, searchBtn);
        searchInput.focus();

        // Escuta o evento de digitação do usuário para filtrar os conteúdos
        searchInput.addEventListener('input', (e) => {
          const termo = e.target.value.toLowerCase().trim();
          filtrarConteudoInterno(termo);
        });
      } else {
        // Se já existir, alterna a exibição
        searchInput.classList.toggle('escondido');
        if (!searchInput.classList.contains('escondido')) {
          searchInput.focus();
        }
      }
    });
  }

  // Oculta ou exibe os cards de acordo com a palavra digitada na busca
  function filtrarConteudoInterno(termo) {
    const cards = document.querySelectorAll('.card, .news-card');

    cards.forEach(card => {
      const textoCard = card.textContent.toLowerCase();
      if (textoCard.includes(termo)) {
        card.style.display = ''; // Mantém a exibição padrão do CSS
      } else {
        card.style.display = 'none'; // Oculta o card divergente
      }
    });
  }
  /* ===================================================
     5. SELEÇÃO INTERATIVA E FILTRAGEM DOS CHIPS DE PÚBLICO
  =================================================== */
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Se clicar no mesmo chip já ativo, desmarca ele
      const jaAtivo = chip.classList.contains('active');
      
      chips.forEach(c => c.classList.remove('active'));

      if (!jaAtivo) {
        chip.classList.add('active');
        const categoria = chip.textContent.trim().toLowerCase();

        // Filtra os cards por correspondência de texto
        cards.forEach(card => {
          const textoCard = card.textContent.toLowerCase();
          if (textoCard.includes(categoria) || categoria.includes('todos')) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      } else {
        // Se nenhum chip estiver ativo, exibe todos os cards
        cards.forEach(card => card.style.display = 'flex');
      }
    });
  });