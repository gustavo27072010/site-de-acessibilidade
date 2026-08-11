document.addEventListener('DOMContentLoaded', () => {
  const btnAumentar = document.getElementById('btn-fonte-aumentar');
  const btnDiminuir = document.getElementById('btn-fonte-diminuir');
  const btnReset = document.getElementById('btn-fonte-reset');
  const btnContraste = document.getElementById('btn-contraste');

  let tamanhoFonteAtual = 100;

  // Ajustar Tamanho da Fonte
  btnAumentar.addEventListener('click', () => {
    if (tamanhoFonteAtual < 140) {
      tamanhoFonteAtual += 10;
      document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
    }
  });

  btnDiminuir.addEventListener('click', () => {
    if (tamanhoFonteAtual > 85) {
      tamanhoFonteAtual -= 10;
      document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
    }
  });

  btnReset.addEventListener('click', () => {
    tamanhoFonteAtual = 100;
    document.documentElement.style.fontSize = '100%';
  });

  // Alternar Modo Alto Contraste
  btnContraste.addEventListener('click', () => {
    document.body.classList.toggle('alto-contraste');
    const ativo = document.body.classList.contains('alto-contraste');
    btnContraste.setAttribute('aria-pressed', ativo);
  });
});