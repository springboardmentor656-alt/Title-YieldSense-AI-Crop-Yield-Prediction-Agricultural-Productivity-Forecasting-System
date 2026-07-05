"use client";

import { useRouter } from "next/navigation";

export default function FarmProfile(){

const router = useRouter();


function saveFarm(){

alert("Farm details saved successfully");

router.push("/dashboard");

}


return(

<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-green-950 to-green-800">


<div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl w-96 text-white shadow-2xl">


<h1 className="text-3xl font-bold text-center">
🚜 Farm Profile
</h1>


<input
className="w-full p-3 mt-8 rounded-lg bg-white text-black"
placeholder="Farm Name"
/>


<input
className="w-full p-3 mt-5 rounded-lg bg-white text-black"
placeholder="Latitude"
/>


<input
className="w-full p-3 mt-5 rounded-lg bg-white text-black"
placeholder="Longitude"
/>


<input
className="w-full p-3 mt-5 rounded-lg bg-white text-black"
placeholder="Soil PH"
/>


<button

onClick={saveFarm}

className="
w-full bg-green-500
hover:bg-green-600
p-3 rounded-lg
mt-8 font-bold
"

>

Save Farm Details

</button>


</div>

</div>

)

}