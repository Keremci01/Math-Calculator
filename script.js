let currentMode = "function"

let plot = document.getElementById("plot")
let result = document.getElementById("result")

function toggleMenu(){
let menu = document.getElementById("menu")
menu.style.display = (menu.style.display === "block") ? "none" : "block"
}

function setMode(m){

currentMode = m

let func = document.getElementById("functionInputs")
let integral = document.getElementById("integralInputs")
let calcBox = document.getElementById("calculator")
let title = document.getElementById("title")
let drawBtn = document.getElementById("drawBtn")

/* 🔥 TEMİZLE */
plot.innerHTML = ""
result.innerHTML = ""

/* RESET */
func.style.display="none"
integral.style.display="none"
calcBox.style.display="none"
drawBtn.style.display="inline-block"

/* MODLAR */

if(m==="function"){
title.innerText="Fonksiyon"
func.style.display="block"
}

if(m==="integral"){
title.innerText="İntegral"
integral.style.display="block"
}

if(m==="calculator"){
title.innerText="Hesap Makinesi"
calcBox.style.display="block"

/* 🔥 BUTON GİZLE */
drawBtn.style.display="none"
}

}

function draw(){

plot.innerHTML = ""
result.innerHTML = ""

if(currentMode==="function"){

let expr = document.getElementById("func").value

functionPlot({
target:"#plot",
width:800,
height:400,
data:[{
fn: expr
}]
})

}

if(currentMode==="integral"){

let expr = document.getElementById("intFunc").value
let a = parseFloat(document.getElementById("a").value)
let b = parseFloat(document.getElementById("b").value)

let integral = math.integral(expr,"x")
let F = math.compile(integral)

let res = F.evaluate({x:b}) - F.evaluate({x:a})

result.innerHTML = "Sonuç: " + res

functionPlot({
target:"#plot",
width:800,
height:400,
data:[{
fn: expr
}]
})

}

}

/* CALCULATOR */

function calc(val){
document.getElementById("calcDisplay").value += val
}

function calculate(){
let display = document.getElementById("calcDisplay")
display.value = eval(display.value)
}

function clearCalc(){
document.getElementById("calcDisplay").value = ""
}
