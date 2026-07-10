import Link from "next/link";

export default function Sidebar(){

return(

<aside className="sidebar">

<h2>🌱 YieldSense</h2>

<Link href="/dashboard">Dashboard</Link>

<Link href="/farm-profile">Farm Details</Link>

</aside>

)

}