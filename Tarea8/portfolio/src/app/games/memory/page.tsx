'use client';
import { useState, useEffect } from 'react';
import { FaRobot, FaMicrochip, FaGhost, FaDragon, FaBolt, FaMeteor, FaBiohazard, FaAtom, FaQuestion } from 'react-icons/fa';
import styles from './memory.module.scss';
import Link from 'next/link';

const CARD_IMAGES = [
    { src: 'robot', icon: <FaRobot /> },
    { src: 'chip', icon: <FaMicrochip /> },
    { src: 'ghost', icon: <FaGhost /> },
    { src: 'dragon', icon: <FaDragon /> },
    { src: 'bolt', icon: <FaBolt /> },
    { src: 'meteor', icon: <FaMeteor /> },
    { src: 'bio', icon: <FaBiohazard /> },
    { src: 'atom', icon: <FaAtom /> },
];

interface Card {
    id: number;
    src: string;
    icon: JSX.Element;
    matched: boolean;
}

export default function MemoryGame() {
    const [cards, setCards] = useState<Card[]>([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState<Card | null>(null);
    const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);

    // Shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...CARD_IMAGES, ...CARD_IMAGES]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random(), matched: false }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurns(0);
        setWon(false);
    };

    // Handle a choice
    const handleChoice = (card: Card) => {
        if (choiceOne && choiceOne.id === card.id) return; // Prevent double click
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    // Compare 2 selected cards
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.src === choiceTwo.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.src === choiceOne.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                });
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    // Check matched
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.matched)) {
            setTimeout(() => setWon(true), 500);
        }
    }, [cards]);

    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns(prevTurns => prevTurns + 1);
        setDisabled(false);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Cyber Match</h1>
                <div style={{ fontSize: '1rem', marginTop: '1rem', color: '#666' }}>
                    <Link href="/games">Esc</Link>
                </div>
            </header>

            <div className={styles.grid}>
                {cards.map(card => (
                    <div
                        key={card.id}
                        className={`${styles.card} ${card === choiceOne || card === choiceTwo || card.matched ? styles.flipped : ''} ${card.matched ? styles.matched : ''}`}
                        onClick={() => !disabled && !card.matched ? handleChoice(card) : null}
                    >
                        <div className={`${styles.cardFace} ${styles.front}`}>
                            <FaQuestion />
                        </div>
                        <div className={`${styles.cardFace} ${styles.back}`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.stats}>
                <p>Turns: {turns}</p>
            </div>

            {won && (
                <div className={styles.winScreen}>
                    <h2>System Hackers!</h2>
                    <p style={{ color: '#fff', marginBottom: '2rem' }}>Turns: {turns}</p>
                    <button onClick={shuffleCards}>New Game</button>
                </div>
            )}
        </div>
    );
}
