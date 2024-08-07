"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useInventarioList } from "@/hooks/useInventario";

export default function TablaInventario() {
    const { inventario, loading, error } = useInventarioList();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Disponible</TableHead>
                        <TableHead>Bodega</TableHead>
                        <TableHead >Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventario.map((inventario) => (
                        <TableRow key={inventario.id_inventario}>
                            <TableCell className="font-medium">{inventario.nombre_producto}</TableCell>
                            <TableCell>{inventario.cantidad_disponible}</TableCell>
                            <TableCell>{inventario.nombre_bodega}</TableCell>
                            <TableCell className="flex gap-4">
                                <Link href={`/inventario/${inventario.id_inventario}`}>
                                    <Button size="icon">
                                        <PencilIcon size={15} ></PencilIcon>
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
