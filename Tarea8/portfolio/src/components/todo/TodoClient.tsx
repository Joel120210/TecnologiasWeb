'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import styles from '@/app/todo/todo.module.scss';
import { FaCheck, FaTrash, FaMicrosoft } from 'react-icons/fa';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    status: 'completed' | 'notStarted';
}

interface TodoClientProps {
    session: any;
}

export default function TodoClient({ session }: TodoClientProps) {
    const [demoMode, setDemoMode] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    const isAuth = !!session;
    const showApp = isAuth || demoMode;

    useEffect(() => {
        if (demoMode) {
            setTasks([
                { id: '1', title: 'Revisar portafolio de Next.js', status: 'notStarted' },
                { id: '2', title: 'Integrar API de Microsoft', status: 'completed' },
                { id: '3', title: 'Jugar Tetris un rato', status: 'notStarted' },
            ]);
        } else if (isAuth) {
            // Real API fetch would go here
            // For this portfolio, we simulate fetching if no real keys
            // But if we had keys, we would call:
            // fetch('https://graph.microsoft.com/v1.0/me/todo/lists', ...)
            setTasks([
                { id: '1', title: 'Tarea desde Microsoft Graph (Simulado)', status: 'notStarted' },
                { id: '2', title: 'Conectado como ' + session.user?.name, status: 'completed' },
            ]);
        }
    }, [demoMode, isAuth, session]);

    const addTask = async () => {
        if (!newTask.trim()) return;

        if (demoMode) {
            const task: Task = {
                id: Math.random().toString(),
                title: newTask,
                status: 'notStarted'
            };
            setTasks([task, ...tasks]);
            setNewTask('');
        } else {
            // Call Graph API
            alert("En una implementación real, esto enviaría POST a Graph API.");
            // Optimistic update
            setTasks([{ id: 'temp', title: newTask, status: 'notStarted' }, ...tasks]);
            setNewTask('');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'completed' ? 'notStarted' : 'completed' } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.app}>
                <div className={styles.header}>
                    <div>
                        <h1>Task Master</h1>
                        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                            {isAuth ? 'Connected to Microsoft To-Do' : 'Modo Demo / Local'}
                        </p>
                    </div>
                    {isAuth ? (
                        <div className={styles.userProfile}>
                            {session.user?.image && <img src={session.user.image} alt="User" />}
                            <button onClick={() => signOut()}>Sign Out</button>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.9rem' }}>
                            <Link href="/" style={{ color: 'white', textDecoration: 'underline' }}>Exit</Link>
                        </div>
                    )}
                </div>

                {!showApp ? (
                    <div className={styles.authWall}>
                        <div style={{ fontSize: '4rem', color: '#2563eb' }}>
                            <FaMicrosoft />
                        </div>
                        <h2>Conectar con Microsoft To-Do</h2>
                        <p>
                            Inicia sesión con tu cuenta de Microsoft para gestionar tus tareas reales. <br />
                            O utiliza el modo demostración para probar la interfaz.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                            <button className={styles.loginBtn} onClick={() => signIn('azure-ad')}>
                                <FaMicrosoft /> Iniciar Sesión
                            </button>
                            <button className={styles.demoBtn} onClick={() => setDemoMode(true)}>
                                Probar Demo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.main}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Agregar nueva tarea..."
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            />
                            <button onClick={addTask}>Agregar</button>
                        </div>

                        <ul className={styles.taskList}>
                            {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No tienes tareas pendientes.</p>}
                            {tasks.map(task => (
                                <li key={task.id} className={`${styles.taskItem} ${task.status === 'completed' ? styles.completed : ''}`}>
                                    <div
                                        className={`${styles.checkbox} ${task.status === 'completed' ? styles.checked : ''}`}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        {task.status === 'completed' && <FaCheck size={12} />}
                                    </div>
                                    <span className={styles.taskText}>{task.title}</span>
                                    <button className={styles.deleteBtn} onClick={() => deleteTask(task.id)}>
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {!isAuth && (
                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <button className={styles.demoBtn} onClick={() => setDemoMode(false)}>
                                    Volver a Inicio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
