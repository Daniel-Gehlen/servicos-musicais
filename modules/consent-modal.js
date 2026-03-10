export class ConsentModal {
  constructor() {
    this.storageKey = "termsAccepted";
    this.storageDateKey = "termsAcceptanceDate";
    this.modal = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!this.shouldShowModal()) return;

    this.createModal();
    this.setupModalEvents();
    this.preventBodyScroll();
  }

  shouldShowModal() {
    // Não mostrar em páginas de termos/privacidade
    if (
      window.location.pathname.includes("termos.html") ||
      window.location.pathname.includes("privacidade.html")
    ) {
      return false;
    }

    const accepted = localStorage.getItem(this.storageKey);
    const acceptanceDate = localStorage.getItem(this.storageDateKey);

    if (!accepted) return true;

    // Verificar se aceitação tem mais de 1 ano
    if (acceptanceDate) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (new Date(acceptanceDate) < oneYearAgo) {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageDateKey);
        return true;
      }
    }

    return false;
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.id = "consentModal";
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 20px;
    `;

    this.modal.innerHTML = this.getModalHTML();
    document.body.appendChild(this.modal);
    document.body.classList.add("modal-open");
  }

  getModalHTML() {
    return `
      <div style="
        background-color: var(--card-bg);
        border-radius: 15px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        border: 2px solid var(--accent);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      ">
        <div style="
          background-color: var(--secondary);
          padding: 1.5rem 2rem;
          border-radius: 13px 13px 0 0;
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 2px solid var(--accent);
        ">
          <i class="fas fa-exclamation-triangle" style="color: var(--accent); font-size: 2rem;"></i>
          <h2 style="margin: 0; color: var(--accent); font-size: 1.5rem;">Atenção: Termos de Uso</h2>
        </div>

        <div style="padding: 2rem;">
          <p style="margin-bottom: 1.5rem; color: #ccc; line-height: 1.6;">
            <strong>Bem-vindo ao site de Daniel Gehlen!</strong>
          </p>

          <div style="margin: 2rem 0; padding: 1.5rem; background-color: rgba(255, 255, 255, 0.03); border-radius: 10px; border-left: 4px solid var(--accent);">
            <h3 style="color: var(--accent); margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-user-check"></i> Requisitos para uso:
            </h3>
            <ul style="list-style: none; padding-left: 0; margin: 1rem 0;">
              <li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; color: #ccc;">
                <span style="position: absolute; left: 0; color: var(--accent);">•</span>
                Você declara ser <strong>maior de 18 anos</strong> ou ter autorização dos responsáveis
              </li>
              <li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; color: #ccc;">
                <span style="position: absolute; left: 0; color: var(--accent);">•</span>
                Concorda com nossos <a href="termos.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Termos de Serviço</a>
              </li>
              <li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; color: #ccc;">
                <span style="position: absolute; left: 0; color: var(--accent);">•</span>
                Aceita nossa <a href="privacidade.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Política de Privacidade</a>
              </li>
              <li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; color: #ccc;">
                <span style="position: absolute; left: 0; color: var(--accent);">•</span>
                Autoriza o uso de cookies essenciais para funcionamento do site
              </li>
            </ul>
          </div>

          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <label style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 1rem; cursor: pointer; color: #ccc;">
              <input type="checkbox" id="ageCheckbox" style="margin-top: 3px; cursor: pointer;">
              <span>Declaro que sou maior de 18 anos</span>
            </label>

            <label style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 1rem; cursor: pointer; color: #ccc;">
              <input type="checkbox" id="termsCheckbox" style="margin-top: 3px; cursor: pointer;">
              <span>Li e aceito os <a href="termos.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Termos de Serviço</a> e <a href="privacidade.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Política de Privacidade</a></span>
            </label>
          </div>
        </div>

        <div style="
          padding: 1.5rem 2rem;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 0 0 13px 13px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          border-top: 1px solid var(--border);
        ">
          <button id="rejectBtn" style="
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-size: 1rem;
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
            border: 1px solid #e74c3c;
            transition: all 0.3s;
          ">
            Não Aceito (Sair)
          </button>
          <button id="acceptBtn" disabled style="
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-size: 1rem;
            background-color: var(--accent);
            color: var(--primary);
            opacity: 0.5;
            transition: all 0.3s;
          ">
            Aceitar e Continuar
          </button>
        </div>
      </div>
    `;
  }

  setupModalEvents() {
    const ageCheckbox = document.getElementById("ageCheckbox");
    const termsCheckbox = document.getElementById("termsCheckbox");
    const acceptBtn = document.getElementById("acceptBtn");
    const rejectBtn = document.getElementById("rejectBtn");

    const updateAcceptButton = () => {
      acceptBtn.disabled = !(ageCheckbox.checked && termsCheckbox.checked);
      acceptBtn.style.opacity = acceptBtn.disabled ? "0.5" : "1";
      acceptBtn.style.cursor = acceptBtn.disabled ? "not-allowed" : "pointer";
    };

    ageCheckbox.addEventListener("change", updateAcceptButton);
    termsCheckbox.addEventListener("change", updateAcceptButton);

    acceptBtn.addEventListener("click", () => this.acceptTerms());
    rejectBtn.addEventListener("click", () => this.rejectTerms());

    // Fechar ao clicar fora do modal
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.showRejectionMessage();
      }
    });

    // Adicionar estilos para hover
    const style = document.createElement("style");
    style.textContent = `
      #acceptBtn:not(:disabled):hover {
        background-color: #0db83d;
        transform: translateY(-2px);
      }
      #rejectBtn:hover {
        background-color: rgba(231, 76, 60, 0.2);
      }
    `;
    document.head.appendChild(style);
  }

  acceptTerms() {
    localStorage.setItem(this.storageKey, "true");
    localStorage.setItem(this.storageDateKey, new Date().toISOString());
    this.removeModal();

    // Registrar evento de aceitação
    this.logConsentEvent("accepted");

    // Disparar evento para outros módulos
    window.dispatchEvent(new CustomEvent("consentAccepted"));
  }

  rejectTerms() {
    this.showRejectionMessage();
    this.logConsentEvent("rejected");
  }

  showRejectionMessage() {
    this.modal.innerHTML = `
      <div style="
        background-color: var(--card-bg);
        border-radius: 15px;
        max-width: 500px;
        width: 100%;
        padding: 2rem;
        text-align: center;
      ">
        <div style="margin-bottom: 1.5rem;">
          <i class="fas fa-door-open" style="color: var(--accent); font-size: 3rem;"></i>
        </div>
        <h2 style="color: var(--accent); margin-bottom: 1rem;">Obrigado pela visita!</h2>
        <p style="color: #ccc; margin-bottom: 1.5rem; line-height: 1.6;">
          Para utilizar nossos serviços, é necessário aceitar os Termos de Uso e Política de Privacidade.
        </p>
        <p style="color: #aaa; margin-bottom: 2rem; font-size: 0.9rem;">
          Você pode voltar a qualquer momento para revisar e aceitar os termos.
        </p>
        <button id="reconsiderBtn" style="
          padding: 0.8rem 2rem;
          border-radius: 8px;
          background-color: var(--accent);
          color: var(--primary);
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        ">
          Reconsiderar
        </button>
      </div>
    `;

    document.getElementById("reconsiderBtn").addEventListener("click", () => {
      location.reload();
    });
  }

  logConsentEvent(action) {
    const consentEvent = {
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      page: window.location.pathname,
    };

    try {
      const consentLog = JSON.parse(localStorage.getItem("consentLog") || "[]");
      consentLog.push(consentEvent);
      localStorage.setItem(
        "consentLog",
        JSON.stringify(consentLog.slice(-100)),
      );
    } catch (error) {
      console.warn("Não foi possível registrar consentimento:", error);
    }
  }

  preventBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  removeModal() {
    if (this.modal && this.modal.parentNode) {
      this.modal.remove();
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
  }
}
