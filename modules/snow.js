export class SnowEffect {
    constructor(options = {}) {
        this.options = {
            count: options.count || 50,
            symbol: options.symbol || '❄',
            minSize: options.minSize || 10,
            maxSize: options.maxSize || 25,
            minDuration: options.minDuration || 5,
            maxDuration: options.maxDuration || 15
        };
        this.container = null;
    }

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'snow-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                overflow: hidden;
            `;
            document.body.appendChild(this.container);
        }

        for (let i = 0; i < this.options.count; i++) {
            this.createFlake();
        }
    }

    createFlake() {
        const flake = document.createElement('div');
        flake.textContent = this.options.symbol;
        
        const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
        const left = Math.random() * 100;
        const duration = Math.random() * (this.options.maxDuration - this.options.minDuration) + this.options.minDuration;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.7 + 0.3;

        flake.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${left}%;
            font-size: ${size}px;
            color: white;
            opacity: ${opacity};
            user-select: none;
            cursor: default;
            animation: fall ${duration}s linear ${delay}s infinite;
        `;

        this.container.appendChild(flake);
    }
}

// Add animation to document
if (!document.getElementById('snow-style')) {
    const style = document.createElement('style');
    style.id = 'snow-style';
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            100% {
                transform: translateY(110vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}
