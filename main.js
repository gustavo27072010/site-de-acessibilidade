document.addEventListener('DOMContentLoaded', () => {
    // Elementos da página
    const btnContrast = document.getElementById('btn-contrast');
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');
    const btnResetFont = document.getElementById('btn-reset-font');
    const htmlElement = document.documentElement;

    // Tamanho padrão da fonte em porcentagem
    let currentFontSize = 100;

    // 1. Alternar Alto Contraste
    btnContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        
        // Atualiza o atributo aria-pressed para leitores de tela
        const isHighContrast = document.body.classList.contains('high-contrast');
        btnContrast.setAttribute('aria-pressed', isHighContrast);
    });

    // 2. Controle do Tamanho da Fonte
    btnIncreaseFont.addEventListener('click', () => {
        if (currentFontSize < 150) { // Limite máximo de 150%
            currentFontSize += 10;
            htmlElement.style.fontSize = `${currentFontSize}%`;
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if (currentFontSize > 80) { // Limite mínimo de 80%
            currentFontSize -= 10;
            htmlElement.style.fontSize = `${currentFontSize}%`;
        }
    });

    btnResetFont.addEventListener('click', () => {
        currentFontSize = 100;
        htmlElement.style.fontSize = '100%';
    });
});