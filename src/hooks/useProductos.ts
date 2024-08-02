// hooks/useProducts.ts
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface Producto {
    id_producto: number;
    nombre: string;
    precio: number;
    activo: boolean;
    descripcion?: string
}

export const useProductos = () => {
    const [products, setProducts] = useState<Producto[]>([]);
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
                const response = await fetch('http://127.0.0.1:8000/api/v1/productos/', {
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
                setProducts(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};





export const useProducto = (id?: string) => {
    const [producto, setProducto] = useState<Producto>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = Cookies.get('authToken');


            if (!id) {
                return
            }

            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/productos/${id}`, {
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
                setProducto(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { producto, loading, error };
};

