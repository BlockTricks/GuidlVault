"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiProps {
    duration?: number;
}

export function Confetti({ duration = 3000 }: ConfettiProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Particle[] = [];
        const colors = ["#6366f1", "#a855f7", "#ec4899", "#14b8a6", "#f59e0b"];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            alpha: number;

            constructor() {
                this.x = width / 2;
                this.y = height / 2;
                this.vx = (Math.random() - 0.5) * 20;
                this.vy = (Math.random() - 0.5) * 20;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = 1;
            }

            draw() {
                if (!ctx) return;
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.5; // Gravity
                this.alpha -= 0.01;
            }
        }

        // Explosion
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        let animationId: number;
        const render = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            if (particles.length > 0) {
                animationId = requestAnimationFrame(render);
            }
        };

        render();

        // Resize handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
        />
    );
}
