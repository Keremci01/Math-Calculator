/* ================= GLOBAL ================= */

// 🔥 ELEMENT FIX (EN ÖNEMLİ)
const func = document.getElementById("func");
const func2 = document.getElementById("func2");
const func3 = document.getElementById("func3");

const a = document.getElementById("a");
const b = document.getElementById("b");
const x0 = document.getElementById("x0");

const x1 = document.getElementById("x1");
const y1 = document.getElementById("y1");
const x2 = document.getElementById("x2");
const y2 = document.getElementById("y2");

const plot = document.getElementById("plot");
const result = document.getElementById("result");
const tableContainer = document.getElementById("tableContainer");

const title = document.getElementById("title");
const calculator = document.getElementById("calculator");
const graphButtons = document.getElementById("graphButtons");
const coords = document.getElementById("coords");
const calcDisplay = document.getElementById("calcDisplay");

let mode="function"
let currentPlot=null

/* ================= MENU ================= */

function toggleMenu(){
let m = document.getElementById("menu")
m.classList.toggle("active")
}

function toggleGroup(id){

let g=document.getElementById(id)

if(g.style.display==="block"){
g.style.display="none"
return
}

document.querySelectorAll("#menu div").forEach(el=>{
if(el.id.includes("Group")) el.style.display="none"
})

g.style.display="block"
}

function toggleDark(){
document.body.classList.toggle("dark")
}

/* ================= MODE ================= */

function hideInputs(){

func2.style.display="none"
func3.style.display="none"
a.style.display="none"
b.style.display="none"
x0.style.display="none"
x1.style.display="none"
y1.style.display="none"
x2.style.display="none"
y2.style.display="none"

}

function setMode(m){

mode=m

hideInputs()
plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

calculator.style.display="none"
plot.style.display="block"
graphButtons.style.display="block"
func.style.display="inline"

/* BUTON */
let btn=document.getElementById("intersectBtn")
if(btn){
btn.style.display = (m==="multi") ? "inline-block" : "none"
}

/* TEXT */

if(m==="function"){
title.innerText="Fonksiyon Grafiği"
}

if(m==="multi"){
title.innerText="Çoklu Fonksiyon Çizme"
func2.style.display="inline"
func3.style.display="inline"
}

if(m==="derivative"){
title.innerText="Türev"
}

if(m==="integral"){
title.innerText="İntegral"
a.style.display="inline"
b.style.display="inline"
}

if(m==="tangent"){
title.innerText="Teğet"
x0.style.display="inline"
}

if(m==="limit"){
title.innerText="Limit"
x0.style.display="inline"
}

if(m==="distance"){
title.innerText="İki Nokta Arası Mesafe"
x1.style.display="inline"
y1.style.display="inline"
x2.style.display="inline"
y2.style.display="inline"
}

if(m==="calculator"){
title.innerText="Hesap Makinesi"
calculator.style.display="block"
plot.style.display="none"
graphButtons.style.display="none"
func.style.display="none"
}

}

/* ================= DRAW ================= */

function draw(){

plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

let f=func.value

try{

// 🔥 boş fonksiyon fix
if(!f && mode!=="distance" && mode!=="calculator"){
result.innerHTML="Fonksiyon gir!"
return
}

let config={
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
zoom:true,
pan:true,
data:[]
}

if(mode==="function"){
config.data=[{fn:f, color:"blue"}]
}

if(mode==="multi"){

let data=[]

if(f) data.push({fn:f, color:"blue"})
if(func2.value) data.push({fn:func2.value, color:"red"})
if(func3.value) data.push({fn:func3.value, color:"green"})

config.data=data
}

if(mode==="derivative"){
let d=math.derivative(f,"x").toString()
result.innerHTML="f'(x)="+d
config.data=[{fn:f},{fn:d}]
}

if(mode==="integral"){

let aVal=Number(a.value)
let bVal=Number(b.value)

config.data=[
{fn:f},
{fn:f,range:[aVal,bVal],closed:true,color:"rgba(0,0,255,0.3)"}
]
}

if(mode==="tangent"){

let x=Number(x0.value)
let d=math.derivative(f,"x")
let slope=d.evaluate({x:x})
let y=math.evaluate(f,{x:x})

let t=slope+"*(x-"+x+")+"+y
result.innerHTML="Teğet: "+t

config.data=[{fn:f},{fn:t}]
}

if(mode==="distance"){

let x1v=Number(x1.value)
let y1v=Number(y1.value)
let x2v=Number(x2.value)
let y2v=Number(y2.value)

let d=Math.sqrt((x2v-x1v)**2+(y2v-y1v)**2)
result.innerHTML="Mesafe="+d.toFixed(2)

config.data=[{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"polyline"
}]
}

currentPlot=functionPlot(config)

setupInteractions()

}catch(e){
result.innerHTML=e.message
}

}

/* ================= INTERACTION ================= */

function setupInteractions(){

let raf = null;
let rect = plot.getBoundingClientRect();

plot.onmousemove = function(e){

if(!currentPlot || !currentPlot.meta) return
if(raf) return

raf = requestAnimationFrame(()=>{

let x = currentPlot.meta.xScale.invert(e.clientX - rect.left)
let y = currentPlot.meta.yScale.invert(e.clientY - rect.top)

coords.innerText = `x: ${x.toFixed(2)} | y: ${y.toFixed(2)}`

raf = null
})
}

}

/* ================= CALC ================= */

function calc(v){calcDisplay.value+=v}
function calculate(){calcDisplay.value=math.evaluate(calcDisplay.value)}
function clearCalc(){calcDisplay.value=""}

/* ================= AUTO DRAW ================= */

function debounce(f,d){
let t;return()=>{clearTimeout(t);t=setTimeout(f,d)}
}

[func,func2,func3,x1,y1,x2,y2,a,b,x0].forEach(el=>{
if(el){
el.addEventListener("input", debounce(draw,200))
}
})

window.onload=()=>setTimeout(draw,100)
