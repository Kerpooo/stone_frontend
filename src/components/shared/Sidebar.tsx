import Link from 'next/link'
import React from 'react'
import { MdOutlineStorefront } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";

export const Sidebar = () => {

    const navItems = [
        {
            path: "/bodegas",
            titulo: "Bodegas",
            icono: <MdOutlineStorefront size={24} className='mr-2' />
        },
        {
            path: "/productos",
            titulo: "Productos",
            icono: <BsBoxSeam size={24} className='mr-2' />
        },
        {
            path: "/inventario",
            titulo: "Inventario",
            icono: <MdOutlineInventory size={24} className='h-5 w-5 mr-2' />
        },
        {
            path: "/ventas",
            titulo: "Ventas",
            icono: <AiOutlineShoppingCart size={24} className='mr-2' />

        }

    ]
    return (
        <nav className="space-y-2 my-8" >
            {
                navItems.map(({ path, titulo, icono }) =>
                    <Link
                        key={path}
                        href={path}
                        className="flex items-center px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        prefetch={false}
                    >
                        {icono}
                        <span>{titulo}</span>
                    </Link>)
            }

            

        </nav>
    )
}
