/**
 * ============================================================================
 * PORTAL DO CIDADÃO — CURITIBA & GOVERNO DO ESTADO DO PARANÁ
 * Arquivo: main.js
 * Descrição: Sistema dinâmico com gerenciamento de dados de serviços, notícias,
 * regionais, acessibilidade WCAG 2.1, temas visuais e renderização no DOM.
 * ============================================================================
 */

'use strict';

// ============================================================================
// 01. BASE DE DADOS INTEGRADA (MOCK DATABASE)
// ============================================================================
const DATABASE = {
  servicos: [
    {
      id: "srv-001",
      titulo: "Saúde Já Curitiba",
      categoria: "saude",
      esfera: "municipal",
      icone: "🏥",
      corIcone: "icon-cyan",
      descricao: "Agendamento de consultas e vacinas nas Unidades Básicas de Saúde sem filas.",
      recursos: ["Consultas odontológicas", "Carteira de vacinação digital"],
      linkTexto: "Acessar aplicativo",
      linkUrl: "#"
    },
    {
      id: "srv-002",
      titulo: "Consulta e Emissão do IPTU",
      categoria: "impostos",
      esfera: "municipal",
      icone: "📑",
      corIcone: "icon-yellow",
      descricao: "Emissão de guias de pagamento à vista com desconto ou parcelamento do imposto imobiliário.",
      recursos: ["Certidão negativa de débitos", "Alteração de titularidade"],
      linkTexto: "Emitir 2ª Via",
      linkUrl: "#"
    },
    {
      id: "srv-003",
      titulo: "DETRAN-PR & IPVA",
      categoria: "transporte",
      esfera: "estadual",
      icone: "🚗",
      corIcone: "icon-blue",
      descricao: "Renovação da CNH, consulta de pontos na carteira e pagamento do IPVA do veículo.",
      recursos: ["Licenciamento anual", "Agendamento de exames"],
      linkTexto: "Consultar Veículo",
      linkUrl: "#"
    },
    {
      id: "srv-004",
      titulo: "Agência do Trabalhador",
      categoria: "trabalho",
      esfera: "municipal",
      icone: "💼",
      corIcone: "icon-orange",
      descricao: "Cadastro de currículos, agendamento para seguro-desemprego e cursos de capacitação.",
      recursos: ["Vagas abertas por regional", "Apoio ao primeiro emprego"],
      linkTexto: "Buscar Vagas",
      linkUrl: "#"
    },
    {
      id: "srv-005",
      titulo: "Matrícula Escolar Online",
      categoria: "educacao",
      esfera: "estadual",
      icone: "🎓",
      corIcone: "icon-purple",
      descricao: "Inscrição e consulta de vagas para a rede pública de ensino do Estado do Paraná.",
      recursos: ["Transferência de escola", "Boletim escolar digital"],
      linkTexto: "Consultar Vagas",
      linkUrl: "#"
    },
    {
      id: "srv-006",
      titulo: "Nota Curitibana",
      categoria: "impostos",
      esfera: "municipal",
      icone: "🎟️",
      corIcone: "icon-red",
      descricao: "Cadastre seu CPF na nota fiscal de serviços e concorra a prêmios mensais em dinheiro.",
      recursos: ["Resgate de créditos", "Sorteios mensais"],
      linkTexto: "Cadastrar CPF",
      linkUrl: "#"
    }
  ],
  noticias: [
    {
      id: "not-001",
      titulo: "Obras de Ampliação da Linha Verde Avançam",
      origem: "Prefeitura",
      esfera: "municipal",
      dataIso: "2026-08-14",
      dataFormatada: "14 de Agosto, 2026",
      resumo: "Confira os novos desvios operacionais no trânsito para a liberação do novo lote de pavimentação.",
      linkUrl: "#"
    },
    {
      id: "not-002",
      titulo: "Inscrições Abertas para Cursos Profissionalizantes",
      origem: "Governo do Estado",
      esfera: "estadual",
      dataIso: "2026-08-13",
      dataFormatada: "13 de Agosto, 2026",
      resumo: "São mais de 5.000 vagas gratuitas em tecnologia e gestão administrativa em todo o Paraná.",
      linkUrl: "#"
    },
    {
      id: "not-003",
      titulo: "Campanha Multivacinação no Sábado",
      origem: "Saúde",
      esfera: "municipal",
      dataIso: "2026-08-12",
      dataFormatada: "12 de Agosto, 2026",
      resumo: "Todas as Ruas da Cidadania estarão abertas das 08h às 17h para atualização da carteira vacinal.",
      linkUrl: "#"
    }
  ],
  regionais: [
    {
      nome: "Matriz (Praça Rui Barbosa)",
      endereco: "Praça Rui Barbosa, 101 — Centro",
      telefone: "(41) 3313-5800",
      horario: "Atendimento: 08h às 17h"
    },
    {
      nome: "Boqueirão",
      endereco: "Av. Marechal Floriano Peixoto, 8430",
      telefone: "(41) 3313-5500",
      horario: "Atendimento: 08h às 17h"
    },
    {
      nome: "Santa Felicidade",
      endereco: "Rua Santa Bertila Boscardin, 213",
      telefone: "(41) 3374-5000",
      horario: "Atendimento: 08h às 17h"
    },
    {
      nome: "CIC (Cidade Industrial)",
      endereco: "Rua Manoel Valdomiro de Macedo, 2460",
      telefone: "(41) 3327-2525",
      horario: "Atendimento: 08h às 17h"
    }
  ]
};

// ============================================================================
// 02. ESTADO DA APLICAÇÃO & CONFIGURAÇÕES
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
// 03. SELETORES DO DOM
// ============================================================================
const DOM = {
  html: document.documentElement,
  body: document.body,
  ariaAnnouncer: document.getElementById('aria-announcer'),

  // Avisos
  closeAlertBtn: document.getElementById('close-alert-btn'),
  systemAlertBar: document.querySelector('.system-alert-bar'),

  // Botões de Ação
  themeToggleHeader: document.getElementById('theme-toggle-header'),
  searchBtnToggle: document.getElementById('search-btn-toggle'),
  accQuickToggle: document.getElementById('acc-quick-toggle'),

  // Busca
  searchBarContainer: document.getElementById('search-bar-container'),
  searchInput: document.getElementById('search-input'),
  searchCloseBtn: document.getElementById('search-close-btn'),

  // Containers Dinâmicos
  gridServicos: document.getElementById('grid-servicos'),
  gridNoticias: document.getElementById('grid-noticias'),
  gridRegionais: document.getElementById('grid-regionais'),

  // Filtros
  filterButtons: document.querySelectorAll('.publico-tags .tag-btn'),
  filterCountDisplay: document.getElementById('filter-count-display'),

  // Acessibilidade
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

  metaThemeColor: document.getElementById('meta-theme-color'),
};

// ============================================================================
// 04. MÓDULO DE RENDERIZAÇÃO DINÂMICA DO DOM
// ============================================================================

function renderServicos() {
  if (!DOM.gridServicos) return;

  const query = normalizeText(State.searchQuery);
  const category = State.activeFilterCategory;

  const servicosFiltrados = DATABASE.servicos.filter(item => {
    const matchesCategory = (category === 'todos' || item.categoria === category);
    const content = normalizeText(`${item.titulo} ${item.descricao} ${item.recursos.join(' ')}`);
    const matchesSearch = (query === '' || content.includes(query));
    return matchesCategory && matchesSearch;
  });

  DOM.gridServicos.innerHTML = '';

  if (servicosFiltrados.length === 0) {
    DOM.gridServicos.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p style="font-size: 1.1rem; color: var(--text-secondary);">Nenhum serviço encontrado para os critérios selecionados.</p>
      </div>
    `;
  } else {
    servicosFiltrados.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-category', item.categoria);

      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon ${item.corIcone}" aria-hidden="true">${item.icone}</div>
          <span class="badge-tag ${item.esfera}">${item.esfera.toUpperCase()}</span>
        </div>
        <div class="card-body">
          <h3>${item.titulo}</h3>
          <p>${item.descricao}</p>
          <ul class="card-features">
            ${item.recursos.map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        <div class="card-footer">
          <a href="${item.linkUrl}" class="card-link">${item.linkTexto} <span>→</span></a>
        </div>
      `;
      DOM.gridServicos.appendChild(card);
    });
  }

  // Atualiza contador
  if (DOM.filterCountDisplay) {
    const msg = (category === 'todos' && query === '')
      ? `Exibindo todos os ${servicosFiltrados.length} serviços`
      : `Exibindo ${servicosFiltrados.length} serviço(s) encontrado(s)`;
    DOM.filterCountDisplay.textContent = msg;
    announceToScreenReader(msg);
  }
}

function renderNoticias() {
  if (!DOM.gridNoticias) return;
  DOM.gridNoticias.innerHTML = DATABASE.noticias.map(noticia => `
    <article class="card">
      <div class="card-header">
        <span class="badge-tag ${noticia.esfera}">${noticia.origem}</span>
        <time datetime="${noticia.dataIso}" style="font-size: 0.8rem; color: var(--text-muted);">${noticia.dataFormatada}</time>
      </div>
      <div class="card-body">
        <h3>${noticia.titulo}</h3>
        <p>${noticia.resumo}</p>
      </div>
      <div class="card-footer">
        <a href="${noticia.linkUrl}" class="card-link">Ler notícia completa <span>→</span></a>
      </div>
    </article>
  `).join('');
}

function renderRegionais() {
  if (!DOM.gridRegionais) return;
  DOM.gridRegionais.innerHTML = DATABASE.regionais.map(reg => `
    <div class="regional-card">
      <h3>${reg.nome}</h3>
      <p class="regional-address">${reg.endereco}</p>
      <p class="regional-phone">Telefone: <a href="tel:${reg.telefone.replace(/\D/g, '')}">${reg.telefone}</a></p>
      <p class="regional-hours">${reg.horario}</p>
    </div>
  `).join('');
}

// ============================================================================
// 05. UTILITÁRIOS E LEITORES DE TELA
// ============================================================================

function announceToScreenReader(message) {
  if (DOM.ariaAnnouncer) {
    DOM.ariaAnnouncer.textContent = '';
    setTimeout(() => {
      DOM.ariaAnnouncer.textContent = message;
    }, 50);
  }
}

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ============================================================================
// 06. TEMAS E ACESSIBILIDADE
// ============================================================================

function applyTheme(themeName, save = true) {
  State.currentTheme = themeName;
  DOM.body.setAttribute('data-theme', themeName);

  if (DOM.metaThemeColor) {
    const themeColors = {
      light: '#0284c7',
      dark: '#0f172a',
      'high-contrast': '#000000',
    };
    DOM.metaThemeColor.setAttribute('content', themeColors[themeName] || '#0284c7');
  }

  if (DOM.themeToggleHeader) {
    const iconSpan = DOM.themeToggleHeader.querySelector('.icon');
    if (iconSpan) {
      iconSpan.textContent = (themeName === 'dark' || themeName === 'high-contrast') ? '☀️' : '🌙';
    }
  }

  if (save) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY_THEME, themeName); } catch (e) {}
  }

  announceToScreenReader(`Tema visual alterado para: ${themeName}`);
}

function applyFontSize(percentage) {
  State.fontSizePercentage = percentage;
  DOM.html.style.fontSize = `${percentage}%`;
  try { localStorage.setItem(CONFIG.STORAGE_KEY_FONT_SIZE, percentage.toString()); } catch (e) {}
  announceToScreenReader(`Tamanho do texto ajustado para ${percentage}%`);
}

function toggleDyslexicFont(enable) {
  State.isDyslexicFontActive = enable;
  DOM.body.style.fontFamily = enable
    ? "'Comic Sans MS', 'OpenDyslexic', 'Inter', sans-serif"
    : "'Inter', system-ui, sans-serif";
  try { localStorage.setItem(CONFIG.STORAGE_KEY_DYSLEXIC, enable ? 'true' : 'false'); } catch (e) {}
  announceToScreenReader(enable ? 'Fonte para dislexia ativada' : 'Fonte padrão restaurada');
}

function loadUserPreferences() {
  try {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY_THEME);
    const savedFontSize = localStorage.getItem(CONFIG.STORAGE_KEY_FONT_SIZE);
    const savedDyslexic = localStorage.getItem(CONFIG.STORAGE_KEY_DYSLEXIC);

    if (savedTheme) applyTheme(savedTheme, false);
    if (savedFontSize) applyFontSize(parseInt(savedFontSize, 10));
    if (savedDyslexic === 'true') toggleDyslexicFont(true);
  } catch (e) {}
}

// ============================================================================
// 07. WIDGETS E NAVEGAÇÃO INTERATIVA
// ============================================================================

function toggleAccessibilityMenu() {
  if (!DOM.accMenu) return;
  const isHidden = DOM.accMenu.classList.contains('hidden');
  DOM.accMenu.classList.toggle('hidden');
  const expanded = isHidden ? 'true' : 'false';
  if (DOM.toggleAccMenuBtn) DOM.toggleAccMenuBtn.setAttribute('aria-expanded', expanded);
  if (DOM.accQuickToggle) DOM.accQuickToggle.setAttribute('aria-expanded', expanded);
}

function openSearchBar() {
  if (!DOM.searchBarContainer) return;
  DOM.searchBarContainer.classList.remove('hidden');
  if (DOM.searchBtnToggle) DOM.searchBtnToggle.setAttribute('aria-expanded', 'true');
  if (DOM.searchInput) {
    DOM.searchInput.focus();
    DOM.searchInput.select();
  }
}

function closeSearchBar() {
  if (!DOM.searchBarContainer) return;
  DOM.searchBarContainer.classList.add('hidden');
  if (DOM.searchBtnToggle) DOM.searchBtnToggle.setAttribute('aria-expanded', 'false');
  if (DOM.searchInput) DOM.searchInput.value = '';
  State.searchQuery = '';
  renderServicos();
}

function handleGlobalShortcuts(event) {
  const activeElement = document.activeElement;
  const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
  if (isTyping && event.key !== 'Escape') return;

  switch (event.key) {
    case '1':
      document.getElementById('conteudo-principal')?.focus();
      break;
    case '2':
      document.getElementById('nav-menu')?.querySelector('a')?.focus();
      break;
    case '3':
      event.preventDefault();
      openSearchBar();
      break;
    case '4':
      document.getElementById('rodape')?.focus();
      break;
    case 'Escape':
      closeSearchBar();
      if (DOM.accMenu && !DOM.accMenu.classList.contains('hidden')) {
        toggleAccessibilityMenu();
      }
      break;
  }
}

// ============================================================================
// 08. EVENT LISTENERS E BOOTSTRAP
// ============================================================================

function initEventListeners() {
  if (DOM.closeAlertBtn) {
    DOM.closeAlertBtn.addEventListener('click', () => {
      if (DOM.systemAlertBar) DOM.systemAlertBar.style.display = 'none';
    });
  }

  if (DOM.themeToggleHeader) {
    DOM.themeToggleHeader.addEventListener('click', () => {
      applyTheme(State.currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  if (DOM.toggleAccMenuBtn) DOM.toggleAccMenuBtn.addEventListener('click', toggleAccessibilityMenu);
  if (DOM.accQuickToggle) DOM.accQuickToggle.addEventListener('click', toggleAccessibilityMenu);
  if (DOM.btnCloseAcc) DOM.btnCloseAcc.addEventListener('click', toggleAccessibilityMenu);

  if (DOM.btnThemeLight) DOM.btnThemeLight.addEventListener('click', () => applyTheme('light'));
  if (DOM.btnThemeDark) DOM.btnThemeDark.addEventListener('click', () => applyTheme('dark'));
  if (DOM.btnHighContrast) DOM.btnHighContrast.addEventListener('click', () => applyTheme('high-contrast'));

  if (DOM.btnIncreaseFont) {
    DOM.btnIncreaseFont.addEventListener('click', () => {
      if (State.fontSizePercentage < CONFIG.FONT_SIZE_MAX) applyFontSize(State.fontSizePercentage + CONFIG.FONT_SIZE_STEP);
    });
  }

  if (DOM.btnDecreaseFont) {
    DOM.btnDecreaseFont.addEventListener('click', () => {
      if (State.fontSizePercentage > CONFIG.FONT_SIZE_MIN) applyFontSize(State.fontSizePercentage - CONFIG.FONT_SIZE_STEP);
    });
  }

  if (DOM.btnDyslexicFont) {
    DOM.btnDyslexicFont.addEventListener('click', () => toggleDyslexicFont(!State.isDyslexicFontActive));
  }

  if (DOM.btnResetAcc) {
    DOM.btnResetAcc.addEventListener('click', () => {
      applyTheme('light');
      applyFontSize(CONFIG.DEFAULT_FONT_SIZE);
      toggleDyslexicFont(false);
    });
  }

  if (DOM.searchBtnToggle) {
    DOM.searchBtnToggle.addEventListener('click', () => {
      if (DOM.searchBarContainer.classList.contains('hidden')) openSearchBar();
      else closeSearchBar();
    });
  }

  if (DOM.searchCloseBtn) DOM.searchCloseBtn.addEventListener('click', closeSearchBar);

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value;
      renderServicos();
    });
  }

  DOM.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      DOM.filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      State.activeFilterCategory = btn.getAttribute('data-filter') || 'todos';
      renderServicos();
    });
  });

  document.addEventListener('keydown', handleGlobalShortcuts);
}

document.addEventListener('DOMContentLoaded', () => {
  DOM.html.classList.remove('no-js');
  DOM.html.classList.add('js-enabled');

  loadUserPreferences();
  initEventListeners();

  // Renderização inicial dinâmica
  renderServicos();
  renderNoticias();
  renderRegionais();

  console.log('Portal do Cidadão — Aplicação totalmente carregada e funcional.');
});