import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import TodoClient from "@/components/todo/TodoClient";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function TodoPage() {
    const session = await getServerSession(authOptions);

    return (
        <>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 100 }}>
                <Link href="/" style={{
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <FaArrowLeft /> Volver
                </Link>
            </div>
            <TodoClient session={session} />
        </>
    );
}
