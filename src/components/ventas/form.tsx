"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useProductos } from "@/hooks/useProductos";

interface FormValues {
    venta: {
        id_producto: number;
        cantidad: number;
    }[];
}

export default function VentaForm() {
    const [loading, setLoading] = useState(false);

    const { products, loading: productsLoading, error } = useProductos();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            venta: [{ id_producto: 0, cantidad: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "venta",
    });

    async function onSubmit(data: FormValues) {
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
            const response = await fetch('http://127.0.0.1:8000/api/v1/ventas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al crear la venta.');
            }

            reset();
            toast({
                title: "Venta creada",
                description: "La venta se ha creado exitosamente.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Error: ${error}`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    if (productsLoading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Card className="w-fit">
            <CardHeader>
                <CardTitle>Crear Nueva Venta</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-4">
                            <Controller
                                name={`venta.${index}.id_producto`}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label>Producto</label>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un producto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.length > 0 && products.map(product => (
                                                    product.activo && (
                                                        <SelectItem key={product.id_producto} value={product.id_producto.toString()}>
                                                            {product.nombre}
                                                        </SelectItem>
                                                    )
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                            <Controller
                                name={`venta.${index}.cantidad`}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label>Cantidad</label>
                                        <Input type="number" min={1} {...field} />
                                    </div>
                                )}
                            />
                            <Button type="button" size={"icon"} className="mt-5" onClick={() => remove(index)} variant="destructive">
                                <Trash2Icon />
                            </Button>
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <Button type="button" size={"icon"} onClick={() => append({ id_producto: 0, cantidad: 1 })}>
                            <PlusIcon />
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Crear Venta"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
