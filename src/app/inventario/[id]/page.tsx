"use client"
import { useParams } from 'next/navigation'
import InventarioForm from '@/components/inventario/form';


export default function InventarioIdPage() {
    const params = useParams<{ id: string }>()
    return (
        <main className="container my-8 flex justify-center items-center" >
            <InventarioForm id={params.id} />
        </main>

    );
}

