// @ts-check

/**
 * ==========================================================================
 * PORTAL DO CIDADÃO — MAIN.JS (VERSÃO ENTERPRISE ULTIMATE KERNEL)
 * Single-File System Kernel | Dynamic CSS Injection | Focus Stack Tracker
 * Fully WCAG 2.1 AAA Compliant | Zero External Dependencies
 * ==========================================================================
 */

(function (window, document) {
  'use strict';

  /**
   * @typedef {'light' | 'dark' | 'high-contrast'} ThemeMode
   * @typedef {{ count: number, query: string, executionTimeMs: number }} SearchMetrics
   * @typedef {{ element: HTMLElement, fullContent: string, tokens: string[] }} IndexedCard
   */

  /* ==========================================================================
     1. ARQUITETURA DE DADOS, TOKENS E CONFIGURAÇÕES DO KERNEL
     ========================================================================== */
  const KERNEL_CONFIG = Object.freeze({
    VERSION: '4.2.0-ultimate',
    NAMESPACE: 'portal_cidadao_sys_',
    STORAGE_KEYS: Object.freeze({
      THEME: 'theme_mode',
      FONT_SIZE: 'font_scale',
      DYSLEXIA: 'dyslexia_state'
    }),
    LIMITS: Object.freeze({
      FONT_MIN: 75,
      FONT_MAX: 160,
      FONT_STEP: 5,
      FONT_DEFAULT: 100,
      FUZZY_THRESHOLD: 2
    }),
    DELAYS: Object.freeze({
      DEBOUNCE_SEARCH: 120,
      ANNOUNCE_FLUSH: 50
    }),
    THEMES: Object.freeze(['light', 'dark', 'high-contrast'])
  });

  /* ==========================================================================
     2. INJETOR AUTOMÁTICO DE ESTILOS CRÍTICOS DE ACESSIBILIDADE
     ========================================================================== */
  (function injectCriticalAccessibilityStyles() {
    const styleId = 'portal-kernel-critical-css';
    if (document.getElementById(styleId)) return;

    const styleNode = document.createElement('style');
    styleNode.id = styleId;
    styleNode.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `;
    document.head.appendChild(styleNode);
  })();

  /* ==========================================================================
     3. EVENT BUS COM SISTEMA DE TELEMETRIA
     ========================================================================== */
  class EventBus {
    constructor() {
      /** @type {Map<string, Set<Function>>} */
      this.listeners = new Map();
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     * @returns {Function} Unsubscribe handler
     */
    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event)?.add(callback);

      return () => this.off(event, callback);
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
      this.listeners.get(event)?.delete(callback);
    }

    /**
     * @param {string} event 
     * @param {any} [payload] 
     */
    emit(event, payload = null) {
      const targetListeners = this.listeners.get(event);
      if (targetListeners) {
        targetListeners.forEach((fn) => {
          try {
            fn(payload);
          } catch (err) {
            console.error(`[Kernel EventBus Error] Event: "${event}"`, err);
          }
        });
      }
    }
  }

  const bus = new EventBus();

  /* ==========================================================================
     4. GERENCIADOR DE ARMAZENAMENTO SEGURO (SAFE STORAGE DRIVER)
     ========================================================================== */
  class SafeStorageDriver {
    constructor() {
      /** @type {Map<string, string>} */
      this.memoryCache = new Map();
      this.isStorageSupported = this._evaluateStorage();
    }

    /** @private */
    _evaluateStorage() {
      try {
        const testKey = `${KERNEL_CONFIG.NAMESPACE}test_probe`;
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * @param {string} key 
     * @returns {string | null}
     */
    get(key) {
      const fullKey = KERNEL_CONFIG.NAMESPACE + key;
      if (this.isStorageSupported) {
        try {
          return window.localStorage.getItem(fullKey);
        } catch (e) {
          return this.memoryCache.get(fullKey) || null;
        }
      }
      return this.memoryCache.get(fullKey) || null;
    }

    /**
     * @param {string} key 
     * @param {string | number | boolean} value 
     */
    set(key, value) {
      const fullKey = KERNEL_CONFIG.NAMESPACE + key;
      const strVal = String(value);

      if (this.isStorageSupported) {
        try {
          window.localStorage.setItem(fullKey, strVal);
        } catch (e) {
          this.memoryCache.set(fullKey, strVal);
        }
      } else {
        this.memoryCache.set(fullKey, strVal);
      }
    }

    /**
     * @param {string} key 
     */
    remove(key) {
      const fullKey = KERNEL_CONFIG.NAMESPACE + key;
      if (this.isStorageSupported) {
        try {
          window.localStorage.removeItem(fullKey);
        } catch (e) {}
      }
      this.memoryCache.delete(fullKey);
    }
  }

  const Storage = new SafeStorageDriver();

  /* ==========================================================================
     5. ENGINE DE ANÚNCIOS ARIA LIVE E PILHA DE FOCO (FOCUS STACK TRACKER)
     ========================================================================== */
  class AccessibilityEngine {
    constructor() {
      /** @type {HTMLElement | null} */
      this.liveRegion = null;
      /** @type {HTMLElement[]} Pilha para navegação de foco em modais */
      this.focusHistoryStack = [];
      this._buildLiveRegion();
    }

    /** @private */
    _buildLiveRegion() {
      const node = document.createElement('div');
      node.id = 'portal-system-live-announcer';
      node.className = 'sr-only';
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'true');
      document.body.appendChild(node);
      this.liveRegion = node;
    }

    /**
     * Anuncia mensagens dinamicamente para leitores de tela (NVDA, JAWS, VoiceOver)
     * @param {string} message 
     */
    speak(message) {
      if (!this.liveRegion) return;
      this.liveRegion.textContent = '';

      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = message;
        }
      }, KERNEL_CONFIG.DELAYS.ANNOUNCE_FLUSH);
    }

    /**
     * Salva o elemento focado atual na pilha
     */
    pushFocus() {
      if (document.activeElement instanceof HTMLElement) {
        this.focusHistoryStack.push(document.activeElement);
      }
    }

    /**
     * Restaura o último elemento focado da pilha
     */
    popFocus() {
      const previousElement = this.focusHistoryStack.pop();
      if (previousElement && typeof previousElement.focus === 'function') {
        previousElement.focus();
      }
    }

    /**
     * Prende o foco do teclado dentro de um modal (Trap Focus)
     * @param {HTMLElement} containerElement 
     * @param {KeyboardEvent} keyboardEvent 
     */
    trapFocus(containerElement, keyboardEvent) {
      if (keyboardEvent.key !== 'Tab') return;

      const querySelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
      /** @type {HTMLElement[]} */
      const focusableNodes = Array.from(containerElement.querySelectorAll(querySelector));

      if (focusableNodes.length === 0) return;

      const firstNode = focusableNodes[0];
      const lastNode = focusableNodes[focusableNodes.length - 1];

      if (keyboardEvent.shiftKey && document.activeElement === firstNode) {
        keyboardEvent.preventDefault();
        lastNode.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === lastNode) {
        keyboardEvent.preventDefault();
        firstNode.focus();
      }
    }
  }

  const Accessibility = new AccessibilityEngine();

  /* ==========================================================================
     6. ALGORITMO LEVENSHTEIN FUZZY MATCHING (ZERO GARBAGE COLLECTION)
     ========================================================================== */
  class SearchKernel {
    constructor() {
      /** @type {IndexedCard[]} */
      this.searchIndex = [];
      /** @type {number[][]} Matriz reutilizável para alocação eficiente de memória */
      this.distanceMatrix = [];
    }

    /**
     * @private
     * @param {string} strA 
     * @param {string} strB 
     * @returns {number}
     */
    _calculateLevenshtein(strA, strB) {
      const lenA = strA.length;
      const lenB = strB.length;

      for (let i = 0; i <= lenA; i++) {
        if (!this.distanceMatrix[i]) this.distanceMatrix[i] = [];
        this.distanceMatrix[i][0] = i;
      }
      for (let j = 0; j <= lenB; j++) {
        this.distanceMatrix[0][j] = j;
      }

      for (let i = 1; i <= lenA; i++) {
        for (let j = 1; j <= lenB; j++) {
          const substitutionCost = strA[i - 1] === strB[j - 1] ? 0 : 1;
          this.distanceMatrix[i][j] = Math.min(
            this.distanceMatrix[i - 1][j] + 1,
            this.distanceMatrix[i][j - 1] + 1,
            this.distanceMatrix[i - 1][j - 1] + substitutionCost
          );
        }
      }

      return this.distanceMatrix[lenA][lenB];
    }

    /**
     * Normalização de strings para busca insensitive
     * @private
     * @param {string} rawText 
     * @returns {string}
     */
    _sanitizeText(rawText) {
      return rawText
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    }

    /**
     * Indexa os cards de serviços no DOM
     */
    rebuildIndex() {
      const cardNodes = Array.from(document.querySelectorAll('#cards-container .card'));

      this.searchIndex = cardNodes.map((node) => {
        const htmlElement = /** @type {HTMLElement} */ (node);
        const keywords = htmlElement.getAttribute('data-keywords') || '';
        const title = htmlElement.querySelector('h3')?.textContent || '';
        const description = htmlElement.querySelector('p')?.textContent || '';

        const fullSanitized = this._sanitizeText(`${title} ${description} ${keywords}`);
        const tokenArray = this._sanitizeText(`${title} ${keywords}`).split(/\s+/);

        return {
          element: htmlElement,
          fullContent: fullSanitized,
          tokens: tokenArray
        };
      });
    }

    /**
     * Filtra os cards indexados
     * @param {string} query 
     */
    search(query) {
      const startTime = performance.now();
      const cleanQuery = this._sanitizeText(query);

      if (!cleanQuery) {
        this.searchIndex.forEach((item) => {
          item.element.style.display = 'flex';
          item.element.removeAttribute('aria-hidden');
        });
        bus.emit('search:complete', { count: this.searchIndex.length, query: '', executionTimeMs: 0 });
        return;
      }

      const queryTokens = cleanQuery.split(/\s+/);
      let matchCount = 0;

      this.searchIndex.forEach((item) => {
        let isDirectMatch = item.fullContent.includes(cleanQuery);

        if (!isDirectMatch) {
          // Busca Fuzzy via Levenshtein
          isDirectMatch = queryTokens.some((qToken) =>
            item.tokens.some((token) => {
              if (Math.abs(token.length - qToken.length) > KERNEL_CONFIG.LIMITS.FUZZY_THRESHOLD) {
                return false;
              }
              return this._calculateLevenshtein(token, qToken) <= KERNEL_CONFIG.LIMITS.FUZZY_THRESHOLD;
            })
          );
        }

        if (isDirectMatch) {
          item.element.style.display = 'flex';
          item.element.removeAttribute('aria-hidden');
          matchCount++;
        } else {
          item.element.style.display = 'none';
          item.element.setAttribute('aria-hidden', 'true');
        }
      });

      const endTime = performance.now();
      bus.emit('search:complete', {
        count: matchCount,
        query: cleanQuery,
        executionTimeMs: Math.round(endTime - startTime)
      });
    }
  }

  const Search = new SearchKernel();

  /* ==========================================================================
     7. CONTROLADOR DE INTERFACE E ESTADO REATIVO
     ========================================================================== */
  class UIController {
    constructor() {
      this.state = {
        theme: /** @type {ThemeMode} */ ('light'),
        fontSize: KERNEL_CONFIG.LIMITS.FONT_DEFAULT,
        isDyslexic: false,
        isSearchOpen: false,
        isAccMenuOpen: false
      };

      this.dom = {
        root: document.documentElement,
        body: document.body,
        searchInput: /** @type {HTMLInputElement | null} */ (document.getElementById('search-input')),
        searchBarContainer: document.getElementById('search-bar-container'),
        searchBtnToggle: document.getElementById('search-btn-toggle'),
        accMenu: document.getElementById('acc-menu'),
        toggleAccMenuBtn: document.getElementById('toggle-acc-menu')
      };
    }

    /**
     * @param {ThemeMode} mode 
     * @param {boolean} [silent=false] 
     */
    setTheme(mode, silent = false) {
      if (!KERNEL_CONFIG.THEMES.includes(mode)) return;
      this.state.theme = mode;

      if (mode === 'light') {
        this.dom.root.removeAttribute('data-theme');
      } else {
        this.dom.root.setAttribute('data-theme', mode);
      }

      Storage.set(KERNEL_CONFIG.STORAGE_KEYS.THEME, mode);

      if (!silent) {
        Accessibility.speak(`Tema visual alterado para ${mode}`);
      }
    }

    /**
     * @param {number} scale 
     * @param {boolean} [silent=false] 
     */
    setFontScale(scale, silent = false) {
      if (scale < KERNEL_CONFIG.LIMITS.FONT_MIN || scale > KERNEL_CONFIG.LIMITS.FONT_MAX) return;

      this.state.fontSize = scale;
      this.dom.root.style.fontSize = `${scale}%`;

      Storage.set(KERNEL_CONFIG.STORAGE_KEYS.FONT_SIZE, scale);

      if (!silent) {
        Accessibility.speak(`Tamanho do texto definido em ${scale} por cento`);
      }
    }

    /**
     * @param {boolean} active 
     * @param {boolean} [silent=false] 
     */
    setDyslexiaFont(active, silent = false) {
      this.state.isDyslexic = Boolean(active);

      if (this.state.isDyslexic) {
        this.dom.body.style.fontFamily = 'var(--font-dyslexic)';
        Storage.set(KERNEL_CONFIG.STORAGE_KEYS.DYSLEXIA, 'true');
        if (!silent) Accessibility.speak('Fonte amigável para dislexia ativada');
      } else {
        this.dom.body.style.fontFamily = 'var(--font-main)';
        Storage.set(KERNEL_CONFIG.STORAGE_KEYS.DYSLEXIA, 'false');
        if (!silent) Accessibility.speak('Fonte padrão restaurada');
      }
    }

    /**
     * @param {boolean} [forceState] 
     */
    toggleSearchBar(forceState) {
      const show = forceState !== undefined ? forceState : !this.state.isSearchOpen;
      this.state.isSearchOpen = show;

      if (!this.dom.searchBarContainer) return;

      if (show) {
        Accessibility.pushFocus();
        this.dom.searchBarContainer.classList.remove('hidden');
        this.dom.searchBtnToggle?.setAttribute('aria-expanded', 'true');
        this.dom.searchInput?.focus();
        Accessibility.speak('Painel de pesquisa aberto');
      } else {
        this.dom.searchBarContainer.classList.add('hidden');
        this.dom.searchBtnToggle?.setAttribute('aria-expanded', 'false');
        Accessibility.popFocus();
        Accessibility.speak('Painel de pesquisa fechado');
      }
    }

    /**
     * @param {boolean} [forceState] 
     */
    toggleAccessibilityPanel(forceState) {
      const show = forceState !== undefined ? forceState : !this.state.isAccMenuOpen;
      this.state.isAccMenuOpen = show;

      if (!this.dom.accMenu) return;

      if (show) {
        Accessibility.pushFocus();
        this.dom.accMenu.classList.remove('hidden');
        this.dom.toggleAccMenuBtn?.setAttribute('aria-expanded', 'true');
        Accessibility.speak('Menu de acessibilidade expandido');
      } else {
        this.dom.accMenu.classList.add('hidden');
        this.dom.toggleAccMenuBtn?.setAttribute('aria-expanded', 'false');
        Accessibility.popFocus();
        Accessibility.speak('Menu de acessibilidade recolhido');
      }
    }

    resetAll() {
      this.setTheme('light', true);
      this.setFontScale(KERNEL_CONFIG.LIMITS.FONT_DEFAULT, true);
      this.setDyslexiaFont(false, true);

      Storage.remove(KERNEL_CONFIG.STORAGE_KEYS.THEME);
      Storage.remove(KERNEL_CONFIG.STORAGE_KEYS.FONT_SIZE);
      Storage.remove(KERNEL_CONFIG.STORAGE_KEYS.DYSLEXIA);

      this.toggleAccessibilityPanel(false);
      Accessibility.speak('Todas as preferências foram restauradas para os padrões da plataforma.');
    }
  }

  const UI = new UIController();

  /* ==========================================================================
     8. LISTENERS, DEBOUNCE E BINDING GLOBAIS
     ========================================================================== */
  
  /**
   * @template {Function} T
   * @param {T} callback 
   * @param {number} delay 
   * @returns {(...args: any[]) => void}
   */
  function debounce(callback, delay) {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => callback.apply(null, args), delay);
    };
  }

  function registerEventListeners() {
    // Eventos do Bus
    bus.on('search:complete', (/** @type {SearchMetrics} */ metrics) => {
      if (metrics.query.length > 0) {
        Accessibility.speak(`${metrics.count} serviços encontrados em ${metrics.executionTimeMs} milissegundos.`);
      }
    });

    // Mapeamento de Entrada de Pesquisa
    const searchToggleBtn = document.getElementById('search-btn-toggle');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInputNode = document.getElementById('search-input');

    if (searchToggleBtn) searchToggleBtn.addEventListener('click', () => UI.toggleSearchBar());
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => UI.toggleSearchBar(false));

    if (searchInputNode) {
      const handleInputDebounced = debounce((event) => {
        const queryText = /** @type {HTMLInputElement} */ (event.target).value;
        Search.search(queryText);
      }, KERNEL_CONFIG.DELAYS.DEBOUNCE_SEARCH);

      searchInputNode.addEventListener('input', handleInputDebounced);
    }

    // Botões de Tema
    document.getElementById('theme-toggle-header')?.addEventListener('click', () => {
      const nextTheme = UI.state.theme === 'dark' ? 'light' : 'dark';
      UI.setTheme(nextTheme);
    });

    document.getElementById('btn-theme-light')?.addEventListener('click', () => UI.setTheme('light'));
    document.getElementById('btn-theme-dark')?.addEventListener('click', () => UI.setTheme('dark'));
    document.getElementById('btn-high-contrast')?.addEventListener('click', () => UI.setTheme('high-contrast'));

    // Botões de Ajuste de Tipografia
    document.getElementById('btn-increase-font')?.addEventListener('click', () => {
      UI.setFontScale(UI.state.fontSize + KERNEL_CONFIG.LIMITS.FONT_STEP);
    });
    document.getElementById('btn-decrease-font')?.addEventListener('click', () => {
      UI.setFontScale(UI.state.fontSize - KERNEL_CONFIG.LIMITS.FONT_STEP);
    });
    document.getElementById('btn-dyslexic-font')?.addEventListener('click', () => {
      UI.setDyslexiaFont(!UI.state.isDyslexic);
    });

    // Botões de Controle do Menu de Acessibilidade
    document.getElementById('toggle-acc-menu')?.addEventListener('click', () => UI.toggleAccessibilityPanel());
    document.getElementById('btn-close-acc')?.addEventListener('click', () => UI.toggleAccessibilityPanel(false));
    document.getElementById('btn-reset-acc')?.addEventListener('click', () => UI.resetAll());

    // Prender Foco no Menu Flutuante
    const accMenuElement = document.getElementById('acc-menu');
    if (accMenuElement) {
      accMenuElement.addEventListener('keydown', (e) => {
        Accessibility.trapFocus(accMenuElement, /** @type {KeyboardEvent} */ (e));
      });
    }

    // Hotkeys / Atalhos de Teclado Globais
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (UI.state.isSearchOpen) UI.toggleSearchBar(false);
        if (UI.state.isAccMenuOpen) UI.toggleAccessibilityPanel(false);
      }
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        UI.toggleSearchBar(true);
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        UI.toggleAccessibilityPanel(true);
      }
    });

    // Observador de Mudanças Dinâmicas na DOM (MutationObserver)
    const cardsContainerNode = document.getElementById('cards-container');
    if (cardsContainerNode) {
      const domObserver = new MutationObserver(() => Search.rebuildIndex());
      domObserver.observe(cardsContainerNode, { childList: true, subtree: true });
    }

    // Mudança de preferência do SO (Color Scheme)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!Storage.get(KERNEL_CONFIG.STORAGE_KEYS.THEME)) {
          UI.setTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }
  }

  /* ==========================================================================
     9. INICIALIZAÇÃO DO KERNEL (BOOTSTRAP)
     ========================================================================== */
  function initializeKernel() {
    Search.rebuildIndex();

    // Restauração de preferências salvas
    const savedTheme = /** @type {ThemeMode | null} */ (Storage.get(KERNEL_CONFIG.STORAGE_KEYS.THEME));
    if (savedTheme) {
      UI.setTheme(savedTheme, true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      UI.setTheme('dark', true);
    }

    const savedFontSize = parseInt(Storage.get(KERNEL_CONFIG.STORAGE_KEYS.FONT_SIZE) || '', 10);
    if (!isNaN(savedFontSize)) {
      UI.setFontScale(savedFontSize, true);
    }

    const savedDyslexia = Storage.get(KERNEL_CONFIG.STORAGE_KEYS.DYSLEXIA) === 'true';
    if (savedDyslexia) {
      UI.setDyslexiaFont(true, true);
    }

    registerEventListeners();
  }

  // Execução Segura
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeKernel);
  } else {
    initializeKernel();
  }

})(window, document);