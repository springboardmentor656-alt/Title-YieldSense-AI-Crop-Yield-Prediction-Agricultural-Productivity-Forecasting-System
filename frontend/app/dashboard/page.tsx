export default function Dashboard(){

return(

<div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-green-800 p-12 text-white">


<h1 className="text-4xl font-bold">

🌱 YieldSense AI Dashboard

</h1>


<div className="grid grid-cols-3 gap-8 mt-12">


<div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">

<h2 className="text-xl font-bold">
🌾 Yield Prediction
</h2>

<p className="mt-3 text-green-200">
ML prediction results will appear here
</p>

</div>



<div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">

<h2 className="text-xl font-bold">
🌦 Weather Insights
</h2>

<p className="mt-3 text-green-200">
Weather API data coming soon
</p>

</div>



<div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">

<h2 className="text-xl font-bold">
📊 Farm Analytics
</h2>

<p className="mt-3 text-green-200">
Reports and visualization
</p>

</div>


</div>


</div>

)

}