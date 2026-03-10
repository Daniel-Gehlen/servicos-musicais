// modules/footer.js
export class FooterManager {
  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  init() {
    // Se já existe um footer estático no HTML, não cria outro
    if (document.querySelector('footer')) {
      return;
    }
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <div class="container">
        <p>© ${this.currentYear} Daniel Gehlen. Serviços musicais profissionais.</p>
        <div class="footer-links">
          <a href="privacidade.html">Política de Privacidade</a>
          <a href="termos.html">Termos de Serviço</a>
          <a href="mailto:danielgehlentech@gmail.com">Contato</a>
          <a href="https://wa.me/+5551989345497?text=Olá!%20Vim%20do%20site%20e%20gostaria%20de%20mais%20informações%20sobre%20os%20serviços%20musicais.%20Segue%20minhas%20dúvidas:"
             target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }
}
