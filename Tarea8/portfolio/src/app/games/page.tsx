import Link from 'next/link';
import { FaGamepad, FaRocket, FaBrain, FaArrowLeft } from 'react-icons/fa';
import styles from './page.module.scss'; // Reusing or new? New specific styles.

export default function GamesMenu() {
    const games = [
        {
            title: "Neon Tetris",
            desc: "El clásico juego de bloques con un estilo neón futurista.",
            icon: <FaGamepad />,
            link: "/games/tetris",
            color: "var(--accent)"
        },
        {
            title: "Space Dodge",
            desc: "Esquiva obstáculos en el espacio a alta velocidad.",
            icon: <FaRocket />,
            link: "/games/space",
            color: "var(--primary)"
        },
        {
            title: "Cyber Memory",
            desc: "Pon a prueba tu memoria con este puzzle cyberpunk.",
            icon: <FaBrain />,
            link: "/games/memory",
            color: "#10b981"
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}><FaArrowLeft /> Volver</Link>
                <h1 className={styles.title}>Arcade Zone</h1>
            </header>

            <div className={styles.grid}>
                {games.map((game, i) => (
                    <Link href={game.link} key={i} className={styles.card} style={{ borderColor: game.color }}>
                        <div className={styles.icon} style={{ color: game.color }}>{game.icon}</div>
                        <h2>{game.title}</h2>
                        <p>{game.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
