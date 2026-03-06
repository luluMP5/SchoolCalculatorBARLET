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

    localStorage.setItem("notes", JSON.stringify(notes));

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

function afficherNotes(){

    let liste = document.getElementById("listeNotes");
    liste.innerHTML = "";

    notes.forEach(n => {

        let li = document.createElement("li");
        li.textContent = n.matiere + " : " + n.note + " (coef " + n.coef + ")";
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
