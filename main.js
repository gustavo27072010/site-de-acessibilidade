document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ELEMEMENTOS E ESTADO INICIAL
  // ==========================================
  const body = document.body;
  const themeToggleHeader = document.getElementById("theme-toggle-header");
  const searchBtn = document.querySelector(".search-btn");
  
  // Widget de Acessibilidade
  const toggleAccMenuBtn = document.getElementById("toggle-acc-menu");
  const accMenu = document.getElementById("acc-menu");
  const btnCloseAcc = document.getElementById("btn-close-acc");
  
  // Botões de Acessibilidade
  const btnThemeLight = document.getElementById("btn-theme-light");
  const btnThemeDark = document.getElementById("btn-theme-dark");
  const btnHighContrast = document.getElementById("btn-high-contrast");
  const btnIncreaseFont = document.getElementById("btn-increase-font");
  const btnDecreaseFont = document.getElementById("btn-decrease-font");
  const btnLetterSpacing = document.getElementById("btn-letter-spacing");
  const btnDyslexicFont = document.getElementById("btn-dyslexic-font");
  const btnResetAcc = document.getElementById("btn-reset-acc");

  // Outros botões
  const tagBtns = document.querySelectorAll(".tag-btn");

  // Configuração padrão de estado
  let currentFontSize = 100; // Porcentagem
  let isCustomSpacing = false;
  let isDyslexicFont = false;

  // ==========================================
  // 2. PAINEL DE ACESSIBILIDADE (ABRIR / FECHAR)
  // ==========================================
  if (toggleAccMenuBtn && accMenu) {
    toggleAccMenuBtn.addEventListener("click", () => {
      accMenu.classList.toggle("hidden");
      const isExpanded = !accMenu.classList.contains("hidden");
      toggleAccMenuBtn.setAttribute("aria-expanded", isExpanded);
    });
  }

  if (btnCloseAcc && accMenu) {
    btnCloseAcc.addEventListener("click", () => {
      accMenu.classList.add("hidden");
      toggleAccMenuBtn.setAttribute("aria-expanded", "false");
    });
  }

  // ==========================================
  // 3. TEMA (CLARO / ESCURO / ALTO CONTRASTE)
  // ==========================================
  function setTheme(themeName) {
    body.setAttribute("data-theme", themeName);
    
    // Atualiza o ícone do botão no cabeçalho
    if (themeToggleHeader) {
      themeToggleHeader.textContent = themeName === "dark" || themeName === "high-contrast" ? "☀️" : "🌙";
    }
  }

  // Alternador do Cabeçalho
  if (themeToggleHeader) {
    themeToggleHeader.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  // Botões do Widget
  if (btnThemeLight) btnThemeLight.addEventListener("click", () => setTheme("light"));
  if (btnThemeDark) btnThemeDark.addEventListener("click", () => setTheme("dark"));
  if (btnHighContrast) btnHighContrast.addEventListener("click", () => setTheme("high-contrast"));

  // ==========================================
  // 4. BAICHA VISÃO & TIPOGRAFIA
  // ==========================================
  // Aumentar Fonte
  if (btnIncreaseFont) {
    btnIncreaseFont.addEventListener("click", () => {
      if (currentFontSize < 150) {
        currentFontSize += 10;
        document.documentElement.style.fontSize = `${currentFontSize}%`;
      }
    });
  }

  // Diminuir Fonte
  if (btnDecreaseFont) {
    btnDecreaseFont.addEventListener("click", () => {
      if (currentFontSize > 80) {
        currentFontSize -= 10;
        document.documentElement.style.fontSize = `${currentFontSize}%`;
      }
    });
  }

  // Espaçamento entre Letras
  if (btnLetterSpacing) {
    btnLetterSpacing.addEventListener("click", () => {
      isCustomSpacing = !isCustomSpacing;
      body.style.letterSpacing = isCustomSpacing ? "0.12em" : "normal";
      body.style.wordSpacing = isCustomSpacing ? "0.16em" : "normal";
    });
  }

  // Fonte para Dislexia
  if (btnDyslexicFont) {
    btnDyslexicFont.addEventListener("click", () => {
      isDyslexicFont = !isDyslexicFont;
      if (isDyslexicFont) {
        body.style.fontFamily = "'Comic Sans MS', 'OpenDyslexic', sans-serif";
      } else {
        body.style.fontFamily = "'Inter', sans-serif";
      }
    });
  }

  // ==========================================
  // 5. RESTAURAR PADRÕES
  // ==========================================
  if (btnResetAcc) {
    btnResetAcc.addEventListener("click", () => {
      currentFontSize = 100;
      isCustomSpacing = false;
      isDyslexicFont = false;

      document.documentElement.style.fontSize = "100%";
      body.style.letterSpacing = "normal";
      body.style.wordSpacing = "normal";
      body.style.fontFamily = "'Inter', sans-serif";
      setTheme("light");
    });
  }

  // ==========================================
  // 6. BUSCA & DEMAIS BOTÕES
  // ==========================================
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = prompt("O que você procura no Portal do Cidadão?");
      if (query && query.trim() !== "") {
        alert(`Buscando por: "${query}"...`);
      }
    });
  }

  // Tags de Público (Ativa/Desativa ao clicar)
  tagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const status = btn.classList.contains("active") ? "selecionado" : "desmarcado";
      console.log(`Filtro ${btn.textContent.trim()} ${status}`);
    });
  });
});