"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Register(){

const router = useRouter();


const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("Farmer");
const [show,setShow] = useState(false);



const registerUser = async()=>{


const response = await fetch(
"http://127.0.0.1:8000/register",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email:email,
password:password,
role:role

})

}
);



const data = await response.json();



if(response.ok){

alert(data.message);

router.push("/login");

}

else{

alert(data.detail);

}


};




return(

<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-green-950 to-green-800">


<div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl w-96 text-white shadow-2xl">



<h1 className="text-3xl font-bold text-center">
🌱 YieldSense AI
</h1>


<p className="text-center text-green-200 mt-2 mb-8">

User Registration

</p>




<input

placeholder="Enter Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="
w-full
p-3
rounded-lg
mb-5
bg-white
text-black
outline-none
"

/>




<div className="relative">


<input

placeholder="Enter Password"

type={show?"text":"password"}

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="
w-full
p-3
rounded-lg
bg-white
text-black
outline-none
"

/>


<button

type="button"

onClick={()=>setShow(!show)}

className="
absolute
right-4
top-3
text-black
"

>

{show?"🔒":"👁️"}

</button>


</div>





<select

value={role}

onChange={(e)=>setRole(e.target.value)}

className="
w-full
p-3
rounded-lg
mt-5
bg-white
text-black
outline-none
"

>


<option value="Farmer">
Farmer
</option>


<option value="Admin">
Agribusiness Admin
</option>


</select>






<button

onClick={registerUser}

className="
w-full
bg-green-500
hover:bg-green-600
p-3
rounded-lg
mt-5
font-bold
"

>

Create Account

</button>






<p className="text-center mt-5 text-green-200">

Already have an account?


<span

onClick={()=>router.push("/login")}

className="
text-green-400
cursor-pointer
ml-2
"

>

Login

</span>


</p>



</div>


</div>


)

}