# Scorm
Ce projet est un module SCORM 1.2 interactif destiné à améliorer l'argumentaire de vente des formations en mathématiques.  
Il peut être importé dans n'importe quel LMS compatible SCORM.
Il est possible de visualiser la formation via ce lien sur la plateforme StromCloud :
https://app.cloud.scorm.com/sc/InvitationConfirmEmail?publicInvitationId=c27daa1d-ed4f-4a7f-acf5-0216a006a461
ou une démontration dans le fichier captures_écran.docx 

## Fonctionnalités

- Compteur de clics sur un lien vers le coeur de la formation
- Sauvegarde du nombre de clics dans le LMS via `cmi.suspend_data`
- Fonction qui affiche au format heures, minutes, secondes le temps passé  pour chaque apprenant sur la formation
- Le temps passé est sauvergardé dans 'cmi.core.session_time'
- Communication SCORM (initialisation, commit, fin)
- Compatible SCORM 1.2

## Gestion des erreurs
-Les erreurs sont gérées dans le fichier JS
-Détection de l'API et message d'erreur si API introuvable
-Erreur d'initialisation de la communication avec le LMS
-Gère la fermeture inpromptue d'une session
-Message d'erreur si les informations ne peuvent être récupérées auprès du LMS
-Message d'erreur si les informations ne peuvent être communiquées au LMS

## Arborescence
├── 📄 1er_fichier_scorm.html — page principale
├── 📄 1er_fichier_scorm.js — logique JavaScript + SCORM
├── 🎨 style.css — styles
├── 📄 imsmanifest.xml — fichier SCORM obligatoire

## Installation / Importation

1. Télécharger ou cloner le dépôt
2. S'assurer que le fichier `imsmanifest.xml` est à la racine
3. Zipper tous les fichiers (sans créer de sous-dossier)
4. Importer le `.zip` dans votre LMS (Moodle, SCORM Cloud, etc.)

## Tech utilisées

- HTML / CSS / JavaScript
- SCORM 1.2
- API SCORM `LMSInitialize`, `LMSSetValue`, `LMSFinish`, etc.

## Fichiers médias et documentations
les fichiers suivants contiennent des images 
├──Capture_ecran_formation_bosse_math.jpg
├──traffic-cone-31883_1280
Le fichier docx montre le fonctionnement de la formation sur SCORMcloud
├──captures_écran.docx 
Le fichier storyboard_SCORM.docx contient le storyboard de la formation dans son entièreté et fait part du déroulement des séances en présentiel et en distanciel.
├──storyboard_SCORM.docx 
