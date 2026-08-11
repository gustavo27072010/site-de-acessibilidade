document.addEventListener("DOMContentLoaded", () => {
  const btnIncrease = document.getElementById("btn-increase");
  const btnDecrease = document.getElementById("btn-decrease");
  const btnContrast = document.getElementById("btn-contrast");

  let currentFontSize = 16;

  // Aumentar tamanho da fonte
  btnIncrease.addEventListener("click", () => {
    if (currentFontSize < 24) {
      currentFontSize += 2;
      document.documentElement.style.setProperty("--base-font-size", `${currentFontSize}px`);
    }
  });

  // Diminuir tamanho da fonte
  btnDecrease.addEventListener("click", () => {
    if (currentFontSize > 12) {
      currentFontSize -= 2;
      document.documentElement.style.setProperty("--base-font-size", `${currentFontSize}px`);
    }
  });

  // Alternar Alto Contraste
  btnContrast.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
  });
});