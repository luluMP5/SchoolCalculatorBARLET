// ===== VARIABLES GLOBALES =====
let notes = [];
let currentUser = null;
let chart = null;

// ===== ÉLÉMENTS DOM =====
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const themeBtn = document.getElementById("themeBtn");
const searchInput = document.getElementById("searchInput");
const exportPDFBtn = document.getElementById("exportPDF");

const auth = document.getElementById("auth");
const app = document.getElementById("app");
const currentUserSpan = document.getElementById("currentUser");

const registerUserInput = document.getElementById("registerUser");
const registerPassInput = document.getElementById("registerPass");
const registerMsg = document.getElementById("registerMsg");

const loginUserInput = document.getElementById("loginUser");
const loginPassInput = document.getElementById("loginPass");
const loginMsg = document.getElementById("loginMsg");

const notesList = document.getElementById("notesList");
const moyenneSpan = document.getElementById("moyenne");
const statsElement = document.getElementById("stats");
const subjectAverageElement = document.getElementById("subjectAverage");

// ===== ÉVÉNEMENTS =====
registerBtn.onclick = register;
loginBtn.onclick = login;
logoutBtn.onclick = logout;
addNoteBtn.onclick = ajouterNote;
themeBtn.onclick = toggleTheme;
searchInput.oninput = search;
exportPDFBtn.onclick = exportPDF;
window.onload = autoLogin;

// ===== FONCTIONS =====

function autoLogin() {
    let savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
        currentUser = savedUser;
        auth.style.display = "none";
        app.style.display = "block";
        currentUserSpan.textContent = currentUser;
        loadNotes();
    }
}

function register() {
    let user = registerUserInput.value.trim().toLowerCase();
    let pass = registerPassInput.value;
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.user === user)) {
        registerMsg.textContent = "Utilisateur déjà existant";
        return;
    }
    users.push({ user, pass });
    localStorage.setItem("users", JSON.stringify(users));
    registerMsg.textContent = "Compte créé avec succès";
}

function login() {
    let user = loginUserInput.value.trim().toLowerCase();
    let pass = loginPassInput.value;
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let found = users.find(u => u.user === user && u.pass === pass);
    if (!found) {
        loginMsg.textContent = "Identifiants incorrects";
        return;
    }
    currentUser = user;
    localStorage.setItem("currentUser", currentUser);
    auth.style.display = "none";
    app.style.display = "block";
    currentUserSpan.textContent = currentUser;
    loadNotes();
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

function ajouterNote() {
    if (!currentUser) { alert("Vous devez être connecté !"); return; }
    let mat = document.getElementById("matiere").value.trim();
    let n = parseFloat(document.getElementById("note").value);
    let c = parseFloat(document.getElementById("coef").value);
    if (!mat || isNaN(n) || isNaN(c)) { alert("Remplissez tous les champs correctement !"); return; }
    let saved = JSON.parse(localStorage.getItem("notes") || "{}");
    if (!saved[currentUser]) saved[currentUser] = [];
    saved[currentUser].push({ matiere: mat, note: n, coef: c });
    localStorage.setItem("notes", JSON.stringify(saved));
    notes = saved[currentUser];
    render();
    document.getElementById("matiere").value = "";
    document.getElementById("note").value = "";
    document.getElementById("coef").value = "";
}

function loadNotes() {
    let saved = JSON.parse(localStorage.getItem("notes") || "{}");
    notes = saved[currentUser] || [];
    render();
}

function save() {
    let saved = JSON.parse(localStorage.getItem("notes") || "{}");
    saved[currentUser] = notes;
    localStorage.setItem("notes", JSON.stringify(saved));
    render();
}

function render() {
    displayNotes(notes);
    updateStats();
    subjectAverage();
    drawChart();
}

function displayNotes(list) {
    notesList.innerHTML = "";
    list.forEach((n, i) => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.textContent = `${n.matiere} : ${n.note} (coef ${n.coef})`;
        span.className = n.note >=16 ? "good" : n.note>=10 ? "medium":"bad";
        let del = document.createElement("button");
        del.textContent = "X";
        del.onclick = () => { notes.splice(i,1); save(); };
        li.appendChild(span);
        li.appendChild(del);
        notesList.appendChild(li);
    });
}

function updateStats() {
    let total=0,coefTotal=0,best=0,worst=20;
    notes.forEach(n=>{ total+=n.note*n.coef; coefTotal+=n.coef; if(n.note>best)best=n.note; if(n.note<worst)worst=n.note; });
    let avg = coefTotal ? total/coefTotal : 0;
    moyenneSpan.textContent = avg.toFixed(2);
    statsElement.innerHTML = `<div>Nombre de notes : ${notes.length}</div>
                              <div>Meilleure note : ${best}</div>
                              <div>Pire note : ${worst}</div>`;
}

function subjectAverage() {
    let map={};
    notes.forEach(n=>{ if(!map[n.matiere]) map[n.matiere]={total:0,coef:0};
                        map[n.matiere].total+=n.note*n.coef;
                        map[n.matiere].coef+=n.coef; });
    let html="";
    for(let m in map){ let avg=(map[m].total/map[m].coef).toFixed(2); html+=`<div>${m} : ${avg}</div>`; }
    subjectAverageElement.innerHTML = html;
}

function search() {
    let txt = searchInput.value.toLowerCase();
    let filtered = notes.filter(n => n.matiere.toLowerCase().includes(txt));
    displayNotes(filtered);
}

function drawChart() {
    let ctx = document.getElementById("chart");
    if (!ctx) return;
    let labels = notes.map(n=>n.matiere);
    let data = notes.map(n=>n.note);
    if(chart) chart.destroy();
    chart = new Chart(ctx,{type:"bar",data:{labels:labels,datasets:[{label:"Notes",data:data,backgroundColor:"#2a78ff"}]}});
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();
    pdf.text("Bulletin de notes",20,20);
    let y=40;
    notes.forEach(n=>{ pdf.text(`${n.matiere} : ${n.note} coef ${n.coef}`,20,y); y+=10; });
    pdf.save("bulletin.pdf");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}
