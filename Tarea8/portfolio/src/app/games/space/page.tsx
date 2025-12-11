'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './space.module.scss';
import Link from 'next/link';

export default function SpaceDodge() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
    const [score, setScore] = useState(0);

    // Game constants
    const WIDTH = 800;
    const HEIGHT = 600;
    const PLAYER_SIZE = 30;

    // Refs for mutable game state avoids closure staleness in loop
    const playerRef = useRef({ x: WIDTH / 2, y: HEIGHT - 50, dx: 0 });
    const obstaclesRef = useRef<any[]>([]);
    const frameRef = useRef<number>(0);
    const scoreRef = useRef(0);
    const keysRef = useRef<{ [key: string]: boolean }>({});

    const spawnObstacle = useCallback(() => {
        const size = Math.random() * 30 + 20; // 20-50px
        obstaclesRef.current.push({
            x: Math.random() * (WIDTH - size),
            y: -size,
            width: size,
            height: size,
            speed: Math.random() * 3 + 2 + (scoreRef.current / 500) // Increase speed with score
        });
    }, []);

    const resetGame = () => {
        playerRef.current = { x: WIDTH / 2, y: HEIGHT - 50, dx: 0 };
        obstaclesRef.current = [];
        scoreRef.current = 0;
        setScore(0);
        setGameState('PLAYING');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let asteroidSpawnRate = 60;
        let frames = 0;

        const loop = () => {
            frames++;
            scoreRef.current++;
            if (frames % 10 === 0) setScore(scoreRef.current); // Update UI less frequently

            // Update Player
            if (keysRef.current['ArrowLeft']) playerRef.current.x -= 7;
            if (keysRef.current['ArrowRight']) playerRef.current.x += 7;

            // Clamp player
            playerRef.current.x = Math.max(0, Math.min(WIDTH - PLAYER_SIZE, playerRef.current.x));

            // Spawn Obstacles
            if (frames % Math.max(20, (60 - Math.floor(scoreRef.current / 100))) === 0) {
                spawnObstacle();
            }

            // Update Obstacles & Collision
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            // Draw Stars Background (simplified)
            ctx.fillStyle = '#ffffff';
            if (Math.random() > 0.9) ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 2, 2);

            // Draw Player
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            // Triangle ship
            ctx.moveTo(playerRef.current.x + PLAYER_SIZE / 2, playerRef.current.y);
            ctx.lineTo(playerRef.current.x + PLAYER_SIZE, playerRef.current.y + PLAYER_SIZE);
            ctx.lineTo(playerRef.current.x, playerRef.current.y + PLAYER_SIZE);
            ctx.fill();

            // Shadows/Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#3b82f6';

            // Draw Obstacles
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';

            for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
                const obs = obstaclesRef.current[i];
                obs.y += obs.speed;

                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

                // Remove off-screen
                if (obs.y > HEIGHT) {
                    obstaclesRef.current.splice(i, 1);
                    continue;
                }

                // Collision Check (AABB)
                if (
                    playerRef.current.x < obs.x + obs.width &&
                    playerRef.current.x + PLAYER_SIZE > obs.x &&
                    playerRef.current.y < obs.y + obs.height &&
                    playerRef.current.y + PLAYER_SIZE > obs.y
                ) {
                    setGameState('GAME_OVER');
                    return; // Stop loop
                }
            }

            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(frameRef.current);
    }, [gameState, spawnObstacle]);

    return (
        <div className={styles.container}>
            <div className={styles.scoreBoard}>Score: {score}</div>

            <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className={styles.canvas}
                style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
            />

            {gameState !== 'PLAYING' && (
                <div className={styles.overlay}>
                    <h1 className={styles.title}>{gameState === 'START' ? 'Space Dodge' : 'Game Over'}</h1>
                    {gameState === 'GAME_OVER' && <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Final Score: {score}</p>}
                    <button className={styles.startButton} onClick={resetGame}>
                        {gameState === 'START' ? 'Start Mission' : 'Try Again'}
                    </button>
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/games" style={{ color: '#888' }}>Quit</Link>
                    </div>
                </div>
            )}

            {gameState === 'PLAYING' && (
                <div style={{ marginTop: '1rem', color: '#666' }}>
                    Use Arrow Keys to Move
                </div>
            )}
        </div>
    );
}
