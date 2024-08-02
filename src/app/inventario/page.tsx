import TablaInventario from "@/components/inventario/table";
import { Card } from "@/components/ui/card";

export default function InventarioPage() {
    return (
        <main className="container my-8 flex justify-center items-center">
            <div className="flex flex-col gap-4 w-full">

                <Card className="p-8">
                    <TablaInventario />
                </Card>
            </div>
        </main>
    );
}
