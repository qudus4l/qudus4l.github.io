/**
 * Deep Space Particle System
 * Creates a dynamic starfield with connecting lines (neural network effect)
 * Reacts to mouse movement
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: null, y: null };
        
        // Configuration
        this.particleCount = Math.min(window.innerWidth / 10, 150); // Responsive count
        this.connectionDistance = 150;
        this.mouseDistance = 200;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Re-calculate particle count on resize
        this.particleCount = Math.min(this.width / 10, 150);
        if (this.particles.length < this.particleCount) {
            this.addParticles(this.particleCount - this.particles.length);
        } else if (this.particles.length > this.particleCount) {
            this.particles = this.particles.slice(0, this.particleCount);
        }
    }

    createParticles() {
        this.particles = [];
        this.addParticles(this.particleCount);
    }

    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(16, 185, 129, ' // Primary or Secondary color
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.particles.forEach((p, index) => {
            // Movement
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Mouse interaction
            if (this.mouse.x != null) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.mouseDistance - distance) / this.mouseDistance;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    
                    p.vx += directionX;
                    p.vy += directionY;
                }
            }

            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + '0.8)';
            this.ctx.fill();

            // Connect particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / this.connectionDistance)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.draw());
    }

    animate() {
        this.draw();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only init if the canvas exists
    if (document.getElementById('heroCanvas')) {
        new ParticleSystem('heroCanvas');
    }
});
