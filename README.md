# Scorm
Ce projet est un module SCORM 1.2 interactif destiné à améliorer l'argumentaire de vente des formations en mathématiques.  
Il peut être importé dans n'importe quel LMS compatible SCORM.
Il est possible de visualiser la formation via ce lien sur la plateforme StromCloud :
https://app.cloud.scorm.com/sc/InvitationConfirmEmail?publicInvitationId=011132aa-75d7-43e8-8f66-dc1945f5e915

## Fonctionnalités

- Compteur de clics sur un lien vers la formation
- Sauvegarde du nombre de clics dans le LMS via `cmi.suspend_data`
- Communication SCORM (initialisation, commit, fin)
- Compatible SCORM 1.2

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

## Fichiers médias
les fichiers suivants contiennent des images 
├──Capture_ecran_formation_bosse_math.jpg
├──traffic-cone-31883_1280

