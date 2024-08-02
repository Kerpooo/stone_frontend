import TablaProductos from "@/components/productos/table";
import { Button } from "@/components/ui/button";
import TablaVentas from "@/components/ventas/table";
import Link from "next/link";

export default function VentasPage() {
    return (
        <main className="container my-8" >

            <Link href={"/ventas/nuevo"}>
                <Button size={"sm"}>
                    Nuevo
                </Button>
            </Link>
            <TablaVentas />

        </main>
    );
}