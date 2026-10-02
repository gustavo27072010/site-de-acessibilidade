/**
 * Arquivo principal de interações do Portal do Cidadão
 * Gerencia a barra de busca, ferramentas de acessibilidade e filtros.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     0. UTILITÁRIOS E FILTRO CENTRAL (usado pela busca e pelos chips)
  =================================================== */

  // Minúsculas e sem acentos, para "saude" encontrar "Saúde"
  const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  /**
   * Exibe só os cards que contêm algum dos termos.
   * @param {string|string[]} termos - Um termo ou lista de termos ('' mostra tudo)
   */
  function executarBuscaNoSite(termos) {
    const lista = (Array.isArray(termos) ? termos : [termos]).map(normalizar);
    const bate = (texto) => lista.some(t => texto.includes(t));

    document.querySelectorAll('.card, .news-card').forEach(card => {
      const visivel = bate(normalizar(card.textContent));
      card.style.display = visivel ? '' : 'none';
    });

    // Esconde seções inteiras que ficaram sem nenhum card visível
    document.querySelectorAll('.services-section, .news-section').forEach(secao => {
      const cards = secao.querySelectorAll('.card, .news-card');
      if (!cards.length) return;
      const algumVisivel = Array.from(cards).some(c => c.style.display !== 'none');
      secao.style.display = algumVisivel ? '' : 'none';
    });
  }


  /* ===================================================
     1. SISTEMA DE BUSCA INTERNA EM TEMPO REAL
  =================================================== */
  const searchBtn = document.getElementById('btnBuscar');

  if (searchBtn) {
    // Usa o campo que já existe no HTML (#campoBusca); cria só se faltar
    let searchInput = document.getElementById('campoBusca');
    if (!searchInput) {
      searchInput = document.createElement('input');
      searchInput.id = 'campoBusca';
      searchInput.type = 'search';
      searchInput.placeholder = 'Buscar no site...';
      searchInput.setAttribute('aria-label', 'Buscar no site');
      searchInput.hidden = true;
      searchBtn.parentNode.appendChild(searchInput);
    }
    searchInput.classList.add('input-busca-head');

    const definirAberto = (aberto) => {
      searchInput.hidden = !aberto;
      searchBtn.setAttribute('aria-expanded', String(aberto));
      if (aberto) {
        searchInput.focus();
      } else {
        searchInput.value = '';
        executarBuscaNoSite('');
      }
    };

    searchBtn.addEventListener('click', (event) => {
      event.preventDefault();
      definirAberto(searchInput.hidden);
    });

    // Filtragem instantânea enquanto digita
    searchInput.addEventListener('input', (e) => {
      // Limpa o chip ativo, pois a busca manual assume o controle
      document.querySelectorAll('.chip.active').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      executarBuscaNoSite(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executarBuscaNoSite(searchInput.value);
        const secaoServicos = document.getElementById('servicos');
        if (secaoServicos) secaoServicos.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'Escape') {
        definirAberto(false);
        searchBtn.focus();
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
      toggleBtn.setAttribute('aria-expanded', String(estaAberto));
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
      if (fontScale < maxScale) aplicarTamanhoFonte(fontScale + 0.1);
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (fontScale > minScale) aplicarTamanhoFonte(fontScale - 0.1);
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

  // Alterna uma classe no body e reflete o estado em aria-pressed
  function ligarAlternador(botao, classe) {
    if (!botao) return;
    botao.setAttribute('aria-pressed', 'false');
    botao.addEventListener('click', () => {
      const ativo = document.body.classList.toggle(classe);
      botao.setAttribute('aria-pressed', String(ativo));
    });
  }

  ligarAlternador(btnDislexia, 'fonte-dislexia');
  ligarAlternador(btnContraste, 'alto-contraste');
  ligarAlternador(btnPausar, 'sem-animacoes');

  if (btnResetar) {
    btnResetar.addEventListener('click', () => {
      aplicarTamanhoFonte(1.0);
      document.body.classList.remove('alto-contraste', 'fonte-dislexia', 'sem-animacoes');
      [btnDislexia, btnContraste, btnPausar].forEach(b => b && b.setAttribute('aria-pressed', 'false'));

      // Limpa e fecha o campo de busca
      const inputBusca = document.getElementById('campoBusca');
      if (inputBusca) {
        inputBusca.value = '';
        inputBusca.hidden = true;
      }
      if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');

      // Limpa o chip ativo e mostra todos os cards novamente
      document.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      executarBuscaNoSite('');
    });
  }


  /* ===================================================
     5. FILTRAGEM PELOS CHIPS DE PÚBLICO
     Cada chip é um link que abre o site externo em nova aba
     e, ao mesmo tempo, filtra os cards desta página.
  =================================================== */
  const palavrasPorPublico = {
    'idosos': ['idosos', 'aposentadoria', 'inss', 'bpc', 'vacina', 'prioritário'],
    'gestantes': ['gestante', 'pré-natal', 'mulher'],
    'criancas': ['crianças', 'vacina', 'educação', 'matrículas'],
    'jovens': ['jovens', 'educação', 'cursos', 'bolsas', 'matrículas'],
    'trabalhadores': ['trabalhadores', 'inss', 'aposentadoria', 'profissionalizantes', 'documentos'],
    'pessoas com deficiencia': ['deficiência', 'pcd', 'bpc', 'prioritário', 'visita domiciliar'],
    'familias de baixa renda': ['bolsa família', 'bpc', 'habitação', 'assistência social', 'cras'],
    'imigrantes': ['documentos', 'certidões', 'assistência social', 'ouvidoria']
  };

  const chips = document.querySelectorAll('.chip');

  chips.forEach(chip => {
    chip.setAttribute('aria-pressed', 'false');

    // Sem preventDefault: o link abre em nova aba normalmente
    chip.addEventListener('click', () => {
      const jaAtivo = chip.classList.contains('active');
      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });

      // Limpa o texto da busca para não haver dois filtros ao mesmo tempo
      const inputBusca = document.getElementById('campoBusca');
      if (inputBusca) inputBusca.value = '';

      if (jaAtivo) {
        executarBuscaNoSite('');
        return;
      }

      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');

      const nome = normalizar(
        chip.textContent.replace(/[\p{Extended_Pictographic}\u200D\uFE0F]/gu, '')
      );

      executarBuscaNoSite(palavrasPorPublico[nome] || [nome]);

      const secaoServicos = document.getElementById('servicos');
      if (secaoServicos) secaoServicos.scrollIntoView({ behavior: 'smooth' });
    });
  });

});