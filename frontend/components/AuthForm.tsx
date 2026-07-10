"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthForm({type}:{type:string}){

const router=useRouter();

const [show,setShow]=useState(false);

const [data,setData]=useState({
name:"",
email:"",
password:"",
role:"Farmer"
});

const change=(e:any)=>{

setData({
...data,
[e.target.name]:e.target.value
});

};

const submit = async()=>{

const url = type==="login"
? "http://127.0.0.1:8000/login"
: "http://127.0.0.1:8000/register";


const res = await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});


if(res.ok){

if(type==="register"){
router.push("/login");
}

else{
router.push("/farm-profile");
}

}

else{
alert("Something went wrong");
}

}

return(

<div className="auth">

<div className="auth-info">

<h4>Smart Farming Powered By Artificial Intelligence</h4>

<h1>
Transforming Agricultural Data Into <br/>
Accurate Yield Insights
</h1>

<p>
YieldSense AI analyzes farm conditions, soil nutrients,
weather patterns and crop data to support smarter farming decisions.
</p>

<div className="feature-box">

<div>🚜 Farm Management</div>

<div>☁ Weather Analysis</div>

<div>🌱 Soil Analysis</div>

<div>🤖 AI Prediction</div>

</div>

</div>

<div className="form-box">

<h2>🌱 YieldSense AI</h2>

<h3>{type==="login"?"Welcome Back":"Create Account"} </h3>

{type==="register" &&

<input name="name" placeholder="Full Name" onChange={change}/>
}

<input name="email" placeholder="Email" onChange={change}/>

<div className="password">

<input name="password" type={show?"text":"password"} placeholder="Password" onChange={change}/>

<span onClick={()=>setShow(!show)}>

{show?"🙈":"👁"}

</span>

</div>

{type==="register" &&

<select name="role" onChange={change}>

<option>Farmer</option>

<option>Admin</option>

</select>

}

<button onClick={submit}>

{type==="login"?"Sign In":"Create Account"}

</button>

<p>

{type==="login"?

<>New user? <Link href="/register">Register</Link></>

:

<> Already have account? <Link href="/login">Login</Link></>

}

</p>

</div>

</div>

)

}