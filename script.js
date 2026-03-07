let notes = []
let currentUser = null

const auth = document.getElementById("auth")
const app = document.getElementById("app")

// boutons
document.getElementById("registerBtn").onclick = register
document.getElementById("loginBtn").onclick = login
document.getElementById("logoutBtn").onclick = logout
document.getElementById("addNoteBtn").onclick = ajouterNote

document.getElementById("searchInput").addEventListener("input",rechercher)

window.onload = autoLogin

// ---------- AUTO LOGIN ----------

function autoLogin(){

let savedUser = localStorage.getItem("currentUser")

if(savedUser){

currentUser = savedUser

auth.style.display="none"
app.style.display="block"

document.getElementById("currentUser").textContent=currentUser

chargerNotes()

}

}

// ---------- INSCRIPTION ----------

function register(){

let user=document.getElementById("registerUser").value.trim().toLowerCase()
let pass=document.getElementById("registerPass").value.trim()

let msg=document.getElementById("registerMsg")

if(!user || !pass){

msg.textContent="Remplis tous les champs"
msg.className="error"
return

}

let users=JSON.parse(localStorage.getItem("users")||"[]")

if(users.some(u=>u.user===user)){

msg.textContent="Utilisateur déjà existant"
msg.className="error"
return

}

users.push({user,pass})

localStorage.setItem("users",JSON.stringify(users))

msg.textContent="Compte créé"
msg.className="message"

}

// ---------- LOGIN ----------

function login(){

let user=document.getElementById("loginUser").value.trim().toLowerCase()
let pass=document.getElementById("loginPass").value.trim()

let users=JSON.parse(localStorage.getItem("users")||"[]")

let found=users.find(u=>u.user===user && u.pass===pass)

let msg=document.getElementById("loginMsg")

if(found){

currentUser=user

localStorage.setItem("currentUser",user)

auth.style.display="none"
app.style.display="block"

document.getElementById("currentUser").textContent=user

chargerNotes()

}else{

msg.textContent="Identifiants incorrects"

}

}

// ---------- LOGOUT ----------

function logout(){

localStorage.removeItem("currentUser")

currentUser=null
notes=[]

auth.style.display="block"
app.style.display="none"

}

// ---------- AJOUT NOTE ----------

function ajouterNote(){

let matiere=document.getElementById("matiere").value.trim()
let note=parseFloat(document.getElementById("note").value)
let coef=parseFloat(document.getElementById("coef").value)

let msg=document.getElementById("noteMsg")

if(!matiere || isNaN(note) || isNaN(coef)){

msg.textContent="Remplis correctement"
msg.className="error"
return

}

let objet={matiere,note,coef,date:new Date().toLocaleDateString()}

let saved=JSON.parse(localStorage.getItem("notes")||"{}")

if(!saved[currentUser]) saved[currentUser]=[]

saved[currentUser].push(objet)

localStorage.setItem("notes",JSON.stringify(saved))

notes=saved[currentUser]

afficherNotes()
calculerStats()

}

// ---------- CHARGER NOTES ----------

function chargerNotes(){

let saved=JSON.parse(localStorage.getItem("notes")||"{}")

notes=saved[currentUser]||[]

afficherNotes()
calculerStats()

}

// ---------- AFFICHER ----------

function afficherNotes(list=notes){

let ul=document.getElementById("notesList")

ul.innerHTML=""

list.forEach((n,i)=>{

let li=document.createElement("li")

let span=document.createElement("span")

span.textContent=`${n.matiere} : ${n.note} (coef ${n.coef})`

span.className="note-text"

if(n.note>=16) span.classList.add("good")
else if(n.note>=10) span.classList.add("medium")
else span.classList.add("bad")

span.onclick=()=>modifierNote(i)

let del=document.createElement("button")

del.textContent="Supprimer"

del.onclick=()=>supprimerNote(i)

li.appendChild(span)
li.appendChild(del)

ul.appendChild(li)

})

}

// ---------- SUPPRIMER ----------

function supprimerNote(i){

notes.splice(i,1)

save()

}

// ---------- MODIFIER ----------

function modifierNote(i){

let n=notes[i]

let matiere=prompt("Matière",n.matiere)
let note=parseFloat(prompt("Note",n.note))
let coef=parseFloat(prompt("Coefficient",n.coef))

if(!matiere || isNaN(note) || isNaN(coef)) return

notes[i]={matiere,note,coef,date:n.date}

save()

}

// ---------- SAVE ----------

function save(){

let saved=JSON.parse(localStorage.getItem("notes")||"{}")

saved[currentUser]=notes

localStorage.setItem("notes",JSON.stringify(saved))

afficherNotes()
calculerStats()

}

// ---------- RECHERCHE ----------

function rechercher(){

let txt=document.getElementById("searchInput").value.toLowerCase()

let filtered=notes.filter(n=>n.matiere.toLowerCase().includes(txt))

afficherNotes(filtered)

}

// ---------- STATISTIQUES ----------

function calculerStats(){

if(notes.length===0){

document.getElementById("stats").textContent="Aucune note"

return

}

let total=0
let coefTotal=0

let best=notes[0].note
let worst=notes[0].note

notes.forEach(n=>{

total+=n.note*n.coef
coefTotal+=n.coef

if(n.note>best) best=n.note
if(n.note<worst) worst=n.note

})

let moyenne=total/coefTotal

document.getElementById("moyenne").textContent=moyenne.toFixed(2)

document.getElementById("stats").innerHTML=

`

<div class="stats-box">Nombre de notes : ${notes.length}</div>
<div class="stats-box">Meilleure note : ${best}</div>
<div class="stats-box">Pire note : ${worst}</div>

`

}
