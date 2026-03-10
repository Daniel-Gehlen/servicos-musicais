// modules/header.js - Versão corrigida
export class HeaderManager {
  constructor() {
    this.header = null;
  }

  init() {
    // Se já existe um header estático no HTML, apenas configura os links ativos
    if (document.querySelector('header')) {
      this.header = document.querySelector('header');
      this.setupActiveLinks();
      return;
    }
    this.createHeader();
    this.setupActiveLinks();
  }

  createHeader() {
    this.header = document.createElement("header");
    this.header.innerHTML = `
      <div class="container">
        <div class="logo">
          <i class="fas fa-music"></i>
          <span>Daniel Gehlen</span>
        </div>

        <nav>
          <ul>
            <li><a href="index.html">Início</a></li>
            <li><a href="index.html#sobre">Sobre</a></li>
            <li><a href="index.html#servicos">Serviços</a></li>
            <li><a href="audio.html">Amostras de Áudio</a></li>
            <li><a href="library.html">Biblioteca</a></li>
            <li><a href="projeto-formulario.html" class="btn btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.9rem;">Iniciar Projeto</a></li>
          </ul>
        </nav>

        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Buscar...">
        </div>
      </div>
    `;

    document.body.insertBefore(this.header, document.body.firstChild);
  }

  setupActiveLinks() {
    const currentPage = window.location.pathname.split("/").pop();
    const links = this.header.querySelectorAll("nav a");

    links.forEach((link) => {
      const linkPage = link.getAttribute("href");
      if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html") ||
        (currentPage === "index.html" && linkPage === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }
}
