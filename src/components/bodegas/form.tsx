"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useBodega } from "@/hooks/useBodega";

const FormSchema = z.object({
    nombre: z.string().min(1, { message: "Obligatorio" }),
    capacidad_max: z.preprocess((a) => parseInt(z.string().parse(a), 10),
        z.number().gte(1, 'Mayor a 0')),
    ubicacion: z.string().min(1, { message: "Obligatorio" }),
});

interface FormProps {
    id?: string
}

export default function BodegaForm({ id }: FormProps) {
    const { bodega, loading: loading_bodega, error } = useBodega(id);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nombre: "",
            capacidad_max: 0,
            ubicacion: "",
        },
    });

    // Actualiza el formulario cuando se carga la bodega
    useEffect(() => {
        if (bodega) {
            form.reset({
                nombre: bodega.nombre,
                capacidad_max: bodega.capacidad_max,
                ubicacion: bodega.ubicacion,
            });
        }
    }, [bodega, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true); // Activa el estado de carga

        // Añadir capacidad_uso al payload de datos
        const payload = { ...data, capacidad_uso: 0 };

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


        if (bodega) {


            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/bodega/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Añadir el token en el encabezado
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Error al crear/actualizar la bodega.');
                }

                form.reset();
                toast({
                    title: "Bodega actualizada",
                    description: 'La bodega se ha actualizado',
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
                const response = await fetch(`http://127.0.0.1:8000/api/v1/bodega/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Error al crear/actualizar la bodega.');
                }

                form.reset();
                toast({
                    title: "Bodega creada",
                    description: `La bodega se ha creado exitosamente.`,
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error: " + error,
                    variant: "destructive",
                });
            } finally {
                setLoading(false); // Desactiva el estado de carga
            }
        }


    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{bodega ? "Actualizar Bodega" : "Crear Nueva Bodega"}</CardTitle>
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
                            name="capacidad_max"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacidad Máxima</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} placeholder="Capacidad Máxima" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ubicacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ubicación" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Guardando..." : bodega ? "Actualizar Bodega" : "Crear Bodega"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
