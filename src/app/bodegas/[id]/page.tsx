"use client"
import { useParams } from 'next/navigation'
import BodegaForm from '@/components/bodegas/form';


export default function ProductoIdPage() {
    const params = useParams<{ id: string }>()
    return (
        <main className="container my-8 flex justify-center items-center" >
            <BodegaForm id={params.id} />
        </main>

    );
}

