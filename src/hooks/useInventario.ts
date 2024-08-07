import { useEffect, useState } from 'react';
import Cookies from "js-cookie";



export interface Inventario {
    id_inventario: number;
    id_producto: string;
    cantidad_disponible: number;
    id_bodega: number;
    nombre_producto: string;
    nombre_bodega: string;
}

export const useInventarioList = () => {

    const [inventario, setInventario] = useState<Inventario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = Cookies.get('authToken');

            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/inventario/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los productos.');
                }

                const data = await response.json();
                setInventario(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { inventario, loading, error };
};


export function useInventario(id?: string) {
    const [inventario, setInventario] = useState<Inventario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBodega() {
            const token = Cookies.get('authToken');



            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/inventario/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener la bodega');
                }

                const data: Inventario = await response.json();
                setInventario(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchBodega();
    }, [id]);

    return { inventario, loading, error };
}
