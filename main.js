/**
 * Arquivo principal de interações do Portal do Cidadão
 * Gerencia a barra de busca dinâmica, ferramentas de acessibilidade e filtros.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. SISTEMA DE BUSCA INTERNA EM TEMPO REAL
  =================================================== */
  const searchBtn = document.getElementById('btnBuscar');

  if (searchBtn) {
    searchBtn.addEventListener('click', (event) => {
      // Impede o comportamento padrão do botão se estiver dentro de um formulário
      event.preventDefault();

      let searchInput = document.getElementById('campoBuscaInterna');

      // Se o campo de texto ainda não existe no HTML, cria dinamicamente
      if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.id = 'campoBuscaInterna';
        searchInput.type = 'search';
        searchInput.placeholder = 'Buscar serviços ou notícias...';
        searchInput.className = 'input-busca-head';
        searchInput.setAttribute('aria-label', 'Campo de busca no site');

        // Insere o campo exatamente antes do ícone de lupa no cabeçalho
        searchBtn.parentNode.insertBefore(searchInput, searchBtn);
        searchInput.focus();

        // Evento 1: Filtragem instantânea conforme o usuário digita
        searchInput.addEventListener('input', (e) => {
          const termo = e.target.value.toLowerCase().trim();
          executarBuscaNoSite(termo);
        });

        // Evento 2: Rolagem suave até os resultados ao pressionar Enter
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const termo = e.target.value.toLowerCase().trim();
            executarBuscaNoSite(termo);

            // Rola a tela até a seção de serviços para mostrar o resultado
            const secaoServicos = document.getElementById('servicos');
            if (secaoServicos) {
              secaoServicos.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });

      } else {
        // Se o campo já existe, alterna o estado de exibição (visível / escondido)
        searchInput.classList.toggle('escondido');

        if (!searchInput.classList.contains('escondido')) {
          searchInput.focus();
        } else {
          // Limpa a busca ao fechar o campo e exibe tudo novamente
          searchInput.value = '';
          executarBuscaNoSite('');
        }
      }
    });
  }

  /**
   * Função responsável por ocultar ou exibir elementos da página com base no termo buscado
   * @param {string} termo - Texto digitado pelo usuário
   */
  function executarBuscaNoSite(termo) {
    // Seleciona todos os elementos pesquisáveis do site
    const cardsServico = document.querySelectorAll('.card');
    const cardsNoticias = document.querySelectorAll('.news-card');

    // 1. Filtrar Cards de Serviços
    cardsServico.forEach(card => {
      const titulo = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const descricao = card.querySelector('p')?.textContent.toLowerCase() || '';

      // Verifica se o termo está no título ou na descrição
      if (titulo.includes(termo) || descricao.includes(termo)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // 2. Filtrar Cards de Notícias
    cardsNoticias.forEach(newsCard => {
      const titulo = newsCard.querySelector('h3')?.textContent.toLowerCase() || '';
      const resumo = newsCard.querySelector('p')?.textContent.toLowerCase() || '';
      const categoria = newsCard.querySelector('.tag-category')?.textContent.toLowerCase() || '';

      if (titulo.includes(termo) || resumo.includes(termo) || categoria.includes(termo)) {
        newsCard.style.display = 'flex';
      } else {
        newsCard.style.display = 'none';
      }
    });
  }


  /* ===================================================
     2. CONTROLE DA BARRA FLUTUANTE DE ACESSIBILIDADE
  =================================================== */
  const sidebar = document.getElementById('sidebarAcessibilidade');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      const estaAberto = sidebar.classList.contains('active');
      toggleBtn.textContent = estaAberto ? '›' : '♿';
      toggleBtn.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });
  }
    function executarBuscaNoSite(termos) {
    const lista = (Array.isArray(termos) ? termos : [termos]).map(t => t.toLowerCase());
    const bate = (texto) => lista.some(t => texto.includes(t));

    document.querySelectorAll('.card').forEach(card => {
      card.style.display = bate(card.textContent.toLowerCase()) ? 'flex' : 'none';
    });

    document.querySelectorAll('.news-card').forEach(newsCard => {
      newsCard.style.display = bate(newsCard.textContent.toLowerCase()) ? 'flex' : 'none';
    });
  }


  /* ===================================================
     3. AJUSTE DINÂMICO DO TAMANHO DA FONTE
  =================================================== */
  let fontScale = 1.0;
  const maxScale = 1.4;
  const minScale = 0.8;

  const btnAumentar = document.getElementById('btnAumentarFonte');
  const btnDiminuir = document.getElementById('btnDiminuirFonte');
  const btnFonteGrande = document.getElementById('btnFonteGrande');

  function aplicarTamanhoFonte(escala) {
    // Arredonda para evitar imprecisão de ponto flutuante (ex.: 1.2000000000000002)
    fontScale = Math.round(escala * 10) / 10;
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }

  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (fontScale < maxScale) {
        aplicarTamanhoFonte(fontScale + 0.1);
      }
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (fontScale > minScale) {
        aplicarTamanhoFonte(fontScale - 0.1);
      }
    });
  }

  if (btnFonteGrande) {
    btnFonteGrande.addEventListener('click', () => {
      aplicarTamanhoFonte(fontScale === 1.2 ? 1.0 : 1.2);
    });
  }


  /* ===================================================
     4. MODOS DE LEITURA E ACESSIBILIDADE VISUAL
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
      aplicarTamanhoFonte(1.0);
      document.body.classList.remove('alto-contraste', 'fonte-dislexia', 'sem-animacoes');

      // Reseta também o campo de busca caso esteja ativo
      const inputBusca = document.getElementById('campoBuscaInterna');
      if (inputBusca) {
        inputBusca.value = '';
      }

      // Limpa o chip ativo e mostra todos os cards novamente
      document.querySelectorAll('button.chip').forEach(c => c.classList.remove('active'));
      executarBuscaNoSite('');
    });
  }


    /* ===================================================
     5. FILTRAGEM PELOS CHIPS DE PÚBLICO
     Só chips <button> filtram; o link "Crianças" apenas navega.
  =================================================== */
  const palavrasPorPublico = {
    'idosos': ['idosos', 'aposentadoria', 'inss', 'bpc', 'vacina', 'prioritário'],
    'gestantes': ['gestante', 'pré-natal', 'mulher'],
    'jovens': ['jovens', 'educação', 'cursos', 'bolsas', 'matrículas'],
    'trabalhadores': ['trabalhadores', 'inss', 'aposentadoria', 'profissionalizantes', 'documentos'],
    'pessoas com deficiência': ['deficiência', 'pcd', 'bpc', 'prioritário', 'visita domiciliar'],
    'famílias de baixa renda': ['bolsa família', 'bpc', 'habitação', 'assistência social', 'cras']
  };
  // Imigrantes: serviços de documentação e atendimento
  palavrasPorPublico['imigrantes'] = ['documentos', 'certidões', 'assistência social', 'ouvidoria'];

  const chips = document.querySelectorAll('button.chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const jaAtivo = chip.classList.contains('active');
      chips.forEach(c => c.classList.remove('active'));

      if (jaAtivo) {
        executarBuscaNoSite('');
        return;
      }

      chip.classList.add('active');
      const nome = chip.textContent
        .replace(/[\p{Extended_Pictographic}\u200D\uFE0F]/gu, '')
        .trim()
        .toLowerCase();

      executarBuscaNoSite(palavrasPorPublico[nome] || [nome]);
    });
  });