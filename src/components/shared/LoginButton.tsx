"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const LoginButton = () => {


    const router = useRouter();

    return (
        <Button onClick={() => router.push("/")} className=" mt-2">
            Iniciar Sesión
        </Button>)
}
