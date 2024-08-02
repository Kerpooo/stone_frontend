"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useBodegas } from "@/hooks/useBodega";

export default function TablaBodegas() {
    const { bodegas, loading, error } = useBodegas();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ubicacion</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead >Uso</TableHead>
                        <TableHead >Disponible</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bodegas.map((bodega) => (
                        <TableRow key={bodega.id}>
                            <TableCell className="font-medium">{bodega.nombre}</TableCell>
                            <TableCell>{bodega.ubicacion}</TableCell>
                            <TableCell>{bodega.capacidad_max}</TableCell>
                            <TableCell>{bodega.capacidad_uso}</TableCell>
                            <TableCell>{bodega.espacio_disponible}</TableCell>
                            <TableCell className="flex gap-4">
                                <Link href={`/bodegas/${bodega.id}`}>
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
