'use client';
import { useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './charts.module.scss';
import Link from 'next/link';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ChartsPage() {
    const [chartType, setChartType] = useState('bar');
    const [data, setData] = useState([
        { name: 'Ene', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Abr', value: 200 },
    ]);
    const [newLabel, setNewLabel] = useState('');
    const [newValue, setNewValue] = useState('');

    const addData = () => {
        if (newLabel && newValue) {
            setData([...data, { name: newLabel, value: Number(newValue) }]);
            setNewLabel('');
            setNewValue('');
        }
    };

    const removeData = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const renderChart = () => {
        if (data.length === 0) return <p>No data to display</p>;

        switch (chartType) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#444' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'bar':
            default:
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#444' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>← Back to Portfolio</Link>
                </div>
                <h1>Data Visualization Engine</h1>
                <p>Genera gráficos dinámicos en tiempo real.</p>
            </div>

            <div className={styles.workspace}>
                <div className={styles.editor}>
                    <div className={styles.controlGroup}>
                        <label>Tipo de Gráfico</label>
                        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Agregar Datos</label>
                        <div className={styles.dataForm}>
                            <input
                                type="text"
                                placeholder="Etiqueta (ej. Mayo)"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Valor"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                            <button onClick={addData}>+</button>
                        </div>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Datos Actuales</label>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Label</th>
                                    <th>Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.name}</td>
                                        <td>{row.value}</td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => removeData(i)}>×</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.preview}>
                    {renderChart()}
                </div>
            </div>
        </div>
    );
}
