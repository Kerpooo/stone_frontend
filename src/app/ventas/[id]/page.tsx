"use client"
import { useParams } from 'next/navigation'
import DetallesVenta from '@/components/ventas/detalleTable';


export default function VentaIdPage() {
    const params = useParams<{ id: string }>()
    return (
        <main className="container my-8 flex justify-center items-center" >
            <DetallesVenta id={params.id} />
        </main>

    );
}

