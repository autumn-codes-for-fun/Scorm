let API = null;

// Fonction pour trouver l'objet SCORM dans la hiérarchie de fenêtres
function findAPI(win) {
  while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
    win = win.parent;
  }
  return win.API;
}

// Initialisation de la communication SCORM
function initSCORM() {
  API = findAPI(window);
  if (API != null) {
    API.LMSInitialize("");
    console.log("SCORM initialisé");

    // Récupère les données précédentes si elles existent
    const savedData = API.LMSGetValue("cmi.suspend_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed.clics === "number") {
          comptage = parsed.clics;
          console.log("Reprise des clics précédents :", comptage);
        }
      } catch (e) {
        console.warn("Erreur de parsing des données SCORM:", e);
      }
    }

  } else {
    console.warn("API SCORM non trouvée");
  }
}

// Lancement à l’ouverture de la page
window.onload = function () {
  initSCORM();
};

let monBouton = document.getElementById("monBouton");
let comptage = 0;

// Compteur + sauvegarde SCORM au clic
monBouton.addEventListener("click", function () {
  comptage += 1;
  console.log("Vous avez cliqué sur le bouton " + comptage + " fois");

  if (API != null) {
    // Enregistrement dans suspend_data au format JSON
    const data = {
      clics: comptage
    };
    API.LMSSetValue("cmi.suspend_data", JSON.stringify(data));
    API.LMSCommit("");
  } else {
    console.warn("Impossible de sauvegarder, API SCORM manquante");
  }
});

// Fermeture propre de la session SCORM
window.onunload = function () {
  if (API != null) {
    API.LMSFinish("");
  }
};
