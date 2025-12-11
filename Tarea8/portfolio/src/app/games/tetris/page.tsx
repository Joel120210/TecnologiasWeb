'use client';
import React, { useState } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { usePlayer, useStage, useGameStatus, createStage, checkCollision } from '@/hooks/useTetris';
import styles from './tetris.module.scss';
import { TETROMINOS } from '@/hooks/useTetris';
import Link from 'next/link';

export default function Tetris() {
    const [dropTime, setDropTime] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);

    const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
    const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
    const { score, rows, level, setLevel, setScore, setRows } = useGameStatus(rowsCleared);

    const movePlayer = (dir: number) => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over
            if (player.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const keyUp = ({ keyCode }: { keyCode: number }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    };

    const move = ({ keyCode }: { keyCode: number }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <div className={styles.container} role="button" tabIndex={0} onKeyDown={e => move(e)} onKeyUp={keyUp}>

            <div className={styles.gameWrapper}>
                <div className={styles.stage}>
                    {stage.map((row: any[], y: number) =>
                        row.map((cell: any[], x: number) => {
                            const type = cell[0];
                            // Get color from TETROMINOS. type is 0 or 'I', 'J' etc.
                            // We need map key. type is string 'I' or number 0.
                            const color = type === 0 ? '0,0,0' : TETROMINOS[type as keyof typeof TETROMINOS]?.color;
                            const isClear = type === 0;

                            return (
                                <div
                                    key={`${y}-${x}`}
                                    className={styles.cell}
                                    style={{
                                        background: isClear ? 'rgba(0,0,0,0.8)' : `rgba(${color}, 0.8)`,
                                        border: isClear ? 'none' : `4px solid rgba(${color}, 1)`,
                                        borderBottomColor: isClear ? 'none' : `rgba(${color}, 0.1)`,
                                        borderRightColor: isClear ? 'none' : `rgba(${color}, 1)`,
                                        borderTopColor: isClear ? 'none' : `rgba(${color}, 1)`,
                                        borderLeftColor: isClear ? 'none' : `rgba(${color}, 0.3)`,
                                    }}
                                />
                            )
                        })
                    )}
                </div>

                <aside className={styles.controls}>
                    {gameOver ? (
                        <div className={styles.display} style={{ color: 'red' }}>
                            <h3>Game Over</h3>
                        </div>
                    ) : (
                        <>
                            <div className={styles.display}>
                                <h3>Score</h3>
                                <p>{score}</p>
                            </div>
                            <div className={styles.display}>
                                <h3>Rows</h3>
                                <p>{rows}</p>
                            </div>
                            <div className={styles.display}>
                                <h3>Level</h3>
                                <p>{level}</p>
                            </div>
                        </>
                    )}
                    <button className={styles.startButton} onClick={startGame}>
                        {gameOver ? 'Try Again' : 'Start Game'}
                    </button>
                    <Link href="/games" style={{ marginTop: '1rem', color: '#666', textAlign: 'center' }}>
                        Quit Game
                    </Link>
                </aside>
            </div>

            <div className={styles.mobileControls}>
                <button onClick={() => movePlayer(-1)}>←</button>
                <button onClick={() => playerRotate(stage, 1)}>↻</button>
                <button onClick={() => movePlayer(1)}>→</button>
                <button style={{ gridColumn: "1 / span 3" }} onClick={dropPlayer}>↓</button>
            </div>
        </div>
    );
}
