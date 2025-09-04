import React, { useEffect, useRef, useState } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  // Brand colors
  const colors = {
    yellow: '#FFD700',
    red: '#FF0000',
    pink: '#FF007F',
    blue: '#007BFF',
    white: '#FFFFFF'
  };

  // Particle class
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.life = Math.random() * 100 + 100;
      this.maxLife = this.life;
      this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      };
      this.acceleration = {
        x: 0,
        y: 0
      };
      this.colors = Object.values(colors);
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.type = Math.random() > 0.7 ? 'film' : 'circle'; // 30% chance for film strip particles
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.size = Math.random() * 3 + 1;
      this.life = Math.random() * 100 + 100;
      this.maxLife = this.life;
    }

    update(mouse) {
      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const angle = Math.atan2(dy, dx);
        this.acceleration.x = Math.cos(angle) * force * 0.5;
        this.acceleration.y = Math.sin(angle) * force * 0.5;
      } else {
        this.acceleration.x *= 0.95;
        this.acceleration.y *= 0.95;
      }

      // Update velocity and position
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.x *= 0.99; // Friction
      this.velocity.y *= 0.99;

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Boundary wrapping
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;

      // Life cycle
      this.life--;
      if (this.life <= 0) {
        this.reset();
      }
    }

    draw(ctx) {
      const alpha = this.life / this.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha * 0.8;

      if (this.type === 'film') {
        // Draw film strip particle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size, this.y - this.size/4, this.size * 2, this.size/2);
        // Film holes
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(
            this.x - this.size + (i * this.size/2), 
            this.y - this.size/8, 
            this.size/4, 
            this.size/4
          );
        }
      } else {
        // Draw circular particle with glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Connection lines between particles
  const drawConnections = (ctx, particles) => {
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const alpha = (100 - distance) / 100 * 0.3;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = colors.yellow;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  };

  // Mouse trail effect
  const drawMouseTrail = (ctx, mouse) => {
    const gradient = ctx.createRadialGradient(
      mouse.x, mouse.y, 0,
      mouse.x, mouse.y, 50
    );
    gradient.addColorStop(0, colors.red + '40');
    gradient.addColorStop(1, colors.red + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas));
    }

    // Mouse event handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mouseRef.current);
        particle.draw(ctx);
      });

      // Draw connections
      drawConnections(ctx, particlesRef.current);

      // Draw mouse trail
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        drawMouseTrail(ctx, mouseRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ 
        background: 'transparent',
        zIndex: 1
      }}
    />
  );
};

export default ParticleBackground;

