export class AudioPlayerManager {
  constructor() {
    this.players = new Map();
    this.currentAudio = null;
    this.isPlaying = false;
    this.audioProgressInterval = null;
  }

  init(containerSelector = ".audio-grid") {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.setupPlayers();
    this.loadAudioData();
  }

  setupPlayers() {
    this.container.querySelectorAll(".audio-card").forEach((card, index) => {
      const playerId = `audio-${index}`;
      const playBtn = card.querySelector(".play-btn");
      const progressBar = card.querySelector(".audio-progress");
      const timeDisplay = card.querySelector(".time");

      if (!playBtn || !progressBar || !timeDisplay) return;

      const durationText =
        timeDisplay.textContent.split("/")[1]?.trim() || "2:45";

      this.players.set(playerId, {
        card,
        playBtn,
        progressBar,
        timeDisplay,
        isPlaying: false,
        currentTime: 0,
        duration: this.parseDuration(durationText),
        playerId,
      });

      playBtn.addEventListener("click", () => this.togglePlay(playerId));

      // Adicionar funcionalidade de arrastar na barra de progresso
      progressBar.parentElement.addEventListener("click", (e) => {
        const rect = progressBar.parentElement.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.seek(playerId, percent);
      });
    });
  }

  parseDuration(timeString) {
    if (!timeString) return 165; // 2:45 padrão

    const parts = timeString.split(":");
    if (parts.length === 2) {
      const min = parseInt(parts[0]) || 0;
      const sec = parseInt(parts[1]) || 0;
      return min * 60 + sec;
    }
    return 165; // Fallback
  }

  togglePlay(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    if (this.currentAudio && this.currentAudio !== playerId) {
      this.stopPlayer(this.currentAudio);
    }

    if (player.isPlaying) {
      this.pausePlayer(playerId);
    } else {
      this.playPlayer(playerId);
    }
  }

  playPlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.isPlaying = true;
    this.currentAudio = playerId;
    this.isPlaying = true;

    const icon = player.playBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    }

    this.startProgress(player);
  }

  pausePlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.isPlaying = false;
    this.isPlaying = false;

    const icon = player.playBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }

    if (this.audioProgressInterval) {
      clearInterval(this.audioProgressInterval);
      this.audioProgressInterval = null;
    }
  }

  stopPlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.isPlaying = false;
    player.currentTime = 0;
    this.isPlaying = false;

    const icon = player.playBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }

    player.progressBar.style.width = "0%";
    player.timeDisplay.textContent = `0:00 / ${this.formatTime(player.duration)}`;

    if (this.audioProgressInterval) {
      clearInterval(this.audioProgressInterval);
      this.audioProgressInterval = null;
    }
  }

  seek(playerId, percent) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.currentTime = percent * player.duration;
    player.progressBar.style.width = `${percent * 100}%`;
    player.timeDisplay.textContent = `${this.formatTime(player.currentTime)} / ${this.formatTime(player.duration)}`;
  }

  startProgress(player) {
    if (this.audioProgressInterval) {
      clearInterval(this.audioProgressInterval);
    }

    const startTime = Date.now() - player.currentTime * 1000;

    this.audioProgressInterval = setInterval(() => {
      if (!player.isPlaying) {
        clearInterval(this.audioProgressInterval);
        this.audioProgressInterval = null;
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      player.currentTime = Math.min(elapsed, player.duration);

      const progressPercent = (player.currentTime / player.duration) * 100;
      player.progressBar.style.width = `${progressPercent}%`;

      player.timeDisplay.textContent = `${this.formatTime(player.currentTime)} / ${this.formatTime(player.duration)}`;

      if (player.currentTime >= player.duration) {
        this.stopPlayer(player.playerId);
      }
    }, 100);
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  loadAudioData() {
    // Carregar dados de áudio do localStorage ou usar padrão
    try {
      const storedData = localStorage.getItem("audioSamples");
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.warn("Não foi possível carregar dados de áudio:", error);
    }

    // Dados padrão
    const defaultData = [
      {
        title: "Andante - Matteo Carcassi",
        description:
          "Peça clássica para violão, demonstra técnica apurada e expressividade.",
        duration: "2:45",
        tags: ["clássico", "violão erudito"],
      },
      {
        title: "Bourrée - J.S. Bach",
        description: "Transcrição para violão da famosa peça barroca.",
        duration: "1:52",
        tags: ["barroco", "transcrição"],
      },
    ];

    localStorage.setItem("audioSamples", JSON.stringify(defaultData));
    return defaultData;
  }

  // Método para atualizar interface com dados
  updateAudioCards(audioData) {
    if (!this.container) return;

    this.container.innerHTML = "";

    audioData.forEach((audio, index) => {
      const card = document.createElement("div");
      card.className = "audio-card";
      card.innerHTML = `
        <div class="audio-info">
          <h3>${audio.title}</h3>
          <p>${audio.description}</p>
          <div class="audio-meta">
            <span><i class="fas fa-clock"></i> ${audio.duration}</span>
            <span><i class="fas fa-guitar"></i> Violão Erudito</span>
          </div>
        </div>
        <div class="audio-player">
          <button class="play-btn" data-audio="audio-${index}">
            <i class="fas fa-play"></i>
          </button>
          <div class="progress-container">
            <div class="progress-bar audio-progress"></div>
          </div>
          <span class="time">0:00 / ${audio.duration}</span>
        </div>
      `;
      this.container.appendChild(card);
    });

    // Reconfigurar players
    this.setupPlayers();
  }

  // Método para adicionar novo áudio
  addAudioSample(audioData) {
    const currentData = this.loadAudioData();
    currentData.push(audioData);
    localStorage.setItem("audioSamples", JSON.stringify(currentData));
    this.updateAudioCards(currentData);
  }
}
