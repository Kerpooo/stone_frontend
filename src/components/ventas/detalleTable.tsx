import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useVenta } from "@/hooks/useVenta";

export default function DetallesVenta({ id }: { id: string }) {
    const { venta, detalles, loading, error } = useVenta(id);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Detalles de la Venta</h2>
            <div className="mb-4">
                <p><strong>Fecha:</strong> {venta?.fecha_venta}</p>
                <p><strong>Total Venta:</strong> ${venta?.total_venta}</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {detalles.map((detalle) => (
                        <TableRow key={detalle.id_detalle}>
                            <TableCell>{detalle.nombre_producto}</TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            <TableCell>${detalle.precio_unitario}</TableCell>
                            <TableCell>${detalle.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
