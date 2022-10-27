
//SELECTEURS
const elBouton = document.querySelector('.button');
const elInput = document.querySelector('.input');
const elListeTaches = document.querySelector('.listeTaches');
const elFiltre = document.querySelector('.filtre');
const elReset = document.querySelector('.reset');
const elEnvoyer = document.querySelector('.envoyer');
const elDivAlerte = document.querySelector('.divAlerte');



//ECOUTEURS
elBouton.addEventListener("click", ajouterTache);
elListeTaches.addEventListener("click", modifierCheckSupprimer);
elFiltre.addEventListener("click", filtre );
elReset.addEventListener("click", reset );
elEnvoyer.addEventListener("click", envoyer );
document.addEventListener("DOMContentLoaded", recuperationTache);



function ajouterTache(e){
    e.preventDefault()

    const entreeInput = elInput.value.trim()
    const tab = entreeInput.split('')
    tab[0] = tab[0].toUpperCase()
    //et on insère le résultat dans la constante valeurInput
    let valeurInput = tab.join('')
    // valeurInput = valeurInput.trim()

    //Div de la tache
    const elDivTache = document.createElement('div');
    elDivTache.classList.add('tache');
    elDivTache.classList.add('animate__animated');
    elDivTache.classList.add('animate__fadeIn');
    
    //libelé de la tâche
    const elLitacheLibele = document.createElement('li');
    elLitacheLibele.classList.add('tacheLibele');
    elLitacheLibele.textContent = valeurInput;
    //bouton Check
    const elBoutonCheck = document.createElement('button');
    elBoutonCheck.classList.add('boutonCheck');
    elBoutonCheck.innerHTML = '<i class="fa-solid fa-check"></i>';
    //bouton Poubelle
    const elBoutonPoubelle = document.createElement('button');
    elBoutonPoubelle.classList.add('boutonPoubelle');
    elBoutonPoubelle.innerHTML = '<i class="fa-solid fa-trash"></i>';

    //Pour chaque nouvelle tâches , on créé un objet avec le nom de la tache et un "checked : false" par defaut
    const objetTache = {
        nomTache : valeurInput,
        checked : false,
    }
    //on envoie cet objet dans la fonction sauvegarde
    sauvegarde(objetTache);

    elDivTache.append(elLitacheLibele,elBoutonCheck,elBoutonPoubelle);
    elListeTaches.append(elDivTache);
    window.setTimeout(function() {
        elListeTaches.lastElementChild.classList.remove('animate__animated');
        elListeTaches.lastElementChild.classList.remove('animate__fadeIn');
    }, 300);  
    elInput.value = ""
}


function modifierCheckSupprimer(e){
    if (e.target.classList.value === "tacheLibele"){
        console.log(e.target.classList.value)
        const  elLitache= e.target;

        const elInput = document.createElement('input');        
        elInput.type = "text";
        //on copie le nom de la classe + le texte de elLiTache dans elInput :
        elInput.className = "classeInputTache"
        const TextDeLaTache = elLitache.textContent;
        elInput.value = TextDeLaTache;
        
        elLitache.replaceWith(elInput);
        elInput.focus();

        elInput.addEventListener('blur', gestionBlur);
        function gestionBlur(e){
            const entreeInput = elInput.value.trim()
            const tab = entreeInput.split('')
            tab[0] = tab[0].toUpperCase()
            //et on insère le résultat dans la constante valeurInput
            const valeurInput = tab.join('')
            modifierTexteTacheLocalStorage(TextDeLaTache,valeurInput)
            
            elLitache.textContent = valeurInput;
            elInput.replaceWith(elLitache);
        }
        
        elInput.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
              elInput.removeEventListener('blur', gestionBlur);
              gestionBlur();
            }
          });
    }  
    
   

    
    if (e.target.classList.value === "boutonCheck"){ 
        //on récupère le nom de la tâche associée au bouton e.target     
        let texteTache = e.target.parentNode.firstElementChild.textContent             
        e.target.parentNode.classList.toggle('tacheEffectue');
        //on envoie le nom de la tâche dans la fonction CheckingTacheLocalStorage
        checkingTacheLocalStorage(texteTache)

    }
    if (e.target.classList.value === "boutonPoubelle"){
        let texteTache = e.target.parentNode.firstElementChild.textContent
        if (e.target.parentNode.classList[1] !== "tacheEffectue"){
            e.target.parentNode.classList.add('alerteTremblement');
            window.setTimeout(function() {
                e.target.parentNode.classList.remove('alerteTremblement');
            }, 500);
            elDivAlerte.textContent = "Veuillez compléter une tâche avant sa suppression"
            elDivAlerte.classList.add('alerteActive');
            window.setTimeout(function() {
                elDivAlerte.classList.remove('alerteActive');
            }, 3500);
        }else{
            e.target.parentNode.classList.add('supp');     
            //on envoie le nom de la tâche dans la fonction supprimerTacheLocalStorage      
            supprimerTacheLocalStorage(texteTache)    
            //Un setTimeout pour que l'on ai le temps de voir l'animation,
            //on supprime le noeud parent après un certain délais :
            window.setTimeout(function() {
                e.target.parentNode.remove();
              }, 500);        
        }        
    }   
}



function filtre(e){
    const valeurFiltre = e.target.value
    const taches = elListeTaches.childNodes
    taches.forEach(function (tache){
        if (valeurFiltre === "toutes"){
            tache.style.display = "flex";
        }
        if (valeurFiltre === "complete"){            
            if (tache.classList.contains("tacheEffectue")){
                tache.style.display = "flex";
            }else{
                tache.style.display = "none";
            }            
        }
        if (valeurFiltre === "aFaire"){            
            if (!(tache.classList.contains("tacheEffectue"))){
                tache.style.display = "flex";
            }else{
                tache.style.display = "none";
            }            
        }
    });    
}

//fonction pour lire et récupérer au format Json le localStorage (tableau d'objet). Sinon les données ne sont pas exploitables.
function lectureDuLocalStorage(){
    let tableauTaches = [];
    if (localStorage.getItem("taches") !== null) {
        tableauTaches = JSON.parse(localStorage.getItem("taches"));
    }
    return tableauTaches
}

function sauvegarde(objetTache) { 
    //avant on récupère un tableau exploitable  
    let tableauTaches = lectureDuLocalStorage()
    //On push l'objet dans le tableau
    tableauTaches.push(objetTache);
    //on réinjecte le tableau dans le localStorage
    localStorage.setItem("taches", JSON.stringify(tableauTaches));
}

function recuperationTache() {
    let tableauTaches = lectureDuLocalStorage()
    tableauTaches.forEach(function (tache) {      
        //Div de la tache
        const elDivTache = document.createElement('div');
        elDivTache.classList.add('tache');
        if (tache.checked === true){
            elDivTache.classList.add('tacheEffectue');
        }    
        //libelé de la tâche
        const elLitacheLibele = document.createElement('li');
        elLitacheLibele.classList.add('tacheLibele');
        elLitacheLibele.textContent = tache.nomTache;
        //bouton Check
        const elBoutonCheck = document.createElement('button');
        elBoutonCheck.classList.add('boutonCheck');           
        elBoutonCheck.innerHTML = '<i class="fa-solid fa-check"></i>';
        //bouton Poubelle
        const elBoutonPoubelle = document.createElement('button');
        elBoutonPoubelle.classList.add('boutonPoubelle');
        elBoutonPoubelle.innerHTML = '<i class="fa-solid fa-trash"></i>';

        elDivTache.append(elLitacheLibele,elBoutonCheck,elBoutonPoubelle);
        elListeTaches.append(elDivTache);  
    });
}
function modifierTexteTacheLocalStorage(ancienTexteTache, nouveauTexteTache){
    //avant on récupère un tableau exploitable  
    let tableauTaches = lectureDuLocalStorage()
    //grace à "ancienTexteTache", on trouve l'index de son objet
    
    const index = tableauTaches.findIndex( (tache) => tache.nomTache === ancienTexteTache); 
    //on extrait cet objet
    let objetTache = tableauTaches[index]
    //Et on modifie le texte de la tache
    
    objetTache.nomTache = nouveauTexteTache
    
    //on remplace l'ancien objet du tableau par l'objet modifié    
    tableauTaches.splice(index, 1, objetTache);
    //on réinjecte le tableau dans le localStorage 
    localStorage.setItem("taches", JSON.stringify(tableauTaches));
}

function checkingTacheLocalStorage(texteTacheCheck){
    //avant on récupère un tableau exploitable  
    let tableauTaches = lectureDuLocalStorage()
    //grace à "texteTacheCheck", on trouve l'index de son objet
    const index = tableauTaches.findIndex( (tache) => tache.nomTache === texteTacheCheck); 
    //on extrait cet objet
    let objetTache = tableauTaches[index]
    //si le check était false, alors il devient true, sinon il devient false
    objetTache.checked === false ? objetTache.checked = true : objetTache.checked = false
    //on remplace l'ancien objet du tableau par l'objet modifié    
    tableauTaches.splice(index, 1, objetTache);
    //on réinjecte le tableau dans le localStorage 
    localStorage.setItem("taches", JSON.stringify(tableauTaches));
}

function supprimerTacheLocalStorage(texteTacheDelete){
    //avant on récupère un tableau exploitable  
    let tableauTaches = lectureDuLocalStorage()
    //recherche de l'index de l'objet contenant le texteTacheDelete
    const index = tableauTaches.findIndex( (tache) => tache.nomTache === texteTacheDelete);    
    tableauTaches.splice(index, 1) 
    //on réinjecte ce nouveau tableau dans le localStorage 
    localStorage.setItem("taches", JSON.stringify(tableauTaches));    
    /*
    Autrement : 
    On pourrait utiliser une fonction "filter" qui retourne un tableau d'objets en ayant supprimé l'objet contenant le "texteTacheDelete"
    problème : si deux taches comportent le même nom, elle seront toutes les deux supprimées par le filtre
        const tableauTachesModifie = tableauTaches.filter(i => i.nomTache !== texteTacheDelete)
        localStorage.setItem("taches", JSON.stringify(tableauTaches));
    */
} 

function reset(){
    localStorage.clear();
    
}

function envoyer(e){
    e.preventDefault()
    //avant on récupère un tableau exploitable
    let tableauTaches = lectureDuLocalStorage()
    if (tableauTaches.length === 0){
        elEnvoyer.classList.add('alerteTremblement');
            window.setTimeout(function() {
                elEnvoyer.classList.remove('alerteTremblement');
            }, 500);
        elDivAlerte.textContent = "La liste des tâches est vide"
        elDivAlerte.classList.add('alerteActive');
            window.setTimeout(function() {
                elDivAlerte.classList.remove('alerteActive');
            }, 3500);
    }else{
        //on initialise la chaine complete
        let chaineComplete = "";
        //et on boucle sur le tableau d'objet pour récupérer les infos des taches que l'on va concaténer dans la chaine complète
        //obligé d'incorporer "%0D%0A" en fin de ligne car ce code va pouvoir générer un saut de ligne dans l'email.
        tableauTaches.forEach(function (tache){        
            let etat = ""
            tache.checked === false ? etat = "En cours" : etat = "Terminé"
            const chaine = `- ${tache.nomTache} : ${etat} %0D%0A`;
            chaineComplete += chaine;
        });
        //On crée une date
        let date1 = new Date();

        let dateLocale = date1.toLocaleString('fr-FR',{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'});

        let url = "mailto:";
        url += "?subject=To do list du "+dateLocale;
        url += "&body=" + chaineComplete;

        window.location = url;
    }   
}
