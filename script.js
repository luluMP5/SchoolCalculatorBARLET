// ----- Variables globales -----
let notes = [];
let currentUser = null;

// ----- Inscription -----
function register() {
    let user = document.getElementById("registerUser").value.trim().toLowerCase();
    let pass = document.getElementById("registerPass").value.trim();

    if(user === "" || pass === ""){
        alert("Remplis tous les champs");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if(users.some(u => u.user === user)){
        alert("Utilisateur déjà existant");
        return;
    }

    users.push({ user, pass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Compte créé !");
    document.getElementById("registerUser").value = "";
    document.getElementById("registerPass").value = "";
}

// ----- Connexion -----
function login() {
    let user = document.getElementById("loginUser").value.trim().toLowerCase();
    let pass = document.getElementById("loginPass").value.trim();

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let found = users.find(u => u.user === user && u.pass === pass);

    if(found){
        currentUser = user;
        document.getElementById("auth").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("currentUserDisplay").textContent = currentUser;
        chargerNotes();
    } else {
        alert("Identifiants incorrects");
    }
}

// ----- Déconnexion -----
function logout(){
    currentUser = null;
    notes = [];
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
}

// ----- Ajouter une note -----
function ajouterNote(){
    let matiere = document.getElementById("matiere").value.trim();
    let note = parseFloat(document.getElementById("note").value);
    let coef = parseFloat(document.getElementById("coef").value);

    if(!matiere || isNaN(note) || isNaN(coef)){
        alert("Remplis tous les champs correctement");
        return;
    }

    if(note < 0 || coef <= 0){
        alert("La note doit être positive et le coefficient > 0");
        return;
    }

    let objetNote = { matiere, note, coef };

    let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
    if(!savedNotes[currentUser]){
        savedNotes[currentUser] = [];
    }

   if (!savedNotes[currentUser]) {
    savedNotes[currentUser] = [];
}
savedNotes[currentUser].push(objetNote);
    localStorage.setItem("notes", JSON.stringify(savedNotes));

    notes = savedNotes[currentUser];
    afficherNotes();
    calculerMoyenne();

    document.getElementById("matiere").value = "";
    document.getElementById("note").value = "";
    document.getElementById("coef").value = "";
}

// ----- Charger les notes -----
function chargerNotes(){
    let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
    notes = savedNotes[currentUser] || [];
    afficherNotes();
    calculerMoyenne();
}

// ----- Afficher les notes -----
function afficherNotes() {
    let liste = document.getElementById("listeNotes");
    liste.innerHTML = "";

    if(notes.length === 0){
        liste.textContent = "Aucune note ajoutée.";
        return;
    }

    notes.forEach((n, index) => {
        let li = document.createElement("li");
        li.textContent = n.matiere + " : " + n.note + " (coef " + n.coef + ") ";

        // Bouton supprimer
        let btn = document.createElement("button");
        btn.textContent = "Supprimer";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
            notes.splice(index, 1);
            let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
            savedNotes[currentUser] = notes;
            localStorage.setItem("notes", JSON.stringify(savedNotes));
            afficherNotes();
            calculerMoyenne();
        };

        li.appendChild(btn);
        liste.appendChild(li);
    });
}

// ----- Calculer la moyenne -----
function calculerMoyenne(){
    let total = 0;
    let totalCoef = 0;

    notes.forEach(n => {
        total += n.note * n.coef;
        totalCoef += n.coef;
    });

    let moyenne = totalCoef > 0 ? total / totalCoef : 0;
    document.getElementById("moyenne").textContent = moyenne.toFixed(2);
}
