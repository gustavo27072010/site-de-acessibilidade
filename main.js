document.addEventListener('DOMContentLoaded', () => {

    // Referências aos elementos HTML
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    const btnContrast = document.getElementById('btn-contrast');
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');
    const btnResetFont = document.getElementById('btn-reset-font');
    const btnReadText = document.getElementById('btn-read-text');
    
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Configurações e Persistência
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 100;
    let isHighContrast = localStorage.getItem('highContrast') === 'true';

    // --------------------------------------------------------------------------
    // 1. INICIALIZAÇÃO DE PREFERÊNCIAS SALVAS
    // --------------------------------------------------------------------------
    const applyFontSize = (size) => {
        htmlElement.style.fontSize = `${size}%`;
        localStorage.setItem('fontSize', size);
    };

    const applyContrast = (contrastState) => {
        if (contrastState) {
            bodyElement.classList.add('high-contrast');
            btnContrast.setAttribute('aria-pressed', 'true');
        } else {
            bodyElement.classList.remove('high-contrast');
            btnContrast.setAttribute('aria-pressed', 'false');
        }
        localStorage.setItem('highContrast', contrastState);
    };

    // Aplica preferências salvas no carregamento
    applyFontSize(currentFontSize);
    applyContrast(isHighContrast);

    // --------------------------------------------------------------------------
    // 2. EVENTOS DE ACESSIBILIDADE
    // --------------------------------------------------------------------------
    
    // Alternar Alto Contraste
    btnContrast.addEventListener('click', () => {
        isHighContrast = !isHighContrast;
        applyContrast(isHighContrast);
    });

    // Controle do Tamanho da Fonte
    btnIncreaseFont.addEventListener('click', () => {
        if (currentFontSize < 150) { // Limite máximo de 150%
            currentFontSize += 10;
            applyFontSize(currentFontSize);
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if (currentFontSize > 80) { // Limite mínimo de 80%
            currentFontSize -= 10;
            applyFontSize(currentFontSize);
        }
    });

    btnResetFont.addEventListener('click', () => {
        currentFontSize = 100;
        applyFontSize(currentFontSize);
    });

    // --------------------------------------------------------------------------
    // 3. SÍNTESE DE VOZ (LEITURA DA PÁGINA)
    // --------------------------------------------------------------------------
    let isReading = false;
    let synth = window.speechSynthesis;

    btnReadText.addEventListener('click', () => {
        if (!synth) {
            alert('A leitura de texto não é suportada por este navegador.');
            return;
        }

        if (isReading) {
            synth.cancel();
            isReading = false;
            btnReadText.setAttribute('aria-pressed', 'false');
            btnReadText.querySelector('span').innerText = '🔊 Ler Página';
        } else {
            const mainContent = document.getElementById('main-content').innerText;
            const utterance = new SpeechSynthesisUtterance(mainContent);
            utterance.lang = 'pt-BR';

            utterance.onend = () => {
                isReading = false;
                btnReadText.setAttribute('aria-pressed', 'false');
                btnReadText.querySelector('span').innerText = '🔊 Ler Página';
            };

            synth.speak(utterance);
            isReading = true;
            btnReadText.setAttribute('aria-pressed', 'true');
            btnReadText.querySelector('span').innerText = '⏹ Parar Leitura';
        }
    });

    // --------------------------------------------------------------------------
    // 4. VALIDAÇÃO DE FORMULÁRIO ACESSÍVEL
    // --------------------------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            formStatus.className = 'status-message'; // Limpa classes
            
            // Validação simples
            if (!name || !email || !message) {
                formStatus.innerText = 'Por favor, preencha todos os campos obrigatórios.';
                formStatus.classList.add('error');
                return;
            }

            // Exemplo de sucesso
            formStatus.innerText = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
            formStatus.classList.add('success');
            contactForm.reset();
        });
    }
});