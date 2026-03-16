function askAI(){

let q=document.getElementById("aiInput").value.toLowerCase();
let ans="";

if(q.includes("derivative")){

let f=q.replace("derivative","");

try{
ans="Türev: " + math.derivative(f,"x").toString();
}
catch{
ans="Fonksiyon anlaşılmadı.";
}

}

else if(q.includes("graph")){

let f=q.replace("graph","");

document.getElementById("func").value=f;

draw();

ans="Grafik çizildi.";

}

else{

ans="Bu konuda yardımcı olamam. Sadece matematik sorularını cevaplıyorum.";

}

document.getElementById("aiAnswer").innerText=ans;

}
