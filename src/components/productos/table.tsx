"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { useProductos } from "@/hooks/useProductos";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export default function TablaProductos() {
    const { products, loading, error } = useProductos();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Activo</TableHead>
                        <TableHead >Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((producto) => (
                        <TableRow key={producto.id_producto}>
                            <TableCell className="font-medium">{producto.nombre}</TableCell>
                            <TableCell>${producto.precio}</TableCell>
                            <TableCell>{producto.activo ? <Badge>Activo</Badge> : <Badge>Inactivo</Badge>}</TableCell>
                            <TableCell className="flex gap-4">
                                <Link href={`/productos/${producto.id_producto}`}>
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
