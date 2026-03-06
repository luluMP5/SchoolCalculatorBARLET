// ----- Variables globales -----
let notes = [];
let currentUser = null;

// ----- Inscription -----
function register() {
    let user = document.getElementById("registerUser").value.trim().toLowerCase();
    let pass = document.getElementById("registerPass").value.trim();
    let msg = document.getElementById("registerMsg");
    msg.textContent = "";

    if(user === "" || pass === ""){
        msg.textContent = "Remplis tous les champs";
        msg.className = "error";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if(users.some(u => u.user === user)){
        msg.textContent = "Utilisateur déjà existant";
        msg.className = "error";
        return;
    }

    users.push({ user, pass });
    localStorage.setItem("users", JSON.stringify(users));

    msg.textContent = "Compte créé !";
    msg.className = "message";

    document.getElementById("registerUser").value = "";
    document.getElementById("registerPass").value = "";
}

// ----- Connexion -----
function login() {
    let user = document.getElementById("loginUser").value.trim().toLowerCase();
    let pass = document.getElementById("loginPass").value.trim();
    let msg = document.getElementById("loginMsg");
    msg.textContent = "";

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let found = users.find(u => u.user === user && u.pass === pass);

    if(found){
        currentUser = user;
        document.getElementById("auth").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("currentUserDisplay").textContent = currentUser;
        chargerNotes();
    } else {
        msg.textContent = "Identifiants incorrects";
        msg.className = "error";
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
    let msg = document.getElementById("noteMsg");
    msg.textContent = "";

    if(!matiere || isNaN(note) || isNaN(coef) || note < 0 || coef <= 0){
        msg.textContent = "Remplis correctement tous les champs";
        msg.className = "error";
        return;
    }

    let objetNote = { matiere, note, coef };
    let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");

    // ✅ Important : ne pas écraser les notes existantes
    if(!savedNotes[currentUser]){
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

    msg.textContent = "Note ajoutée !";
    msg.className = "message";
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
        document.getElementById("stats").textContent = "";
        return;
    }

    notes.forEach((n, index) => {
        let li = document.createElement("li");
        li.textContent = n.matiere + " : " + n.note + " (coef " + n.coef + ")";
        li.title = "Cliquez pour modifier";

        // ----- Modifier la note au clic sur le li -----
        li.onclick = () => {
            let newMatiere = prompt("Matière :", n.matiere);
            let newNote = parseFloat(prompt("Note :", n.note));
            let newCoef = parseFloat(prompt("Coefficient :", n.coef));
            if(newMatiere && !isNaN(newNote) && !isNaN(newCoef) && newNote >=0 && newCoef>0){
                n.matiere = newMatiere.trim();
                n.note = newNote;
                n.coef = newCoef;
                let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
                savedNotes[currentUser] = notes;
                localStorage.setItem("notes", JSON.stringify(savedNotes));
                afficherNotes();
                calculerMoyenne();
            }
        };

        // ----- Bouton supprimer -----
        let btn = document.createElement("button");
        btn.textContent = "Supprimer";
        btn.onclick = (e) => {
            e.stopPropagation(); // pour ne pas déclencher la modification
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

    document.getElementById("stats").textContent = `Nombre de notes : ${notes.length}`;
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
