"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({
    children,
}:{
    children:React.ReactNode;
}){

    const pathname=usePathname();

    const showSidebar=
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/farm-profile");

    return(

        <>

        {showSidebar && <Sidebar/>}

        <main className={showSidebar?"mainContent":""}>

            {children}

        </main>

        </>

    );

}