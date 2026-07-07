"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function FarmProfile(){

const router = useRouter();


const [farm,setFarm] = useState({

 farmName:"",
 latitude:"",
 longitude:"",

 nitrogen:"",
 phosphorus:"",
 potassium:"",
 soilPH:""

});



const handleChange=(e:any)=>{

 setFarm({

  ...farm,

  [e.target.name]:e.target.value

 });

};



const saveFarm=()=>{


 console.log(farm);


 alert("Farm details saved");


 router.push("/dashboard");


};



return(

<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-green-950 to-green-800">


<div className="bg-white/10 p-10 rounded-2xl w-96 text-white shadow-2xl">


<h1 className="text-3xl font-bold text-center mb-6">

🚜 Farm Profile

</h1>




<p className="text-green-300 mb-3 font-semibold">

🌾 Farm Details

</p>



{[

["farmName","Farm Name"],

["latitude","Latitude"],

["longitude","Longitude"]

].map(([name,text])=>(


<input

key={name}

name={name}

placeholder={text}

onChange={handleChange}

className="
w-full p-3 mb-4 rounded-lg
bg-white text-black outline-none
"

/>


))}




<p className="text-green-300 mb-3 mt-3 font-semibold">

🌱 Soil Details

</p>



{[

["nitrogen","Nitrogen (N)"],

["phosphorus","Phosphorus (P)"],

["potassium","Potassium (K)"],

["soilPH","Soil pH"]

].map(([name,text])=>(


<input

key={name}

name={name}

placeholder={text}

onChange={handleChange}

className="
w-full p-3 mb-4 rounded-lg
bg-white text-black outline-none
"

/>


))}





<button

onClick={saveFarm}

className="
w-full bg-green-500 
hover:bg-green-600
p-3 rounded-lg 
font-bold
"

>

Save Farm Details

</button>



</div>


</div>


)

}