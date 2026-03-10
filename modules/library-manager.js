export class LibraryManager {
  constructor() {
    this.sheetMusic = [];
    this.filters = {
      instrument: 'all',
      difficulty: 'all',
      category: 'all',
      search: ''
    };
    this.sortBy = 'recent';
  }

  init() {
    this.loadSheetMusic();
    this.setupFilters();
    this.setupSearch();
    this.setupSort();
    this.renderGrid();

    this.handleURLParams();

    // Ouvir eventos de busca do header
    window.addEventListener('librarySearch', (e) => {
      this.handleExternalSearch(e.detail);
    });
  }

  loadSheetMusic() {
    try {
      const storedData = localStorage.getItem('sheetMusicData');
      if (storedData) {
        this.sheetMusic = JSON.parse(storedData);
      } else {
        this.sheetMusic = this.getDefaultData();
        localStorage.setItem('sheetMusicData', JSON.stringify(this.sheetMusic));
      }
    } catch (error) {
      console.error('Erro ao carregar partituras:', error);
      this.sheetMusic = this.getDefaultData();
    }
  }

  getDefaultData() {
    return [
      {
        id: 1,
        title: "Andante - Matteo Carcassi",
        instrument: "violao",
        difficulty: "intermediario",
        category: "classico",
        description: "Peça clássica para violão solo, ideal para estudo de expressividade.",
        pages: 3,
        downloads: 142,
        recent: true,
        dateAdded: "2026-01-15"
      },
      {
        id: 2,
        title: "Bourrée - J.S. Bach",
        instrument: "violao",
        difficulty: "avancado",
        category: "classico",
        description: "Transcrição para violão da famosa peça barroca originalmente para violino.",
        pages: 2,
        downloads: 89,
        recent: true,
        dateAdded: "2026-01-10"
      },
      {
        id: 3,
        title: "Noite Feliz (Arranjo Solo)",
        instrument: "violao",
        difficulty: "iniciante",
        category: "evento",
        description: "Arranjo especial para violão solo da tradicional música natalina.",
        pages: 2,
        downloads: 215,
        recent: false,
        dateAdded: "2025-12-20"
      },
      {
        id: 4,
        title: "Blues em Mi - Guitarra",
        instrument: "guitarra",
        difficulty: "intermediario",
        category: "popular",
        description: "Progressão de blues com tablatura e notação musical completa.",
        pages: 1,
        downloads: 178,
        recent: true,
        dateAdded: "2026-01-12"
      },
      {
        id: 5,
        title: "Hava Nagila - Ukulele",
        instrument: "ukulele",
        difficulty: "iniciante",
        category: "popular",
        description: "Música tradicional hebraica adaptada para ukulele com cifras.",
        pages: 1,
        downloads: 94,
        recent: false,
        dateAdded: "2025-11-15"
      }
    ];
  }

  setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterGroup = btn.closest('.filter-group');
        if (!filterGroup) return;

        const filterTitle = filterGroup.querySelector('h4')?.textContent?.toLowerCase() || '';
        const filterValue = btn.dataset.filter;

        if (filterTitle.includes('instrumento')) {
          this.filters.instrument = filterValue;
        } else if (filterTitle.includes('dificuldade')) {
          this.filters.difficulty = filterValue;
        } else {
          this.filters.category = filterValue;
        }

        this.renderGrid();
      });
    });
  }

  setupSearch() {
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.renderGrid();
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch(this.filters.search);
        }
      });
    }
  }

  setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderGrid();
      });
    }
  }

  filterAndSortData() {
    let filtered = this.sheetMusic.filter(item => {
      // Aplicar filtros
      if (this.filters.instrument !== 'all' && item.instrument !== this.filters.instrument) {
        return false;
      }
      if (this.filters.difficulty !== 'all' && item.difficulty !== this.filters.difficulty) {
        return false;
      }
      if (this.filters.category !== 'all' && item.category !== this.filters.category) {
        return false;
      }

      // Aplicar busca
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const descMatch = item.description.toLowerCase().includes(searchTerm);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    // Aplicar ordenação
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'recent':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'popular':
          return b.downloads - a.downloads;
        case 'az':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = {
            iniciante: 1,
            intermediario: 2,
            avancado: 3
          };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }

  renderGrid() {
    const grid = document.getElementById('sheetMusicGrid');
    if (!grid) return;

    const filteredData = this.filterAndSortData();

    if (filteredData.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #aaa;">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <h3>Nenhuma partitura encontrada</h3>
          <p>Tente alterar os filtros ou a busca</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredData.map(item => this.createSheetCard(item)).join('');

    this.setupCardEvents();
  }

  createSheetCard(item) {
    const difficultyLabels = {
      iniciante: 'Iniciante',
      intermediario: 'Intermediário',
      avancado: 'Avançado'
    };

    const instrumentIcons = {
      violao: 'fa-guitar',
      guitarra: 'fa-guitar-electric',
      ukulele: 'fa-guitar',
      voz: 'fa-microphone'
    };

    const iconClass = instrumentIcons[item.instrument] || 'fa-music';
    const difficultyClass = item.difficulty;
    const difficultyText = difficultyLabels[item.difficulty] || item.difficulty;

    return `
      <div class="sheet-music-card" data-id="${item.id}">
        <div class="sheet-header">
          <div class="sheet-icon">
            <i class="fas ${iconClass}"></i>
          </div>
          ${item.recent ? '<span class="new-badge">NOVO</span>' : ''}
        </div>

        <div class="sheet-content">
          <h4>${item.title}</h4>
          <p>${item.description}</p>

          <div class="sheet-meta">
            <span><i class="fas fa-file-alt"></i> ${item.pages} página${item.pages > 1 ? 's' : ''}</span>
            <span><i class="fas fa-download"></i> ${item.downloads}</span>
            <span class="difficulty ${difficultyClass}">${difficultyText}</span>
          </div>
        </div>

        <div class="sheet-actions">
          <button class="btn-preview" data-id="${item.id}">
            <i class="fas fa-eye"></i> Visualizar
          </button>
          <button class="btn-download" data-id="${item.id}">
            <i class="fas fa-download"></i> Baixar
          </button>
        </div>
      </div>
    `;
  }

  setupCardEvents() {
    // Visualizar
    document.querySelectorAll('.btn-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        const id = card?.dataset.id;
        if (id) this.previewSheet(id);
      });
    });

    // Download
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        const id = card?.dataset.id;
        if (id) this.downloadSheet(id);
      });
    });
  }

  previewSheet(id) {
    const item = this.sheetMusic.find(s => s.id == id);
    if (item) {
      // Simular preview
      const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10000;">
          <div style="background: var(--card-bg); padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="color: var(--accent);">${item.title}</h3>
              <button class="close-preview" style="background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <p>${item.description}</p>
            <div style="margin-top: 2rem; text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
              <i class="fas fa-file-pdf" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
              <p>Prévia da partitura (PDF)</p>
              <p style="font-size: 0.9rem; color: #aaa;">Em um site real, aqui estaria o visualizador de PDF</p>
            </div>
            <button class="btn-download-from-preview" data-id="${item.id}" style="width: 100%; margin-top: 1rem; padding: 1rem; background: var(--accent); color: var(--primary); border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
              <i class="fas fa-download"></i> Baixar Partitura
            </button>
          </div>
        </div>
      `;

      const modal = document.createElement('div');
      modal.innerHTML = modalHTML;
      document.body.appendChild(modal);

      // Fechar modal
      modal.querySelector('.close-preview').addEventListener('click', () => {
        modal.remove();
      });

      // Download do modal
      modal.querySelector('.btn-download-from-preview').addEventListener('click', (e) => {
        const downloadId = e.target.closest('button').dataset.id;
        this.downloadSheet(downloadId);
        modal.remove();
      });

      // Fechar ao clicar fora
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  }

  downloadSheet(id) {
    const item = this.sheetMusic.find(s => s.id == id);
    if (item) {
      // Incrementar downloads
      item.downloads++;

      // Atualizar localStorage
      try {
        localStorage.setItem('sheetMusicData', JSON.stringify(this.sheetMusic));
      } catch (error) {
        console.error('Erro ao salvar downloads:', error);
      }

      // Simular download
      const downloadTime = new Date().toISOString();
      const downloadLog = JSON.parse(localStorage.getItem('downloadLog') || '[]');
      downloadLog.push({
        sheetId: item.id,
        title: item.title,
        downloadedAt: downloadTime
      });
      localStorage.setItem('downloadLog', JSON.stringify(downloadLog.slice(-50))); // Manter últimos 50

      // Mostrar feedback
      alert(`✅ Download iniciado: "${item.title}"\n\nO arquivo será baixado automaticamente.`);

      // Atualizar contador na UI
      const downloadSpan = document.querySelector(`[data-id="${id}"] .fa-download`)?.parentNode;
      if (downloadSpan) {
        downloadSpan.innerHTML = `<i class="fas fa-download"></i> ${item.downloads}`;
      }
    }
  }

  handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');

    if (searchParam) {
      this.filters.search = searchParam.toLowerCase();
      const searchInput = document.getElementById('librarySearch');
      if (searchInput) {
        searchInput.value = searchParam;
        searchInput.focus();
      }
      this.renderGrid();
    }
  }

  handleExternalSearch(term) {
    this.filters.search = term.toLowerCase();
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
      searchInput.value = term;
    }
    this.renderGrid();
  }

  performSearch(term) {
    this.filters.search = term.toLowerCase();
    this.renderGrid();
  }

  // Métodos para gerenciar partituras
  addSheetMusic(newSheet) {
    const newId = Math.max(...this.sheetMusic.map(s => s.id), 0) + 1;
    const sheetWithId = {
      ...newSheet,
      id: newId,
      downloads: 0,
      recent: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    this.sheetMusic.unshift(sheetWithId);
    localStorage.setItem('sheetMusicData', JSON.stringify(this.sheetMusic));
    this.renderGrid();

    return sheetWithId;
  }

  removeSheetMusic(id) {
    this.sheetMusic = this.sheetMusic.filter(s => s.id !== id);
    localStorage.setItem('sheetMusicData', JSON.stringify(this.sheetMusic));
    this.renderGrid();
  }
}
