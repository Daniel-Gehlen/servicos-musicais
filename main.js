// Main JavaScript for Daniel Gehlen Music Services

document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
      } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // Typing Effect for Hero Text
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    const originalText = typingText.textContent;
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

    function typeEffect() {
      const currentText = texts[textIndex];

      if (!isPaused) {
        if (!isDeleting && charIndex < currentText.length) {
          typingText.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          setTimeout(typeEffect, 100);
        } else if (isDeleting && charIndex > 0) {
          typingText.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          setTimeout(typeEffect, 50);
        } else if (!isDeleting && charIndex === currentText.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            setTimeout(typeEffect, 1500);
          }, 2000);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(typeEffect, 500);
        }
      }
    }

    // Start the typing effect
    setTimeout(typeEffect, 1000);
  }

  // Color Picker Functionality
  const colorOptions = document.querySelectorAll(
    ".color-option, .color-option-large",
  );
  const colorPreview = document.getElementById("colorPreview");
  const applyColorBtn = document.getElementById("applyColorBtn");
  const projectSelect = document.getElementById("projectSelect");
  let selectedColor = "#0fcc45";

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from all options
      colorOptions.forEach((opt) => opt.classList.remove("active"));

      // Add active class to clicked option
      this.classList.add("active");

      // Get the color
      selectedColor = this.getAttribute("data-color");

      // Update preview
      if (colorPreview) {
        colorPreview.style.backgroundColor = selectedColor;
        colorPreview.textContent = `Cor selecionada: ${selectedColor}`;
      }

      // Update CSS variable
      document.documentElement.style.setProperty("--accent", selectedColor);

      // Update progress circle color
      const progressCircle = document.querySelector(".circle-progress");
      if (progressCircle) {
        progressCircle.style.stroke = selectedColor;
      }

      // Update progress text color
      const progressText = document.querySelector(".progress-text");
      if (progressText) {
        progressText.style.color = selectedColor;
      }
    });
  });

  // Apply Color Button
  if (applyColorBtn) {
    applyColorBtn.addEventListener("click", function () {
      const selectedProject = projectSelect.value;
      if (!selectedProject) {
        alert("Por favor, selecione um projeto primeiro.");
        return;
      }

      // Save color for project
      localStorage.setItem(`projectColor_${selectedProject}`, selectedColor);

      // Show success message
      alert(`Cor ${selectedColor} aplicada ao projeto com sucesso!`);

      // Update UI to reflect change
      const projectOptions = {
        project1: "Transcrição: Música Romântica",
        project2: "Aulas: Curso Violão Iniciante",
        project3: "Evento: Casamento Ana & Carlos",
        project4: "Composição: Nova Canção",
      };

      const projectName =
        projectOptions[selectedProject] || "Projeto selecionado";
      if (colorPreview) {
        colorPreview.innerHTML = `
                    <div style="text-align: center;">
                        <p><strong>✓ Cor aplicada!</strong></p>
                        <p style="font-size: 0.9rem;">${projectName}</p>
                        <p style="font-size: 0.8rem;">${selectedColor}</p>
                    </div>
                `;
      }
    });
  }

  // Load saved color for selected project
  if (projectSelect) {
    projectSelect.addEventListener("change", function () {
      const selectedProject = this.value;
      if (selectedProject) {
        const savedColor =
          localStorage.getItem(`projectColor_${selectedProject}`) || "#0fcc45";

        // Update color picker
        colorOptions.forEach((option) => {
          if (option.getAttribute("data-color") === savedColor) {
            option.classList.add("active");
            option.click(); // Trigger click to update everything
          } else {
            option.classList.remove("active");
          }
        });
      }
    });
  }

  // CTA Buttons
  const startProjectBtn = document.getElementById("startProjectBtn");
  if (startProjectBtn) {
    startProjectBtn.addEventListener("click", function () {
      // Scroll to services section
      document.getElementById("servicos").scrollIntoView({
        behavior: "smooth",
      });

      // Show modal or redirect to contact form in a real scenario
      setTimeout(() => {
        alert(
          "Ótimo! Vamos começar seu projeto musical. Em um site real, isso abriria um formulário de contato.",
        );
      }, 500);
    });
  }

  const viewProgressBtn = document.getElementById("viewProgressBtn");
  if (viewProgressBtn) {
    viewProgressBtn.addEventListener("click", function () {
      // Scroll to progress section
      document.getElementById("progresso").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  // Quick Actions
  const favoriteServicesBtn = document.getElementById("favoriteServices");
  if (favoriteServicesBtn) {
    favoriteServicesBtn.addEventListener("click", function () {
      alert(
        "Serviços marcados como favoritos serão salvos aqui para acesso rápido.",
      );
    });
  }

  const exportOutlineBtn = document.getElementById("exportOutline");
  if (exportOutlineBtn) {
    exportOutlineBtn.addEventListener("click", function () {
      alert(
        "Esboço do projeto exportado como PDF. Em um site real, isso geraria um download.",
      );
    });
  }

  const convertToVisualBtn = document.getElementById("convertToVisual");
  if (convertToVisualBtn) {
    convertToVisualBtn.addEventListener("click", function () {
      alert(
        "Convertendo para diagrama visual... Em um site real, isso mostraria uma visualização gráfica.",
      );
    });
  }

  // Search Functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.trim();
        if (searchTerm) {
          alert(
            `Buscando por: "${searchTerm}"\n\nEm um site real, isso mostraria resultados de partituras relacionadas.`,
          );
          this.value = "";
        }
      }
    });
  }

  // Update Stats Randomly (for demo purposes)
  function updateStats() {
    const timeRead = document.getElementById("timeRead");
    const wordsRead = document.getElementById("wordsRead");
    const highlightsCount = document.getElementById("highlightsCount");
    const readingSpeed = document.getElementById("readingSpeed");

    if (timeRead && wordsRead && highlightsCount && readingSpeed) {
      // Random increments for demo
      const currentTime = parseInt(timeRead.textContent);
      const currentWords = parseInt(wordsRead.textContent.replace(".", ""));
      const currentHighlights = parseInt(highlightsCount.textContent);
      const currentSpeed = parseInt(readingSpeed.textContent);

      // Update every 30 seconds
      setInterval(() => {
        timeRead.textContent = currentTime + Math.floor(Math.random() * 5);
        wordsRead.textContent = (
          currentWords + Math.floor(Math.random() * 100)
        ).toLocaleString("pt-BR");
        highlightsCount.textContent =
          currentHighlights + Math.floor(Math.random() * 2);
        readingSpeed.textContent =
          currentSpeed + Math.floor(Math.random() * 10);
      }, 30000);
    }
  }

  updateStats();

  // Service Progress Animation
  function animateProgress() {
    const progressFills = document.querySelectorAll(".progress-fill");
    progressFills.forEach((fill) => {
      const width = fill.style.width;
      fill.style.width = "0%";

      setTimeout(() => {
        fill.style.width = width;
      }, 500);
    });
  }

  // Re-animate progress when scrolled into view
  const observerOptions = {
    threshold: 0.5,
  };

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgress();
      }
    });
  }, observerOptions);

  const progressSection = document.querySelector(".progress-section");
  if (progressSection) {
    progressObserver.observe(progressSection);
  }
});

// Modal de Consentimento
function setupConsentModal() {
  // Verificar se já aceitou os termos
  const termsAccepted = localStorage.getItem("termsAccepted");

  if (!termsAccepted) {
    // Criar modal
    const modalHTML = `
            <div class="consent-modal-overlay" id="consentModal">
                <div class="consent-modal">
                    <div class="consent-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h2>Atenção: Termos de Uso e Privacidade</h2>
                    </div>

                    <div class="consent-content">
                        <p><strong>Bem-vindo ao site de Daniel Gehlen!</strong></p>

                        <div class="consent-requirements">
                            <h3><i class="fas fa-user-check"></i> Requisitos para uso:</h3>
                            <ul>
                                <li>Você declara ser <strong>maior de 18 anos</strong> ou ter autorização dos responsáveis</li>
                                <li>Concorda com nossos <a href="termos.html" target="_blank">Termos de Serviço</a></li>
                                <li>Aceita nossa <a href="privacidade.html" target="_blank">Política de Privacidade</a></li>
                                <li>Autoriza o uso de cookies essenciais para funcionamento do site</li>
                            </ul>
                        </div>

                        <div class="data-collection-info">
                            <h3><i class="fas fa-database"></i> Dados que coletamos:</h3>
                            <ul>
                                <li><strong>Contato:</strong> Nome, e-mail (apenas se você nos enviar)</li>
                                <li><strong>Técnicos:</strong> Endereço IP, tipo de navegador (automático)</li>
                                <li><strong>Preferências:</strong> Tema escolhido, progresso salvo</li>
                                <li><strong>Projetos:</strong> Áudios e partituras que você enviar voluntariamente</li>
                            </ul>
                            <p><em>Não compartilhamos seus dados com terceiros para marketing.</em></p>
                        </div>

                        <div class="age-verification">
                            <label class="age-checkbox">
                                <input type="checkbox" id="ageCheckbox">
                                <span>Declaro que sou maior de 18 anos</span>
                            </label>

                            <label class="terms-checkbox">
                                <input type="checkbox" id="termsCheckbox">
                                <span>Li e aceito os <a href="termos.html" target="_blank">Termos de Serviço</a> e <a href="privacidade.html" target="_blank">Política de Privacidade</a></span>
                            </label>
                        </div>
                    </div>

                    <div class="consent-footer">
                        <button class="btn-consent-reject" id="rejectBtn">Não Aceito (Sair)</button>
                        <button class="btn-consent-accept" id="acceptBtn" disabled>Aceitar e Continuar</button>
                    </div>
                </div>
            </div>
        `;

    // Adicionar modal ao corpo
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Elementos do modal
    const modal = document.getElementById("consentModal");
    const ageCheckbox = document.getElementById("ageCheckbox");
    const termsCheckbox = document.getElementById("termsCheckbox");
    const acceptBtn = document.getElementById("acceptBtn");
    const rejectBtn = document.getElementById("rejectBtn");

    // Habilitar botão quando ambos checkboxes estiverem marcados
    function updateAcceptButton() {
      acceptBtn.disabled = !(ageCheckbox.checked && termsCheckbox.checked);
    }

    ageCheckbox.addEventListener("change", updateAcceptButton);
    termsCheckbox.addEventListener("change", updateAcceptButton);

    // Aceitar termos
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("termsAccepted", "true");
      localStorage.setItem("termsAcceptanceDate", new Date().toISOString());
      modal.remove();
      document.body.style.overflow = "auto";
    });

    // Rejeitar termos
    rejectBtn.addEventListener("click", function () {
      // Redirecionar para página de saída ou mostrar mensagem
      modal.innerHTML = `
                <div class="consent-modal">
                    <div class="consent-header">
                        <i class="fas fa-door-open"></i>
                        <h2>Obrigado pela visita!</h2>
                    </div>
                    <div class="consent-content">
                        <p>Para utilizar nossos serviços, é necessário aceitar os Termos de Serviço e Política de Privacidade.</p>
                        <p>Você pode voltar a qualquer momento para revisar e aceitar os termos.</p>
                    </div>
                    <div class="consent-footer">
                        <button class="btn-consent-accept" onclick="location.reload()">Reconsiderar</button>
                    </div>
                </div>
            `;
    });

    // Impedir scroll enquanto modal está aberto
    document.body.style.overflow = "hidden";
  }
}

// Adicionar CSS do modal
const consentCSS = `
    .consent-modal-overlay {
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
    }

    .consent-modal {
        background-color: var(--card-bg);
        border-radius: 15px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        border: 2px solid var(--accent);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .consent-header {
        background-color: var(--secondary);
        padding: 1.5rem 2rem;
        border-radius: 13px 13px 0 0;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 2px solid var(--accent);
    }

    .consent-header i {
        color: var(--accent);
        font-size: 2rem;
    }

    .consent-header h2 {
        margin: 0;
        color: var(--accent);
        font-size: 1.5rem;
    }

    .consent-content {
        padding: 2rem;
    }

    .consent-content p {
        margin-bottom: 1.5rem;
        color: #ccc;
        line-height: 1.6;
    }

    .consent-requirements, .data-collection-info {
        margin: 2rem 0;
        padding: 1.5rem;
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 10px;
        border-left: 4px solid var(--accent);
    }

    .consent-content h3 {
        color: var(--accent);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .consent-content ul {
        list-style: none;
        padding-left: 0;
        margin: 1rem 0;
    }

    .consent-content li {
        margin-bottom: 0.8rem;
        padding-left: 1.5rem;
        position: relative;
        color: #ccc;
    }

    .consent-content li:before {
        content: "•";
        position: absolute;
        left: 0;
        color: var(--accent);
        font-size: 1.2rem;
    }

    .consent-content a {
        color: var(--accent);
        text-decoration: underline;
    }

    .consent-content a:hover {
        text-decoration: none;
    }

    .age-verification {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
    }

    .age-checkbox, .terms-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 1rem;
        cursor: pointer;
        color: #ccc;
    }

    .age-checkbox input, .terms-checkbox input {
        margin-top: 3px;
        cursor: pointer;
    }

    .consent-footer {
        padding: 1.5rem 2rem;
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 0 0 13px 13px;
        display: flex;
        justify-content: space-between;
        gap: 15px;
        border-top: 1px solid var(--border);
    }

    .btn-consent-reject, .btn-consent-accept {
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-size: 1rem;
        transition: all 0.3s;
    }

    .btn-consent-reject {
        background-color: rgba(231, 76, 60, 0.1);
        color: #e74c3c;
        border: 1px solid #e74c3c;
    }

    .btn-consent-reject:hover {
        background-color: rgba(231, 76, 60, 0.2);
    }

    .btn-consent-accept {
        background-color: var(--accent);
        color: var(--primary);
    }

    .btn-consent-accept:hover:not(:disabled) {
        background-color: #0db83d;
        transform: translateY(-2px);
    }

    .btn-consent-accept:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    body.light-mode .consent-modal {
        background-color: white;
    }

    body.light-mode .consent-content p,
    body.light-mode .consent-content li {
        color: #666;
    }

    @media (max-width: 768px) {
        .consent-modal {
            max-height: 95vh;
        }

        .consent-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
            padding: 1rem;
        }

        .consent-content {
            padding: 1.5rem;
        }

        .consent-footer {
            flex-direction: column;
        }

        .btn-consent-reject, .btn-consent-accept {
            width: 100%;
        }
    }
`;

// Adicionar CSS ao documento
const style = document.createElement("style");
style.textContent = consentCSS;
document.head.appendChild(style);

// Chamar a função após o DOM carregar
document.addEventListener("DOMContentLoaded", setupConsentModal);
