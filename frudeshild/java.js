
/* ================= API ================= */

const API_KEY = "AIzaSyC3hWB8ajYKbGNChJIUUOCYumL9kYNnqpg";


/* ================= MOBILE MENU ================= */

function toggleMenu(){
  document.getElementById("mobileMenu").classList.toggle("active");
}

function closeMenu(){
  document.getElementById("mobileMenu").classList.remove("active");
}


/* ================= DATABASE ================= */

let reportsDb = { en: [], gu: [], hi: [] };
let pendingDb = { en: [], gu: [], hi: [] };
let currentAppLang = "en";


/* ================= LANGUAGE DATA ================= */

const langData = {

en:{
t1:"Checker", t2:"Media Tips", t3:"Heatmap", t4:"Report", t5:"AI Bot",
c_h2:"🔍 Scam Search", b1:"Verify", w_h3:"Stay Alert!", w_p:"No OTP Sharing!",
r_h3:"📨 Submit Report", r_btn:"Submit", r_list:"Approved Reports",
r_msg_sent:"Report submitted successfully!",
no_rep:"No reports yet.",
p_name:"Name", p_email:"Email ID", p_target:"Number/Link", p_loc:"Location", p_desc:"Details",
b_h3:"Support Bot", s_btn:"Send",
l_name:"User Name", l_email:"Email ID", l_target:"Fraud Number/Link", l_type:"Fraud Type", l_loc:"Location", l_desc:"Description"
},

gu:{
t1:"ચેકર", t2:"મીડિયા ટિપ્સ", t3:"નકશો", t4:"રિપોર્ટ", t5:"બોટ મદદ",
c_h2:"🔍 તપાસ કરો", b1:"ચકાસણી", w_h3:"સાવધાન!", w_p:"OTP આપશો નહીં!",
r_h3:"રિપોર્ટ ઉમેરો", r_btn:"મોકલો", r_list:"મંજૂર થયેલા રિપોર્ટ્સ",
r_msg_sent:"રિપોર્ટ સફળતાપૂર્વક મોકલાયો!",
no_rep:"રિપોર્ટ નથી.",
p_name:"નામ", p_email:"ઈમેઈલ આઈડી", p_target:"નંબર/લિંક", p_loc:"સ્થળ", p_desc:"વિગત",
b_h3:"બોટ મદદ", s_btn:"મોકલો",
l_name:"વપરાશકર્તાનું નામ", l_email:"ઈમેઈલ આઈડી", l_target:"ફ્રોડ નંબર/લિંક", l_type:"ફ્રોડનો પ્રકાર", l_loc:"સ્થળ", l_desc:"વર્ણન"
},

hi:{
t1:"चेकर", t2:"मीडिया टिप्स", t3:"नक्शा", t4:"रिपोर्ट", t5:"बोट सहायता",
c_h2:"🔍 जांच करें", b1:"सत्यापन", w_h3:"सतर्क रहें!", w_p:"OTP साझा न करें!",
r_h3:"रिपोर्ट दर्ज करें", r_btn:"भेजें", r_list:"हालिया रिपोर्ट",
r_msg_sent:"रिपोर्ट सफलतापूर्वक भेजी गई!",
no_rep:"कोई रिपोर्ट नहीं।",
p_name:"नाम", p_email:"ईमेल आईडी", p_target:"नंबर/लिंक", p_loc:"स्थान", p_desc:"विवरण",
b_h3:"सहायता बोट", s_btn:"भेजें",
l_name:"उपयोगकर्ता का नाम", l_email:"ईमेल आईडी", l_target:"फ्रॉड नंबर/लिंक", l_type:"फ्रॉड का प्रकार", l_loc:"स्थान", l_desc:"विवरण"
}

};


/* ================= CHANGE LANGUAGE ================= */

function changeLanguage(lang){

currentAppLang = lang;

document.querySelectorAll("[data-lang]").forEach(el=>{
const key = el.getAttribute("data-lang");
if(langData[lang][key]) el.innerText = langData[lang][key];
});

document.querySelectorAll("[data-ph]").forEach(el=>{
const key = el.getAttribute("data-ph");
if(langData[lang][key]) el.setAttribute("placeholder", langData[lang][key]);
});

renderApprovedList();
updateAdminQueue();

}


/* ================= ADMIN PANEL ================= */

function openAdmin(){

const pw = prompt("Enter Admin Password:");

if(pw==="admin123"){

document.getElementById("adminSection").style.display="block";
updateAdminQueue();
alert("Admin Access Granted!");

}else{

alert("Wrong Password!");

}

}


/* ================= TABS ================= */

function showTab(btn,id){

closeMenu();

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
btn.classList.add("active");

const current=document.querySelector(".active-panel");
const target=document.getElementById(id);

gsap.to(current,{
opacity:0,
y:10,
duration:0.2,
onComplete:()=>{

current.classList.remove("active-panel");
target.classList.add("active-panel");

gsap.fromTo(target,{opacity:0,y:20},{opacity:1,y:0,duration:0.4});

}
});

if(id==="map") setTimeout(()=>map.invalidateSize(),400);

}


/* ================= MAP ================= */

const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");

const indiaBounds = L.latLngBounds(L.latLng(6,68),L.latLng(36,98));

const map = L.map("gujaratMap",{
center:[22.9,78.6],
zoom:5,
minZoom:4,
maxBounds:indiaBounds,
layers:[streetLayer]
});

L.control.layers({
"Standard":streetLayer,
"Satellite":satelliteLayer
}).addTo(map);


function getRiskColor(p){

if(p>=60) return "#ef5350";
if(p>=30) return "#fbc02d";
return "#4caf50";

}

const states=[
{name:"Gujarat",pos:[22.2,71.1],risk:75},
{name:"Maharashtra",pos:[19.7,75.7],risk:90},
{name:"Kerala",pos:[10.8,76.2],risk:25}
];

const stateGroup=L.layerGroup().addTo(map);

states.forEach(s=>{
L.circle(s.pos,{
color:getRiskColor(s.risk),
fillOpacity:0.4,
radius:100000
}).addTo(stateGroup).bindPopup(s.name+" : "+s.risk+"%");
});


/* ================= VIDEO PLAYER ================= */

function changeMainVid(src,title){

const mainVid=document.getElementById("mainVid");
const mainTitle=document.getElementById("mainTitle");

mainVid.src=src;
mainVid.play();

mainTitle.innerText=title;

if(window.innerWidth<992){
document.querySelector(".main-player").scrollIntoView({behavior:"smooth"});
}

}


/* ================= ADMIN QUEUE ================= */

function updateAdminQueue(){

const adminQueue=document.getElementById("adminQueue");
if(!adminQueue) return;

adminQueue.innerHTML="";

const list=pendingDb[currentAppLang] || [];

if(list.length===0){

adminQueue.innerHTML="<p>No pending reports</p>";
return;

}

list.forEach(rep=>{

const div=document.createElement("div");

div.style.border="1px solid #ddd";
div.style.padding="10px";
div.style.marginBottom="10px";

div.innerHTML=`
<b>${rep.name}</b> - ${rep.target}<br>
${rep.desc}<br>
<button onclick="approveReport(${rep.id})">Approve</button>
`;

adminQueue.appendChild(div);

});

}


/* ================= APPROVE REPORT ================= */

function approveReport(id){

const index=pendingDb[currentAppLang].findIndex(r=>r.id===id);
if(index===-1) return;

const report=pendingDb[currentAppLang].splice(index,1)[0];
reportsDb[currentAppLang].push(report);

updateAdminQueue();
renderApprovedList();

}


/* ================= APPROVED REPORT LIST ================= */

function renderApprovedList(){

const reportList=document.getElementById("reportList");
const list=reportsDb[currentAppLang] || [];

if(list.length===0){

reportList.innerHTML="<p>No reports yet.</p>";
return;

}

reportList.innerHTML="";

list.forEach(rep=>{

const div=document.createElement("div");

div.style.borderBottom="1px solid #ddd";
div.style.padding="10px";

div.innerHTML=`
<b>${rep.target}</b><br>
${rep.desc}<br>
<small>${rep.location || ""} - ${rep.date}</small>
`;

reportList.appendChild(div);

});

}


/* ================= SUBMIT REPORT ================= */

function submitReport(){

const name=document.getElementById("uName").value.trim();
const email=document.getElementById("uEmail").value.trim();
const target=document.getElementById("fTarget").value.trim();
const type=document.getElementById("fType").value;
const location=document.getElementById("fLocation").value.trim();
const desc=document.getElementById("fDesc").value.trim();

if(!name || !target || !desc){
alert("Please fill required fields");
return;
}

const report={
id:Date.now(),
name:name,
email:email,
target:target,
type:type,
location:location,
desc:desc,
date:new Date().toLocaleDateString()
};

pendingDb[currentAppLang].push(report);

alert(langData[currentAppLang].r_msg_sent);

document.getElementById("uName").value="";
document.getElementById("uEmail").value="";
document.getElementById("fTarget").value="";
document.getElementById("fLocation").value="";
document.getElementById("fDesc").value="";

updateAdminQueue();

}
/* ================= FRAUD CHECKER ================= */

function verifyFraud(){

const input=document.getElementById("checkInput").value.trim();

if(!input){
alert("Enter number or link");
return;
}

const found=fraudDatabase.find(f=>f.target===input);

if(found){

alert("⚠️ Fraud Reported!");

showFraudOnMap(found.location);

}else{

alert("✅ No Fraud Found");

}

}


/* ================= MAP MARKER ================= */

function showFraudOnMap(location){

const coords={
Ahmedabad:[23.0225,72.5714],
Surat:[21.1702,72.8311],
Rajkot:[22.3039,70.8022],
Mumbai:[19.0760,72.8777],
Delhi:[28.7041,77.1025]
};

if(coords[location]){

L.marker(coords[location])
.addTo(map)
.bindPopup("⚠️ Fraud Reported Here")
.openPopup();

map.setView(coords[location],10);

}

}

/* ================= START ================= */

changeLanguage("en");

/* ================= CHECKER ================= */

function runCheck(){

const input = document.getElementById("mainInput").value.trim();
const result = document.getElementById("checkResult");

if(!input){
result.innerHTML = "⚠️ Please enter number or link";
return;
}

const found = fraudDatabase.find(f => f.target === input);

if(found){

result.innerHTML = "🚨 Fraud Reported from " + found.location;
result.style.color = "red";

showFraudOnMap(found.location);

}else{

result.innerHTML = "✅ Safe (No reports found)";
result.style.color = "green";

}

}

let fraudDatabase = [];

fraudDatabase.push({
target: target,
location: location
});