const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorDot = document.getElementById('cursor-dot');

let width, height;
let particles = [];

// Mouse state
const mouse = { x: -1000, y: -1000 }; // Start off-screen

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Direct update for dot
    cursorDot.style.left = `${mouse.x}px`;
    cursorDot.style.top = `${mouse.y}px`;

    // Create particles on move - reduced count for performance/aesthetics
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
});

// Interactive elements hover effect
document.querySelectorAll('a, button, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovered'));
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5; // Smaller particles
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        // Green and Gold palette
        this.color = Math.random() > 0.6 ? '#00ff88' : '#ffd700'; 
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.96; // Shrink
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
    }
}

function animate() {
    // Clear with trail effect - slightly darker for deep space feel
    ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
                // Mix colors
                const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                grad.addColorStop(0, particles[i].color);
                grad.addColorStop(1, particles[j].color);
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.4;
                ctx.globalAlpha = particles[i].life * 0.4;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Connect cursor to nearby particles
    for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
        }
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();
