"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useInventario } from "@/hooks/useInventario";
import { useBodegas } from "@/hooks/useBodega";

const FormSchema = z.object({
    cantidad_disponible: z.preprocess((a) => parseInt(z.string().parse(a), 10),
        z.number().gte(1, 'Mayor a 0')),
    id_bodega: z.preprocess((a) => parseInt(z.string().parse(a), 10),
        z.number().gte(1, 'Mayor a 0')),
});

interface FormProps {
    id?: string;
}

export default function InventarioForm({ id }: FormProps) {
    const { inventario, loading: loading_inventario, error: error_inventario } = useInventario(id);
    const [loading, setLoading] = useState(false);
    const [cantidadDisponible, setCantidadDisponible] = useState(0);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            cantidad_disponible: 0,
            id_bodega: 0,
        },
    });

    // Obtener bodegas disponibles según la cantidad
    const { bodegas, loading: loading_bodegas, error: error_bodegas } = useBodegas(cantidadDisponible);

    // Actualiza el formulario cuando se carga el inventario
    useEffect(() => {
        if (inventario) {
            setCantidadDisponible(inventario.cantidad_disponible);
            form.reset({
                cantidad_disponible: inventario.cantidad_disponible,
                id_bodega: inventario.id_bodega,
            });
        }
    }, [inventario, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

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

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/inventario/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el inventario.');
            }

            form.reset();
            toast({
                title: "Inventario actualizado",
                description: "El inventario se ha actualizado exitosamente.",
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Actualizar Inventario</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                        <FormField
                            control={form.control}
                            name="cantidad_disponible"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad Disponible</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} placeholder="Cantidad Disponible" {...field} onChange={(e) => {
                                            field.onChange(e);
                                            setCantidadDisponible(Number(e.target.value));
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="id_bodega"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID de Bodega</FormLabel>
                                    <Select onValueChange={field.onChange} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar Bodega" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {bodegas.map(bodega => (
                                                <SelectItem key={bodega.id} value={String(bodega.id)}>
                                                    {bodega.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Guardando..." : "Actualizar Inventario"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
