/**
 * ============================================================================
 * PORTAL DO CIDADÃO — CURITIBA & GOVERNO DO ESTADO DO PARANÁ
 * Arquivo: main.js
 * Descrição: Lógica de interatividade, acessibilidade WCAG 2.1, temas visuais,
 * filtros dinâmicos e persistência de preferências de usuário.
 * ============================================================================
 */

'use strict';

// ============================================================================
// 01. CONFIGURAÇÕES GLOBAIS E ESTADO DA APLICAÇÃO (STATE MANAGEMENT)
// ============================================================================
const CONFIG = {
  STORAGE_KEY_THEME: 'portal_curitiba_theme',
  STORAGE_KEY_FONT_SIZE: 'portal_curitiba_fontsize',
  STORAGE_KEY_DYSLEXIC: 'portal_curitiba_dyslexic',
  FONT_SIZE_MIN: 85,
  FONT_SIZE_MAX: 140,
  FONT_SIZE_STEP: 10,
  DEFAULT_FONT_SIZE: 100,
};

const State = {
  currentTheme: 'light',
  fontSizePercentage: CONFIG.DEFAULT_FONT_SIZE,
  isDyslexicFontActive: false,
  activeFilterCategory: 'todos',
  searchQuery: '',
};

// ============================================================================
// 02. ELEMENTOS DO DOM (CACHE DE SELETORES)
// ============================================================================
const DOM = {
  html: document.documentElement,
  body: document.body,
  ariaAnnouncer: document.getElementById('aria-announcer'),

  // Avisos do Sistema
  closeAlertBtn: document.getElementById('close-alert-btn'),
  systemAlertBar: document.querySelector('.system-alert-bar'),

  // Botões de Ação do Cabeçalho
  themeToggleHeader: document.getElementById('theme-toggle-header'),
  searchBtnToggle: document.getElementById('search-btn-toggle'),
  accQuickToggle: document.getElementById('acc-quick-toggle'),

  // Barra de Pesquisa
  searchBarContainer: document.getElementById('search-bar-container'),
  searchInput: document.getElementById('search-input'),
  searchCloseBtn: document.getElementById('search-close-btn'),

  // Cards de Serviços e Filtros
  cardsGrid: document.getElementById('grid-servicos'),
  cards: document.querySelectorAll('.cards-grid .card'),
  filterButtons: document.querySelectorAll('.publico-tags .tag-btn'),
  filterCountDisplay: document.getElementById('filter-count-display'),

  // Widget de Acessibilidade Visual
  toggleAccMenuBtn: document.getElementById('toggle-acc-menu'),
  accMenu: document.getElementById('acc-menu'),
  btnCloseAcc: document.getElementById('btn-close-acc'),
  btnThemeLight: document.getElementById('btn-theme-light'),
  btnThemeDark: document.getElementById('btn-theme-dark'),
  btnHighContrast: document.getElementById('btn-high-contrast'),
  btnIncreaseFont: document.getElementById('btn-increase-font'),
  btnDecreaseFont: document.getElementById('btn-decrease-font'),
  btnDyslexicFont: document.getElementById('btn-dyslexic-font'),
  btnResetAcc: document.getElementById('btn-reset-acc'),

  // Metadados de Tema Meta Tag
  metaThemeColor: document.getElementById('meta-theme-color'),
};

// ============================================================================
// 03. UTILITÁRIOS E FEEDBACK DE ACESSIBILIDADE
// ============================================================================

/**
 * Anuncia mensagens dinâmicas para leitores de tela via Live Region (aria-live).
 * @param {string} message - Texto a ser lido pelo leitor de tela.
 */
function announceToScreenReader(message) {
  if (DOM.ariaAnnouncer) {
    DOM.ariaAnnouncer.textContent = '';
    // Pequeno delay para garantir a leitura caso a mensagem seja repetida
    setTimeout(() => {
      DOM.ariaAnnouncer.textContent = message;
    }, 50);
  }
}

/**
 * Normaliza textos removendo acentos e convertendo para minúsculas.
 * @param {string} text - Texto original.
 * @returns {string} Texto formatado.
 */
function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ============================================================================
// 04. MÓDULO DE TEMAS E ESTILOS VISUAIS
// ============================================================================

/**
 * Aplica e persiste o tema visual selecionado (light, dark, high-contrast).
 * @param {string} themeName - Nome do tema.
 * @param {boolean} [save=true] - Define se deve salvar no localStorage.
 */
function applyTheme(themeName, save = true) {
  State.currentTheme = themeName;
  DOM.body.setAttribute('data-theme', themeName);

  // Atualiza cor da barra de endereço do navegador móvel
  if (DOM.metaThemeColor) {
    const themeColors = {
      light: '#0284c7',
      dark: '#0f172a',
      'high-contrast': '#000000',
    };
    DOM.metaThemeColor.setAttribute('content', themeColors[themeName] || '#0284c7');
  }

  // Atualiza ícone do botão rápido do cabeçalho
  if (DOM.themeToggleHeader) {
    const iconSpan = DOM.themeToggleHeader.querySelector('.icon');
    if (iconSpan) {
      iconSpan.textContent = (themeName === 'dark' || themeName === 'high-contrast') ? '☀️' : '🌙';
    }
  }

  if (save) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY_THEME, themeName);
    } catch (e) {
      console.warn('Não foi possível salvar o tema no localStorage.', e);
    }
  }

  const themeLabels = {
    light: 'Claro',
    dark: 'Escuro',
    'high-contrast': 'Alto Contraste',
  };
  announceToScreenReader(`Tema visual alterado para: ${themeLabels[themeName] || themeName}`);
}

/**
 * Ajusta o tamanho global da fonte da aplicação.
 * @param {number} percentage - Percentual do tamanho da fonte (ex: 100, 110, 90).
 */
function applyFontSize(percentage) {
  State.fontSizePercentage = percentage;
  DOM.html.style.fontSize = `${percentage}%`;

  try {
    localStorage.setItem(CONFIG.STORAGE_KEY_FONT_SIZE, percentage.toString());
  } catch (e) {
    console.warn('Não foi possível salvar o tamanho da fonte.', e);
  }

  announceToScreenReader(`Tamanho do texto ajustado para ${percentage} por cento`);
}

/**
 * Alterna a fonte adaptada para pessoas com dislexia.
 * @param {boolean} enable - Estado de ativação.
 */
function toggleDyslexicFont(enable) {
  State.isDyslexicFontActive = enable;

  if (enable) {
    DOM.body.style.fontFamily = "'Comic Sans MS', 'OpenDyslexic', 'Inter', sans-serif";
    announceToScreenReader('Fonte para dislexia ativada');
  } else {
    DOM.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    announceToScreenReader('Fonte padrão restaurada');
  }

  try {
    localStorage.setItem(CONFIG.STORAGE_KEY_DYSLEXIC, enable ? 'true' : 'false');
  } catch (e) {
    console.warn('Não foi possível salvar a preferência de fonte.', e);
  }
}

/**
 * Carrega as preferências salvas no localStorage ao iniciar a página.
 */
function loadUserPreferences() {
  try {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY_THEME);
    const savedFontSize = localStorage.getItem(CONFIG.STORAGE_KEY_FONT_SIZE);
    const savedDyslexic = localStorage.getItem(CONFIG.STORAGE_KEY_DYSLEXIC);

    if (savedTheme) {
      applyTheme(savedTheme, false);
    }

    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize, 10);
      if (!isNaN(parsedSize)) applyFontSize(parsedSize);
    }

    if (savedDyslexic === 'true') {
      toggleDyslexicFont(true);
    }
  } catch (e) {
    console.warn('Erro ao carregar preferências salvas do usuário.', e);
  }
}

// ============================================================================
// 05. MÓDULO DE FILTRAGEM E BUSCA EM TEMPO REAL
// ============================================================================

/**
 * Filtra os cards de serviços combinando o termo de pesquisa e a categoria ativa.
 */
function filterServices() {
  const query = normalizeText(State.searchQuery);
  const category = State.activeFilterCategory;
  let visibleCount = 0;

  DOM.cards.forEach((card) => {
    const cardCategory = card.getAttribute('data-category');
    const cardContent = normalizeText(card.textContent);

    const matchesCategory = (category === 'todos' || cardCategory === category);
    const matchesSearch = (query === '' || cardContent.includes(query));

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Atualiza contador de resultados
  if (DOM.filterCountDisplay) {
    let message = '';
    if (category === 'todos' && query === '') {
      message = 'Exibindo todos os serviços';
    } else {
      message = `Exibindo ${visibleCount} serviço(s) encontrado(s)`;
    }
    DOM.filterCountDisplay.textContent = message;
    announceToScreenReader(message);
  }
}

// ============================================================================
// 06. CONTROLE DE INTERACTIVE WIDGETS & MODAIS
// ============================================================================

/**
 * Abre ou fecha o menu flutuante de acessibilidade.
 */
function toggleAccessibilityMenu() {
  if (!DOM.accMenu) return;

  const isHidden = DOM.accMenu.classList.contains('hidden');

  if (isHidden) {
    DOM.accMenu.classList.remove('hidden');
    if (DOM.toggleAccMenuBtn) DOM.toggleAccMenuBtn.setAttribute('aria-expanded', 'true');
    if (DOM.accQuickToggle) DOM.accQuickToggle.setAttribute('aria-expanded', 'true');
    announceToScreenReader('Painel de acessibilidade aberto.');
  } else {
    DOM.accMenu.classList.add('hidden');
    if (DOM.toggleAccMenuBtn) DOM.toggleAccMenuBtn.setAttribute('aria-expanded', 'false');
    if (DOM.accQuickToggle) DOM.accQuickToggle.setAttribute('aria-expanded', 'false');
    announceToScreenReader('Painel de acessibilidade fechado.');
  }
}

/**
 * Abre a barra de pesquisa e posiciona o foco no input.
 */
function openSearchBar() {
  if (!DOM.searchBarContainer) return;
  DOM.searchBarContainer.classList.remove('hidden');
  if (DOM.searchBtnToggle) DOM.searchBtnToggle.setAttribute('aria-expanded', 'true');
  if (DOM.searchInput) {
    DOM.searchInput.focus();
    DOM.searchInput.select();
  }
  announceToScreenReader('Barra de busca expandida. Digite o serviço desejado.');
}

/**
 * Fecha a barra de pesquisa e limpa a busca ativa.
 */
function closeSearchBar() {
  if (!DOM.searchBarContainer) return;
  DOM.searchBarContainer.classList.add('hidden');
  if (DOM.searchBtnToggle) DOM.searchBtnToggle.setAttribute('aria-expanded', 'false');
  if (DOM.searchInput) DOM.searchInput.value = '';
  State.searchQuery = '';
  filterServices();
  announceToScreenReader('Barra de busca fechada.');
}

// ============================================================================
// 07. ATALHOS DE TECLADO UNIVERSAIS (ACCESSIBILITY KEYBINDINGS)
// ============================================================================

function handleGlobalShortcuts(event) {
  const activeElement = document.activeElement;
  const isTyping = activeElement.tagName === 'INPUT' || 
                   activeElement.tagName === 'TEXTAREA' || 
                   activeElement.isContentEditable;

  // Se o usuário estiver digitando em um campo de texto, não dispara atalhos numéricos
  if (isTyping && event.key !== 'Escape') return;

  switch (event.key) {
    case '1':
      const main = document.getElementById('conteudo-principal');
      if (main) {
        main.scrollIntoView({ behavior: 'smooth' });
        main.focus();
        announceToScreenReader('Navegado para o conteúdo principal');
      }
      break;

    case '2':
      const nav = document.getElementById('nav-menu');
      if (nav) {
        nav.scrollIntoView({ behavior: 'smooth' });
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
        announceToScreenReader('Navegado para o menu de navegação');
      }
      break;

    case '3':
      event.preventDefault();
      openSearchBar();
      break;

    case '4':
      const footer = document.getElementById('rodape');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
        footer.focus();
        announceToScreenReader('Navegado para o rodapé');
      }
      break;

    case 'Escape':
      closeSearchBar();
      if (DOM.accMenu && !DOM.accMenu.classList.contains('hidden')) {
        toggleAccessibilityMenu();
      }
      break;

    default:
      break;
  }
}

// ============================================================================
// 08. INICIALIZAÇÃO DE EVENT LISTENERS (EVENT BINDING)
// ============================================================================

function initEventListeners() {
  // Aviso do Sistema
  if (DOM.closeAlertBtn) {
    DOM.closeAlertBtn.addEventListener('click', () => {
      if (DOM.systemAlertBar) DOM.systemAlertBar.style.display = 'none';
      announceToScreenReader('Aviso do sistema removido.');
    });
  }

  // Toggle Rápido de Tema no Cabeçalho
  if (DOM.themeToggleHeader) {
    DOM.themeToggleHeader.addEventListener('click', () => {
      const nextTheme = State.currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Toggle do Painel de Acessibilidade
  if (DOM.toggleAccMenuBtn) DOM.toggleAccMenuBtn.addEventListener('click', toggleAccessibilityMenu);
  if (DOM.accQuickToggle) DOM.accQuickToggle.addEventListener('click', toggleAccessibilityMenu);
  if (DOM.btnCloseAcc) DOM.btnCloseAcc.addEventListener('click', toggleAccessibilityMenu);

  // Opções do Painel de Acessibilidade
  if (DOM.btnThemeLight) DOM.btnThemeLight.addEventListener('click', () => applyTheme('light'));
  if (DOM.btnThemeDark) DOM.btnThemeDark.addEventListener('click', () => applyTheme('dark'));
  if (DOM.btnHighContrast) DOM.btnHighContrast.addEventListener('click', () => applyTheme('high-contrast'));

  if (DOM.btnIncreaseFont) {
    DOM.btnIncreaseFont.addEventListener('click', () => {
      if (State.fontSizePercentage < CONFIG.FONT_SIZE_MAX) {
        applyFontSize(State.fontSizePercentage + CONFIG.FONT_SIZE_STEP);
      }
    });
  }

  if (DOM.btnDecreaseFont) {
    DOM.btnDecreaseFont.addEventListener('click', () => {
      if (State.fontSizePercentage > CONFIG.FONT_SIZE_MIN) {
        applyFontSize(State.fontSizePercentage - CONFIG.FONT_SIZE_STEP);
      }
    });
  }

  if (DOM.btnDyslexicFont) {
    DOM.btnDyslexicFont.addEventListener('click', () => {
      toggleDyslexicFont(!State.isDyslexicFontActive);
    });
  }

  if (DOM.btnResetAcc) {
    DOM.btnResetAcc.addEventListener('click', () => {
      applyTheme('light');
      applyFontSize(CONFIG.DEFAULT_FONT_SIZE);
      toggleDyslexicFont(false);
      announceToScreenReader('Todas as configurações de acessibilidade foram restauradas.');
    });
  }

  // Pesquisa
  if (DOM.searchBtnToggle) {
    DOM.searchBtnToggle.addEventListener('click', () => {
      const isHidden = DOM.searchBarContainer.classList.contains('hidden');
      if (isHidden) openSearchBar();
      else closeSearchBar();
    });
  }

  if (DOM.searchCloseBtn) DOM.searchCloseBtn.addEventListener('click', closeSearchBar);

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value;
      filterServices();
    });
  }

  // Filtros por Categoria (Tabs)
  DOM.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      DOM.filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      State.activeFilterCategory = btn.getAttribute('data-filter') || 'todos';
      filterServices();
    });
  });

  // Atalhos de Teclado Globais
  document.addEventListener('keydown', handleGlobalShortcuts);
}

// ============================================================================
// 09. INICIALIZAÇÃO DA APLICAÇÃO (BOOTSTRAP)
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Remove classe de fallback 'no-js'
  DOM.html.classList.remove('no-js');
  DOM.html.classList.add('js-enabled');

  // Carrega configurações prévias do usuário
  loadUserPreferences();

  // Ativa escutadores de eventos
  initEventListeners();

  console.log('Portal do Cidadão — Módulo JavaScript carregado com sucesso.');
});