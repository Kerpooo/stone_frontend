"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useVentas } from "@/hooks/useVenta";

export default function TablaVentas() {
    const { ventas, loading, error } = useVentas();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total venta</TableHead>
                        <TableHead >Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ventas.map((venta) => (
                        <TableRow key={venta.id_venta}>
                            <TableCell className="font-medium">{venta.fecha_venta}</TableCell>
                            <TableCell>${venta.total_venta}</TableCell>
                            <TableCell className="flex gap-4">
                                <Link href={`/ventas/${venta.id_venta}`}>
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
