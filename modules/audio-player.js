export class AudioPlayerManager {
  constructor() {
    this.players = new Map();
    this.currentAudio = null;
    this.isPlaying = false;
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

      this.players.set(playerId, {
        card,
        playBtn,
        progressBar,
        timeDisplay,
        isPlaying: false,
        currentTime: 0,
        duration: this.parseDuration(
          timeDisplay.textContent.split("/")[1].trim(),
        ),
      });

      playBtn.addEventListener("click", () => this.togglePlay(playerId));
    });
  }

  parseDuration(timeString) {
    const [min, sec] = timeString.split(":").map(Number);
    return min * 60 + sec;
  }

  togglePlay(playerId) {
    const player = this.players.get(playerId);

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

    player.isPlaying = true;
    this.currentAudio = playerId;
    this.isPlaying = true;

    const icon = player.playBtn.querySelector("i");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");

    this.startProgress(player);
  }

  pausePlayer(playerId) {
    const player = this.players.get(playerId);

    player.isPlaying = false;
    this.isPlaying = false;

    const icon = player.playBtn.querySelector("i");
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }

  stopPlayer(playerId) {
    const player = this.players.get(playerId);

    player.isPlaying = false;
    player.currentTime = 0;

    const icon = player.playBtn.querySelector("i");
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");

    player.progressBar.style.width = "0%";
    player.timeDisplay.textContent = `0:00 / ${this.formatTime(player.duration)}`;
  }

  startProgress(player) {
    let startTime = Date.now() - player.currentTime * 1000;

    const updateProgress = () => {
      if (!player.isPlaying) return;

      const elapsed = (Date.now() - startTime) / 1000;
      player.currentTime = Math.min(elapsed, player.duration);

      const progressPercent = (player.currentTime / player.duration) * 100;
      player.progressBar.style.width = `${progressPercent}%`;

      player.timeDisplay.textContent = `${this.formatTime(player.currentTime)} / ${this.formatTime(player.duration)}`;

      if (player.currentTime >= player.duration) {
        this.stopPlayer(
          Array.from(this.players.entries()).find(([id, p]) => p === player)[0],
        );
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  loadAudioData() {
    // Em um cenário real, isso carregaria dados de uma API
    const audioData = [
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

    localStorage.setItem("audioSamples", JSON.stringify(audioData));
  }
}
