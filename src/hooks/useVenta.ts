import { useEffect, useState } from 'react';
import Cookies from "js-cookie";


export interface DetalleVenta {
    id_detalle: number;
    cantidad: number;
    total: string;
    precio_unitario: string;
    nombre_producto: string;
    id_venta: number;
    id_producto: number;
}

export interface Venta {
    id_venta: number;
    fecha_venta: string;
    total_venta: string;
}

export interface VentaResponse {
    venta: Venta;
    detalles: DetalleVenta[];
}

export const useVentas = () => {

    const [ventas, setVentas] = useState<Venta[]>([]);
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
                const response = await fetch('http://127.0.0.1:8000/api/v1/ventas/', {
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
                setVentas(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { ventas, loading, error };
};


export function useVenta(id: string) {
    const [venta, setVenta] = useState<Venta | null>(null);
    const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVenta() {
            const token = Cookies.get('authToken');

            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/ventas/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener la venta');
                }

                const data: VentaResponse = await response.json();
                setVenta(data.venta);
                setDetalles(data.detalles);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchVenta();
    }, [id]);

    return { venta, detalles, loading, error };
}
