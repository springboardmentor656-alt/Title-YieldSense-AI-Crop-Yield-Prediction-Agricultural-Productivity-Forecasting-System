"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function FarmProfile(){

const router = useRouter();


const [farm,setFarm] = useState({

farm_name:"",
area:"",
latitude:"",
longitude:"",
nitrogen:"",
phosphorus:"",
potassium:"",
soil_ph:""

});


const handleChange=(e:any)=>{

setFarm({

...farm,

[e.target.name]:e.target.value

});

};



const saveFarm = async()=>{


const response = await fetch(
"http://127.0.0.1:8000/farm",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(farm)

}

);


const data = await response.json();


if(response.ok){

alert(data.message);

router.push("/dashboard");

}

else{

alert(data.detail);

}

};




return(

<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-green-950 to-green-800">


<div className="bg-white/10 p-10 rounded-2xl w-96 text-white shadow-xl">


<h1 className="text-3xl font-bold text-center mb-6">

🚜 Farm Profile

</h1>


<p className="text-green-300 mb-3">
Farm Details
</p>


<input name="farm_name" placeholder="Farm Name" onChange={handleChange} className="input"/>

<input name="area" placeholder="Farm Area (hectares)" onChange={handleChange} className="input"/>

<input name="latitude" placeholder="Latitude" onChange={handleChange} className="input"/>

<input name="longitude" placeholder="Longitude" onChange={handleChange} className="input"/>



<p className="text-green-300 mb-3 mt-3">
Soil Details
</p>


<input name="nitrogen" placeholder="Nitrogen (N)" onChange={handleChange} className="input"/>

<input name="phosphorus" placeholder="Phosphorus (P)" onChange={handleChange} className="input"/>

<input name="potassium" placeholder="Potassium (K)" onChange={handleChange} className="input"/>

<input name="soil_ph" placeholder="Soil pH" onChange={handleChange} className="input"/>



<button

onClick={saveFarm}

className="w-full bg-green-500 p-3 rounded-lg font-bold mt-5"

>

Save Farm Details

</button>


</div>

</div>

)

}