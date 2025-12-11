import Link from 'next/link';
import { FaGamepad, FaChartPie, FaTasks, FaArrowRight } from 'react-icons/fa';
import styles from './page.module.scss';

export default function Home() {
  const modules = [
    {
      title: "Arcade Zone",
      description: "Colección de 3 videojuegos interactivos: Tetris, Space Dodge y Memory Puzzle.",
      icon: <FaGamepad className={styles.cardIcon} />,
      link: "/games",
      color: "blue"
    },
    {
      title: "Data Visualizer",
      description: "Herramienta de graficación dinámica para convertir datos en insights visuales.",
      icon: <FaChartPie className={styles.cardIcon} />,
      link: "/charts",
      color: "purple"
    },
    {
      title: "Task Master",
      description: "Gestión de tareas conectada a Microsoft To-Do con autenticación segura.",
      icon: <FaTasks className={styles.cardIcon} />,
      link: "/todo",
      color: "green"
    }
  ];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>FullStack Portfolio</h1>
      <p className={styles.subtitle}>
        Explora demostraciones técnicas de desarrollo web moderno, desde videojuegos hasta integraciones empresariales.
      </p>

      <div className={styles.grid}>
        {modules.map((mod, index) => (
          <Link href={mod.link} key={index} className={styles.card}>
            {mod.icon}
            <h2 className={styles.cardTitle}>{mod.title}</h2>
            <p className={styles.cardDesc}>{mod.description}</p>
            <div className={styles.arrow}>
              Explorar <FaArrowRight />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
