import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

export interface Bodega {
    id: number;
    nombre: string;
    capacidad_max: number;
    capacidad_uso: number;
    espacio_disponible: number;
    ubicacion: string;
}

export function useBodega(id?: string) {
    const [bodega, setBodega] = useState<Bodega | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBodega() {
            const token = Cookies.get('authToken');

            if (!id) {
                setLoading(false);
                return;
            }

            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/bodega/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener la bodega');
                }

                const data: Bodega = await response.json();
                setBodega(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchBodega();
    }, [id]);

    return { bodega, loading, error };
}

export function useBodegas(cantidad?: number) {
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBodegas() {
            const token = Cookies.get('authToken');

            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/bodega/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las bodegas');
                }

                const data: Bodega[] = await response.json();

                // Filtra las bodegas que tienen suficiente espacio disponible
                const bodegasFiltradas = data.filter(bodega => bodega.espacio_disponible >= (cantidad || 0));

                setBodegas(bodegasFiltradas);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchBodegas();
    }, [cantidad]);

    return { bodegas, loading, error };
}
