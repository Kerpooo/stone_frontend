"use client"
import React, { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const Logout = () => {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const tokenExiste = Cookies.get('authToken');
        setToken(tokenExiste);
    }, []);

    async function handleLogout() {
        Cookies.remove('authToken');
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
        });
        setToken(null);
        router.push("/");
    }

    if (token) {
        return (
            <div className="flex justify-end mt-2 mx-2">
                <Button onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </div>
        )

    }


}
