import TablaBodegas from "@/components/bodegas/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ProductosPage() {
    return (
        <main className="container my-8 flex justify-center items-center">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-end">
                    <Link href={"/bodegas/nuevo"}>
                        <Button size={"sm"}>
                            Nuevo
                        </Button>
                    </Link>
                </div>
                <Card className="p-8">
                    <CardHeader>
                        <CardTitle>Bodegas</CardTitle>
                    </CardHeader>
                    < TablaBodegas />
                </Card>
            </div>
        </main>
    );
}
