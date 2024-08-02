"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useProducto } from "@/hooks/useProductos";

const FormSchema = z.object({
    nombre: z.string().min(1, { message: "Obligatorio" }),
    descripcion: z.string(),
    precio: z.preprocess((a) => parseInt(z.string().parse(a), 10),
        z.number().gte(1, 'Mayor a 0')),
});

interface FormProps {
    id?: string
}

export default function ProductoForm({ id }: FormProps) {
    const { producto, loading: loading_producto, error } = useProducto(id)
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
            precio: 0,
        },
    });

    useEffect(() => {
        if (producto) {
            form.reset({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
            });
        }
    }, [producto, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        // Obtener el token de la cookie
        const token = Cookies.get('authToken');

        if (!token) {
            toast({
                title: "Error",
                description: "No se encontró el token de autenticación.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        if (producto) {

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/productos/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el producto.');
                }

                form.reset();
                toast({
                    title: "Producto creado",
                    description: "El producto se ha actualizado exitosamente.",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error: " + error,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }
        else {

            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/productos/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Error al crear el producto.');
                }

                form.reset();
                toast({
                    title: "Producto creado",
                    description: "El producto se ha creado exitosamente.",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error: " + error,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

    }

    return (
        <Card className="w-fit">
            <CardHeader>
                <CardTitle>Producto</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Descripción" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="precio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} placeholder="Precio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
