"use client"
import { useParams } from 'next/navigation'
import ProductoForm from "@/components/productos/form";


export default function ProductoIdPage() {
    const params = useParams<{ id: string }>()
    return (
        <main className="container my-8 flex justify-center items-center" >
            <ProductoForm id={params.id} />
        </main>

    );
}

