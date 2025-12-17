# SOLVILO Frontend – Fonctionnalités, Modèles et APIs

## Fonctionnalités couvertes (front)
- Landing/public : page d’accueil (Index), pages auth (login/register/verify), 404.
- Tableau de bord : résumé dossiers, quota abonnement.
- Dossiers : liste avec filtre/tri simple (mock), détail dossier (analyse, questions IA, entente, pièces), création nouveau dossier (stepper, upload fichiers, brouillon auto, éditeur riche pour l’exposé).
- Abonnement : affichage consommation/plan, sélection d’un nouveau plan (mock).
- Profil : édition infos de base (mock).
- Notifications (UI) : cloche dans le header, liste, marquer comme lu / tout lire (data mock).
- Messagerie dossier : fil de messages + envoi depuis la page CaseDetail (data mock).
- Partage/adverse (socle) : service pour publier un dossier, régler la visibilité des pièces, audit (pas encore d’UI).

## Modèles principaux (src/types)
- User : { id, email, firstName, lastName, role ("individual"|"company"|"lawyer"), isVerified }.
- Subscription : { plan, status, limits { cases, documents }, usage { cases, documents }, renewDate? }.
- CaseFile : { id, reference, status, currentStep, role ("DEM"|"DEF"), createdAt, updatedAt, opposingParty?, subject? }.
- Document : { id, type ("CONTRACT"|"EVIDENCE"|"AFFIDAVIT"), name, url, uploadedAt, visibility? ("private"|"shared"), sharedWith? }.
- IAQuestion : { id, question, answer?, deadline, isAnswered }.
- Analysis : { id, caseId, summary, analysis, conclusion, disposition, createdAt }.
- SettlementVersion : { id, version, content, status, createdAt, proposedBy }.
- DraftCase : { id, role, narrative, narrativeHtml?, contracts: UploadedFile[], evidence: UploadedFile[], accepted, updatedAt }.
- UploadedFile : { id, name, size, mimeType, kind ("contract"|"evidence"), status ("uploading"|"uploaded"|"error") }.
- Notifications : AppNotification { id, type, title, message, createdAt, isRead, link?, caseId? }.
- Messages : CaseMessage { id, caseId, author { id, name, role }, content, createdAt, isRead, attachments? }.

## Services et APIs consommées (côté front)
Note : mode mock par défaut via `VITE_USE_API_MOCK` ; bascule backend avec `VITE_API_URL` + `VITE_USE_API_MOCK=false`.

- casesService (src/services/cases.ts)
  - GET /cases/draft → DraftCase
  - PUT /cases/draft { role, narrative, narrativeHtml, contracts, evidence, accepted }
  - POST /cases/documents (multipart) { file, kind } → UploadedFile
  - POST /cases/draft/:id/submit

- notificationsService (src/services/notifications.ts)
  - GET /notifications → AppNotification[]
  - POST /notifications/:id/read
  - POST /notifications/read-all

- messagesService (src/services/messages.ts)
  - GET /cases/:id/messages → CaseMessage[]
  - POST /cases/:id/messages { content } → CaseMessage
  - POST /cases/:id/messages/read { ids: [] }

- sharingService (src/services/sharing.ts)
  - POST /cases/:id/share { shareDocuments?: [], shareNarrative?: boolean }
  - POST /cases/:id/documents/:docId/visibility { visibility: "private"|"shared" }
  - GET /cases/:id/audit → audit entries

## Points à intégrer côté backend pour couvrir le périmètre
- Auth : sessions/JWT, guards route dashboard.
- Endpoints listés ci-dessus avec validation, ACL (parties/avocats/admin), et audit des accès.
- Gestion du partage : passage brouillon → partagé, visibilité document, logs d’accès.
- Notifications/messages : persistance, pagination, état lu/non lu, déclencheurs métier (questions IA, entente, échéances, nouveaux messages/pièces).
- Upload : pre-signed URLs ou multipart sécurisé, contrôle type/poids/virus scan.

## Intégrations UI en attente
- UI partage/adverse (sélection pièces/exposé à partager, audit).
- Pagination/tri réel pour dossiers, messages, notifications.
- Guards auth et rôles (partie adverse, avocat, médiateur) pour afficher les bons éléments.***
