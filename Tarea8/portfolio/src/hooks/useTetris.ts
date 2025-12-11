import { useState, useEffect, useCallback } from 'react';

export const TETROMINOS = {
    0: { shape: [[0]], color: '0, 0, 0' },
    I: { shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]], color: '80, 227, 230' },
    J: { shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], color: '36, 95, 223' },
    L: { shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']], color: '223, 173, 36' },
    O: { shape: [['O', 'O'], ['O', 'O']], color: '223, 217, 36' },
    S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: '48, 211, 56' },
    T: { shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]], color: '132, 61, 198' },
    Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: '227, 78, 78' },
};

export const randomTetromino = () => {
    const tetrominos = 'IJLOSTZ';
    const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return TETROMINOS[randTetromino as keyof typeof TETROMINOS];
};

export const createStage = () =>
    Array.from(Array(20), () =>
        new Array(12).fill([0, 'clear'])
    );

export const checkCollision = (player: any, stage: any, { x: moveX, y: moveY }: { x: number, y: number }) => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
        for (let x = 0; x < player.tetromino[y].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (player.tetromino[y][x] !== 0) {
                if (
                    // 2. Check that our move is inside the game areas height (y)
                    // We shouldn't go through the bottom of the play area
                    !stage[y + player.pos.y + moveY] ||
                    // 3. Check that our move is inside the game areas width (x)
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    // 4. Check that the cell we're moving to isn't set to clear
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
                    'clear'
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const useGameStatus = (rowsCleared: number) => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (rowsCleared > 0) {
            const linePoints = [40, 100, 300, 1200];
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
            setLevel(prev => prev + 1); // Simple level up
        }
    }, [rowsCleared, level]);

    return { score, setScore, rows, setRows, level, setLevel };
};

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const rotate = (matrix: any, dir: number) => {
        // Make the rows to become cols (transpose)
        const rotatedPos = matrix.map((_: any, index: number) =>
            matrix.map((col: any) => col[index])
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedPos.map((row: any) => row.reverse());
        return rotatedPos.reverse();
    };

    const playerRotate = (stage: any, dir: number) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({ x, y, collided }: { x: number, y: number, collided: boolean }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: 12 / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false,
        });
    }, []);

    return { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer };
};

export const useStage = (player: any, resetPlayer: any) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = (newStage: any) => {
            return newStage.reduce((ack: any, row: any) => {
                if (row.findIndex((cell: any) => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);
        };

        const updateStage = (prevStage: any) => {
            // First flush the stage from the previous render
            const newStage = prevStage.map((row: any) =>
                row.map((cell: any) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
            );

            // Then draw the tetromino
            player.tetromino.forEach((row: any, y: any) => {
                row.forEach((value: any, x: any) => {
                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`,
                        ];
                    }
                });
            });

            // Then check if it collided
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;
        };

        setStage(prev => updateStage(prev));
    }, [player, resetPlayer]);

    return { stage, setStage, rowsCleared };
};
