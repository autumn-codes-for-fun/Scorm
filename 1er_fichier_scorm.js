let comptage = 0;// variable pour compter le nombre de clique sur la formation avoir la bosse des maths
var findAPITries = 0;// variable permettant de rechercher l'API dans les fenetres parentes pour eviter une boucle infinie
var startTimeStamp = null;// variable pour sauvegarder l'heure de debut à l'initialisation du LMS
var processedUnload = false;// déclaration d'une variable booléenne non locale pour éviter l'appel multiple du chargement de la page
var reachedEnd = false;// l'utilisateur est il arrivé au bout de sa session?
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////Script en grande partie inspiré d'un script rédigé sur le site SCORM. com ce script initie la connection avec le LMS///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// fonction servant à chercher récursivement l’API dans win et parents
function findAPI(win)
{
   // verifie si la fenetre contient l'API et les fenetres parentes imbriquées
   while ( (win.API == null) &&
           (win.parent != null) &&
           (win.parent != win) )
   {
      // incremente la variable  findAPITries++;
      findAPITries++;

      // boucle de 7 pour éviter une boucle infinie
      if (findAPITries > 7)
      {
         alert("Error finding API -- too deeply nested.");
         return null;
      }

      // incremente la variable à la fenetre ouverte puis aux feneêtres imbriquées

      win = win.parent;
   }
   return win.API;
}
// fonction servant à orchestrer la recherche d’API dans plusieurs contextes et la gestion des erreurs en cas d'échec
function getAPI()
{
   // recherche l'API dans la fenetre ouverte
   var theAPI = findAPI(window);

   //si l'API ets null ou ne peut être trouvé dans la fenetre ouverte 
   // l'autre fenetre à un opener
   if ( (theAPI == null) &&
        (window.opener != null) &&
        (typeof(window.opener) != "undefined") )
   {
      // essaie de trouver l'API dans la l'opener
      theAPI = findAPI(window.opener);
   }
   // Si l'API ne peut être trouvé
   if (theAPI == null)
   {
      // alerte l'utilisateur que l'API ne pouvait être trouvé
      alert("Unable to find an API adapter");
   }
   return theAPI;
}


///////////////////////////////////////////
//Fin de l'algortithme de recherche de l'API
///////////////////////////////////////////
  
  
//Fonction de management du chargement et fermeture de la page


//Constantes
var SCORM_TRUE = "true";
var SCORM_FALSE = "false";
var SCORM_NO_ERROR = "0";

//Le manager de fermeture va être appelé 2 fois de  onunload et onbeforeunload cette variable assure qu'on ne l'appellera qu'une fois.
var finishCalled = false;

//Suit si le LMS a bien été initialisé
var initialized = false;

var API = null;

//Fonction qui initialise l'API et gère les erreurs d'initialisation
function ScormProcessInitialize(){
    var result;
    
    API = getAPI();
    
    if (API == null){
        alert("ERROR - Could not establish a connection with the LMS.\n\nYour results may not be recorded.");
        return;
    }
    
    result = API.LMSInitialize("");
    // gestion des erreurs à l'intiation du LMS
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
        alert("Error - Could not initialize communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
    
    initialized = true;
}

//Fonction qui ferme une session+ gestion des erreurs
function ScormProcessFinish(){
    
    var result;
    
    //Ne s'arrête pas si initialisation pas terminé ou si la fenetre se ferme
    if (initialized == false || finishCalled == true){return;}
    
    result = API.LMSFinish("");
    
    finishCalled = true;
        // gestion des erreurs à la fermeture du LMS
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
        alert("Error - Could not terminate communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
}

/////////////////////////////////////////////////////////////////
//Fin des fonctions d'initilisation et de fermeture d'une session
/////////////////////////////////////////////////////////////////

/*
La gestion des évènements onload and onunload se trouve dans la page HTML
*/
//window.onload = ScormProcessInitialize;
//window.onunload = ScormProcessTerminate;
//window.onbeforeunload = ScormProcessTerminate;

// Fonction qui prend un paramètre LMS en argument et retourne sa valeur elle permet de récupérer des données auprès du LMS
function ScormProcessGetValue(element){

    var result;
   //Vérifie si la communication avec le LMS est prête
    if (initialized == false || finishCalled == true){return;}
    
    result = API.LMSGetValue(element);
    // gestion erreur si donnée vide
    if (result == ""){
    
        var errorNumber = API.LMSGetLastError();
        
        if (errorNumber != SCORM_NO_ERROR){
            var errorString = API.LMSGetErrorString(errorNumber);
            var diagnostic = API.LMSGetDiagnostic(errorNumber);
            
            var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
            
            alert("Error - Could not retrieve a value from the LMS.\n\n" + errorDescription);
            return "";
        }
    }
    
    return result;
}
// fonction qui  prend en argument un paramètre LMS et sa valeur, elle permet d'enregistrer les données d'une session, elle ne retourne aucun élément
function ScormProcessSetValue(element, value){
   
    var result;
    
    if (initialized == false || finishCalled == true){return;}
    
    result = API.LMSSetValue(element, value);
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
        alert("Error - Could not store a value in the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
    
}
    
    //Fonction qui prend en argument une durée  et un booléen pour formater le temps au format SCORM
    //blnIncludeFraction détermine si on doit afficher la fraction des secondes (les centièmes) dans le format SCORM.
    function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, blnIncludeFraction){
	
	    var intHours;
	    var intMinutes;
	    var intSeconds;
	    var intMilliseconds;
	    var intHundredths;
	    var strCMITimeSpan;
    	
	    if (blnIncludeFraction == null || blnIncludeFraction == undefined){
		    blnIncludeFraction = true;
	    }
    	
	    //convertis des durées
	    intMilliseconds = intTotalMilliseconds % 1000;

	    intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;

	    intMinutes = ((intTotalMilliseconds - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;

	    intHours = (intTotalMilliseconds - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;

	    /*
	   Gérer le cas exceptionnel où le contenu a utilisé une durée très longue et a interprété CMITimestamp
afin de permettre un nombre de minutes et de secondes supérieur à 60, c’est-à-dire 9999:99:99.99 au lieu de 9999:60:60.99.
Remarque – ce cas est autorisé par SCORM, mais restera exceptionnellement rare.
	    */

	    if (intHours == 10000) 
	    {	
		    intHours = 9999;

		    intMinutes = (intTotalMilliseconds - (intHours * 3600000)) / 60000;
		    if (intMinutes == 100) 
		    {
			    intMinutes = 99;
		    }
		    intMinutes = Math.floor(intMinutes);
    		
		    intSeconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
		    if (intSeconds == 100) 
		    {
			    intSeconds = 99;
		    }
		    intSeconds = Math.floor(intSeconds);
    		
		    intMilliseconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
	    }

	    //retire les millisecond
	    intHundredths = Math.floor(intMilliseconds / 10);

	    //formatage de la durée  grâce à la fonction Zeropad
	    strCMITimeSpan = ZeroPad(intHours, 4) + ":" + ZeroPad(intMinutes, 2) + ":" + ZeroPad(intSeconds, 2);
    	
	    if (blnIncludeFraction){
		    strCMITimeSpan += "." + intHundredths;
	    }

	    //gestion d'un cas rare
	    if (intHours > 9999) 
	    {
		    strCMITimeSpan = "9999:99:99";
    		
		    if (blnIncludeFraction){
			    strCMITimeSpan += ".99";
		    }
	    }

	    return strCMITimeSpan;
    	
    }
// Fonction pour retourner le format heure correctement avec le bon nombre de Zéro
        function ZeroPad(intNum, intNumDigits){
 
	    var strTemp;
	    var intLen;
	    var i;
    	
	    strTemp = new String(intNum);
	    intLen = strTemp.length;
    	
	    if (intLen > intNumDigits){
		    strTemp = strTemp.substr(0,intNumDigits);
	    }
	    else{
		    for (i=intLen; i<intNumDigits; i++){
			    strTemp = "0" + strTemp;
		    }
	    }
    	
	    return strTemp;
    }

//Fonction qui initialize le LMS à l'ouverture de la page et qui compte le nombre de fois où on clique sur la formation "Avoir la bosse des maths" contenue dans le fichier 1er_fichier_scorm.html
     function doStart(){
      ScormProcessInitialize();
       //enregitsre l'heure du debut de session afin de calculer la durée de la session à sa fermeture
        startTimeStamp = new Date();
        // un écouter d'évènement clique qui s'affiche dans la console pour vérifier que le compteur sur la formation "Avoir la bosse des maths" fonctionne hors LMS
         const monBouton = document.getElementById("monBouton");
  monBouton.addEventListener("click", function () {
    comptage += 1;
    console.log("Vous avez cliqué sur le bouton " + comptage + " fois");
    // ce bloque au dessus ne sert que pour la console hors LMS
    // Le bloque en dessous a la même fonction dans le LMS pour sauvegarder le nombre de clique sur la formation "Avoir la bosse des maths" dans "cmi.suspend_data"
    nbrdeclic= ScormProcessGetValue("cmi.suspend_data");
    if (isNaN(nbrdeclic) || nbrdeclic === "") nbrdeclic = 0;
    nbrdeclic = parseInt(nbrdeclic) + 1;

    ScormProcessSetValue("cmi.suspend_data", nbrdeclic.toString());
  });
     }
        
    function doUnload(pressedExit){
        
        //variable à faux extérieur à la fonction pour eviter d'appeler cette fonction plusieurs fois
        if (processedUnload == true){return;}
        
        processedUnload = true;
        
        //enregistrement de la durée de la sessions fait appel à la fonction  ConvertMilliSecondsToSCORMTime pour le formatage
        var endTimeStamp = new Date();
        var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
        var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);
        
        ScormProcessSetValue("cmi.core.session_time", scormTime);
 // Si l'utilisateur ferme simplement le navigateur, nous enregistrerons par défaut ses données de progression.
// S'il clique sur "Quitter", une confirmation lui est demandée.
// S'il a terminé le module, la sortie se fait normalement pour soumettre les résultats.
        if (pressedExit == false && reachedEnd == false){ // fonction mal codée car le html ne contient pas de bouton pressedExit pour fermer la sessions sans la suspendre
            ScormProcessSetValue("cmi.core.exit", "suspend");
        }
        
        ScormProcessFinish();
    }

