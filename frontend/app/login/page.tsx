"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login(){

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [show,setShow] = useState(false);


const loginUser = async()=>{

const response = await fetch(
"http://127.0.0.1:8000/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);


const data = await response.json();


if(response.ok){

localStorage.setItem(
"token",
data.access_token
);

alert("Login Successful");

router.push("/farm-profile");

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
Farmer / Admin Login
</p>


<input

className="
w-full p-3 rounded-lg mb-5
bg-white text-black outline-none
"

placeholder="Enter Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>


<div className="relative">

<input

className="
w-full p-3 rounded-lg
bg-white text-black outline-none pr-14
"

placeholder="Enter Password"

type={show ? "text":"password"}

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>


<button

type="button"

onClick={()=>setShow(!show)}

className="
absolute right-4 top-1/2
-translate-y-1/2 text-black
"

>

{show ? "🔒":"👁️"}

</button>


</div>


<button

onClick={loginUser}

className="
w-full bg-green-500
hover:bg-green-600
p-3 rounded-lg
mt-8 font-bold
"

>

Login

</button>


</div>


</div>


)

}