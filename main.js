// main.js
import { HeaderManager } from "./modules/header.js";
import { FooterManager } from "./modules/footer.js";
import { ConsentModal } from "./modules/consent-modal.js";
import { SnowEffect } from "./modules/snow.js";

class App {
  constructor() {
    this.modules = {
      header: new HeaderManager(),
      footer: new FooterManager(),
      consent: new ConsentModal(),
      snow: new SnowEffect({ count: 40 }),
    };
  }

  init() {
    // Inicializar módulos básicos
    this.modules.header.init();
    this.modules.footer.init();
    this.modules.consent.init();
    this.modules.snow.init();


    if (document.querySelector(".typing-text")) {
      this.initTypingEffect();
    }
  }


  initTypingEffect() {
    const typingElement = document.querySelector(".typing-text");
    if (!typingElement) return;

    const texts = [
      "projetos musicais",
      "aulas online",
      "partituras profissionais",
      "eventos especiais",
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const type = () => {
      const currentText = texts[textIndex];

      if (!isPaused) {
        if (!isDeleting && charIndex < currentText.length) {
          typingElement.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
          typingElement.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          setTimeout(type, 50);
        } else if (!isDeleting && charIndex === currentText.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            setTimeout(type, 1500);
          }, 2000);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
        }
      }
    };

    setTimeout(type, 1000);
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
