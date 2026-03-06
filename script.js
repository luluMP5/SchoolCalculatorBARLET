let notes = [];

function register() {
    let user = document.getElementById("registerUser").value;
    let pass = document.getElementById("registerPass").value;

    if(user === "" || pass === ""){
        alert("Remplis tous les champs");
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    alert("Compte créé !");
}

function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    let savedUser = localStorage.getItem("user");
    let savedPass = localStorage.getItem("pass");

    if(user === savedUser && pass === savedPass){
        document.getElementById("auth").style.display = "none";
        document.getElementById("app").style.display = "block";
        chargerNotes();
    } else {
        alert("Identifiants incorrects");
    }
}

function logout(){
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
}

function ajouterNote(){

    let matiere = document.getElementById("matiere").value;
    let note = parseFloat(document.getElementById("note").value);
    let coef = parseFloat(document.getElementById("coef").value);

    if(!matiere || isNaN(note) || isNaN(coef)){
        alert("Remplis tous les champs");
        return;
    }

    let objetNote = {
        matiere: matiere,
        note: note,
        coef: coef
    };

    notes.push(objetNote);

    let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");

// currentUser est le nom de l'utilisateur connecté
if(!savedNotes[currentUser]){
    savedNotes[currentUser] = [];
}

savedNotes[currentUser].push(objetNote);

localStorage.setItem("notes", JSON.stringify(savedNotes));

    afficherNotes();
    calculerMoyenne();

    document.getElementById("matiere").value = "";
    document.getElementById("note").value = "";
    document.getElementById("coef").value = "";
}

function chargerNotes(){
    let saved = localStorage.getItem("notes");

    if(saved){
        notes = JSON.parse(saved);
    }

    afficherNotes();
    calculerMoyenne();
}

function afficherNotes() {
    let liste = document.getElementById("listeNotes");
    liste.innerHTML = "";

    notes.forEach((n, index) => {
        let li = document.createElement("li");
        li.textContent = n.matiere + " : " + n.note + " (coef " + n.coef + ") ";

        // Créer bouton supprimer
        let btn = document.createElement("button");
        btn.textContent = "Supprimer";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
            notes.splice(index, 1); // supprime la note du tableau
            localStorage.setItem("notes", JSON.stringify(notes)); // met à jour localStorage
            afficherNotes(); // rafraîchit la liste
            calculerMoyenne(); // recalcule la moyenne
        };

        li.appendChild(btn);
        liste.appendChild(li);
    });
}
function calculerMoyenne(){

    let total = 0;
    let totalCoef = 0;

    notes.forEach(n => {
        total += n.note * n.coef;
        totalCoef += n.coef;
    });

    let moyenne = 0;

    if(totalCoef > 0){
        moyenne = total / totalCoef;
    }

    document.getElementById("moyenne").textContent = moyenne.toFixed(2);
}
function chargerNotes(currentUser){
    let savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
    notes = savedNotes[currentUser] || [];
    afficherNotes();
    calculerMoyenne();
}
let currentUser = null;

function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let found = users.find(u => u.user === user && u.pass === pass);

    if(found){
        currentUser = user; // on stocke l'utilisateur connecté
        document.getElementById("auth").style.display = "none";
        document.getElementById("app").style.display = "block";
        chargerNotes(currentUser);
    } else {
        alert("Identifiants incorrects");
    }
}
