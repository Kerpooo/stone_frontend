"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    username: z.string().min(1, { message: "El usuario es obligatorio" }),
    password: z.string().min(1, { message: "La contraseña es obligatoria" }),
})

export default function LoginForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const result = await response.json();
            const { access } = result;

            // Guardar el token en una cookie
            Cookies.set('authToken', access, { expires: 7, path: '/' });

            toast({
                title: "Inicio de sesión exitoso",
                description: "¡Bienvenido de nuevo!",
            });

            // Redirigir al usuario a una página protegida
            window.location.href = "/ventas"
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al iniciar sesión.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex w-full items-center justify-center bg-background">
            <Card className="w-full max-w-md space-y-4">
                <CardHeader>
                    <CardTitle className="text-2xl">Bienvenido</CardTitle>
                    <CardDescription>Ingresa tu nombre de usuario y contraseña.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de Usuario</FormLabel>
                                        <FormControl>
                                            <Input id="username" type="text" placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input id="password" type="password" placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Iniciar Sesión
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
