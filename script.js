let notes=[]
let currentUser=null
let chart=null

registerBtn.onclick=register
loginBtn.onclick=login
logoutBtn.onclick=logout
addNoteBtn.onclick=addNote
themeBtn.onclick=toggleTheme
searchInput.oninput=search
exportPDF.onclick=exportPDF

window.onload=autoLogin

function autoLogin(){

let saved=localStorage.getItem("currentUser")

if(saved){

currentUser=saved

auth.style.display="none"
app.style.display="block"

currentUserSpan.textContent=saved

loadNotes()

}

}

function register(){

let user=registerUser.value.trim().toLowerCase()
let pass=registerPass.value

let users=JSON.parse(localStorage.getItem("users")||"[]")

if(users.some(u=>u.user===user)){

registerMsg.textContent="Utilisateur déjà existant"
return

}

users.push({user,pass})

localStorage.setItem("users",JSON.stringify(users))

registerMsg.textContent="Compte créé"

}

function login(){

let user=loginUser.value.trim().toLowerCase()
let pass=loginPass.value

let users=JSON.parse(localStorage.getItem("users")||"[]")

let found=users.find(u=>u.user===user && u.pass===pass)

if(!found){

loginMsg.textContent="Identifiants incorrects"
return

}

currentUser=user

localStorage.setItem("currentUser",user)

auth.style.display="none"
app.style.display="block"

currentUserSpan.textContent=user

loadNotes()

}

function logout(){

localStorage.removeItem("currentUser")

location.reload()

}

function ajouterNote() {
    // Récupération des valeurs des inputs
    let mat = document.getElementById("matiere").value.trim();
    let n = parseFloat(document.getElementById("note").value);
    let c = parseFloat(document.getElementById("coef").value);

    // Vérification que les champs sont valides
    if (!mat || isNaN(n) || isNaN(c)) return;

    // Récupération des notes existantes depuis localStorage
    let saved = JSON.parse(localStorage.getItem("notes") || "{}");

    // Création du tableau de notes pour l'utilisateur si nécessaire
    if (!saved[currentUser]) saved[currentUser] = [];

    // Ajout de la nouvelle note
    saved[currentUser].push({ matiere: mat, note: n, coef: c });

    // Sauvegarde dans localStorage
    localStorage.setItem("notes", JSON.stringify(saved));

    // Mise à jour du tableau local et affichage
    notes = saved[currentUser];
    render();

    // Vidage des inputs
    document.getElementById("matiere").value = "";
    document.getElementById("note").value = "";
    document.getElementById("coef").value = "";
}

function loadNotes(){

let saved=JSON.parse(localStorage.getItem("notes")||"{}")

notes=saved[currentUser]||[]

render()

}

function save(){

let saved=JSON.parse(localStorage.getItem("notes")||"{}")

saved[currentUser]=notes

localStorage.setItem("notes",JSON.stringify(saved))

render()

}

function render(){

displayNotes(notes)

stats()

subjectAverage()

drawChart()

}

function displayNotes(list){

notesList.innerHTML=""

list.forEach((n,i)=>{

let li=document.createElement("li")

let span=document.createElement("span")

span.textContent=`${n.matiere} : ${n.note} (coef ${n.coef})`

if(n.note>=16)span.className="good"
else if(n.note>=10)span.className="medium"
else span.className="bad"

let del=document.createElement("button")

del.textContent="X"

del.onclick=()=>{

notes.splice(i,1)

save()

}

li.appendChild(span)
li.appendChild(del)

notesList.appendChild(li)

})

}

function stats(){

let total=0
let coefTotal=0

let best=0
let worst=20

notes.forEach(n=>{

total+=n.note*n.coef
coefTotal+=n.coef

if(n.note>best)best=n.note
if(n.note<worst)worst=n.note

})

let avg=coefTotal?total/coefTotal:0

moyenne.textContent=avg.toFixed(2)

stats.innerHTML=

`
<div>Nombre de notes : ${notes.length}</div>
<div>Meilleure note : ${best}</div>
<div>Pire note : ${worst}</div>
`

}

function subjectAverage(){

let map={}

notes.forEach(n=>{

if(!map[n.matiere])map[n.matiere]={total:0,coef:0}

map[n.matiere].total+=n.note*n.coef
map[n.matiere].coef+=n.coef

})

let html=""

for(let m in map){

let avg=(map[m].total/map[m].coef).toFixed(2)

html+=`<div>${m} : ${avg}</div>`

}

subjectAverage.innerHTML=html

}

function search(){

let txt=searchInput.value.toLowerCase()

let filtered=notes.filter(n=>n.matiere.toLowerCase().includes(txt))

displayNotes(filtered)

}

function drawChart(){

let ctx=document.getElementById("chart")

let labels=notes.map(n=>n.matiere)

let data=notes.map(n=>n.note)

if(chart)chart.destroy()

chart=new Chart(ctx,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Notes",

data:data,

backgroundColor:"#2a78ff"

}]

}

})

}

function exportPDF(){

const {jsPDF}=window.jspdf

let pdf=new jsPDF()

pdf.text("Bulletin de notes",20,20)

let y=40

notes.forEach(n=>{

pdf.text(`${n.matiere} : ${n.note} coef ${n.coef}`,20,y)

y+=10

})

pdf.save("bulletin.pdf")

}

function toggleTheme(){

document.body.classList.toggle("dark")

}
