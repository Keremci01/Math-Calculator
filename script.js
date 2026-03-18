/* ================= GLOBAL ================= */

let mode="function"
let currentPlot=null

/* ELEMENTLER */
const func=document.getElementById("func")
const func2=document.getElementById("func2")
const func3=document.getElementById("func3")

const a=document.getElementById("a")
const b=document.getElementById("b")
const x0=document.getElementById("x0")

const x1=document.getElementById("x1")
const y1=document.getElementById("y1")
const x2=document.getElementById("x2")
const y2=document.getElementById("y2")

const plot=document.getElementById("plot")
const result=document.getElementById("result")
const tableContainer=document.getElementById("tableContainer")
const title=document.getElementById("title")

/* ================= MENU ================= */

function toggleMenu(){
document.getElementById("menu").classList.toggle("active")
}

/* 🔥 FIX: ARTIK BİRDEN FAZLA GRUP AÇILABİLİR */
function toggleGroup(id){
let el = document.getElementById(id)

if(el.style.display==="block"){
el.style.display="none"
}else{
el.style.display="block"
}
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

document.getElementById("calculator").style.display="none"
document.getElementById("plot").style.display="block"

func.style.display="inline"

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
document.getElementById("calculator").style.display="block"
plot.style.display="none"
func.style.display="none"
}

}

/* ================= DRAW ================= */

function draw(){

plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

let f=func.value

if(!f && mode!=="distance") return

try{

let config={
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
data:[]
}

/* NORMAL */
if(mode==="function"){
config.data=[{fn:f}]
}

/* MULTI */
if(mode==="multi"){

let data=[]
if(f) data.push({fn:f})
if(func2.value) data.push({fn:func2.value})
if(func3.value) data.push({fn:func3.value})

config.data=data
}

/* DERIVATIVE */
if(mode==="derivative"){
let d
try{
d=math.derivative(f,"x").toString()
}catch{
result.innerHTML="Geçersiz fonksiyon"
return
}

result.innerHTML="f'(x)="+d
config.data=[{fn:f},{fn:d}]
}

/* INTEGRAL */
if(mode==="integral"){

let aVal=Number(a.value)
let bVal=Number(b.value)

if(isNaN(aVal)||isNaN(bVal)) return

config.data=[
{fn:f},
{fn:f,range:[aVal,bVal],closed:true}
]
}

/* TANGENT */
if(mode==="tangent"){

let x=Number(x0.value)
if(isNaN(x)) return

let slope
try{
slope=math.derivative(f,"x").evaluate({x:x})
}catch{
result.innerHTML="Hata"
return
}

let y=math.evaluate(f,{x:x})
let t=`${slope}*(x-${x})+${y}`

result.innerHTML="Teğet: "+t
config.data=[{fn:f},{fn:t}]
}

/* LIMIT */
if(mode==="limit"){

let x=Number(x0.value)
if(isNaN(x)) return

let left=math.evaluate(f,{x:x-0.0001})
let right=math.evaluate(f,{x:x+0.0001})
let val=(left+right)/2

result.innerHTML="Limit ≈ "+val.toFixed(4)
config.data=[{fn:f}]
}

/* DISTANCE */
if(mode==="distance"){

let x1v=Number(x1.value)
let y1v=Number(y1.value)
let x2v=Number(x2.value)
let y2v=Number(y2.value)

if([x1v,y1v,x2v,y2v].some(isNaN)) return

let d=Math.sqrt((x2v-x1v)**2+(y2v-y1v)**2)
result.innerHTML="Mesafe="+d.toFixed(2)

config.data=[{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"polyline"
}]
}

currentPlot=functionPlot(config)

}catch(e){
result.innerHTML="Hata: "+e.message
}

}

/* ================= CALC ================= */

function calc(v){document.getElementById("calcDisplay").value+=v}

function calculate(){
let exp=document.getElementById("calcDisplay").value
.replace(/÷/g,"/")
.replace(/×/g,"*")
.replace(/−/g,"-")

document.getElementById("calcDisplay").value=math.evaluate(exp)
}

function clearCalc(){
document.getElementById("calcDisplay").value=""
}

/* ================= UI ================= */

function toggleDark(){
document.body.classList.toggle("dark")
}

/* AUTO */
window.onload=()=>draw()
