# TODO SOLVILO Frontend (priorités)

## 0. Fait
- Nouveau dossier : validations type/taille/quotas, upload via service mockable, brouillon auto + bouton, éditeur riche (gras/italique/liste/paragraphes) avec sauvegarde HTML + texte, soumission force une sauvegarde.
- Abstraction API : `src/services/apiClient.ts`, `src/services/cases.ts` (mock par défaut, prêt backend).

## 1. Authentification et sécurisation
- Ajouter guard sur les routes dashboard (rediriger si non authentifié).
- Stockage/refresh token (ou cookie) + déconnexion.
- Route “mot de passe oublié” et finaliser “verify”.

## 2. Nouveau dossier (brancher backend)
- Brancher upload réel (multipart/presigned) et stocker les IDs retournés (`/cases/documents`).
- Persister brouillon côté API (`PATCH/PUT /cases/draft/:id`) incluant `narrativeHtml`, resync à l’ouverture.
- Bloquer navigation/fermeture si upload ou soumission en cours (beforeunload/confirm).
- Gérer erreurs serveur (upload/save/submit) avec toasts + retry.
- AJOUT partage/adverse : workflow de publication (brouillon → partage) et choix des pièces/exposé à partager (private/shared) ; traçabilité d’accès.

## 3. Dossiers & détail
- CaseDetail : téléchargement PDF (handler réel), réponses IA (POST), workflow entente (accepter/proposer/refuser) + historique des versions.
- CasesList : suppression avec confirmation, pagination/tri/états vides réels.

## 4. Abonnement
- Brancher consommation et changement de plan sur l’API (upgrade/downgrade/paiement), gérer statuts quota/suspension/erreur.

## 5. UX / Accessibilité
- Corriger les textes mal encodés restants (é/è/à).
- Focus states visibles, validations formulaires (email fort, MDP), messages d’erreur explicites.

## 6. Rôles et permissions
- Définir périmètre avocat (routes/features) et ACL front/back associées.***

## 7. Fonctionnalités complémentaires (à cadrer/prioriser)
- Notifications & centre d’alertes :
  - UI centre de notifications (liste, filtrage, marquer comme lu, “tout lire”).
  - Hooks/services `notifications` (polling ou WebSocket) avec mock + support backend. ✅ base service mock ajoutée.
  - Push/email : abonnement web push (si infra), templates email; déclencheurs (questions IA, entente, échéances, uploads).
  - Backlog : états (unread/read), types (info/warning/action), pagination/infinite scroll.
- Messagerie sécurisée :
  - UI fil de messages par dossier (threads, pièces attachées), indicateur de nouveau message.
  - ACL : qui peut poster/lire (partie, avocat, interne), statut confidentialité/partage à la partie adverse.
  - Hooks/services `messages` (mock + prêt backend), support pagination, envoi, marquer comme lu. ✅ base service mock ajoutée.
  - Notifications intégrées au centre (nouveau message).
- Partage/adverse & audit :
  - Service de partage (mock prêt backend) pour publier un dossier et régler la visibilité des pièces/exposé. ✅ sharingService ajouté.
  - Journal d’audit des accès/actions adverses (lecture, dépôt pièces, propositions), UI à créer.
- Templates & génération : modèles d’accord transactionnel, mises en demeure, PV, variables auto-remplies.
- OCR/indexation : recherche plein texte, extraction de métadonnées (dates, montants, clauses clés) sur pièces uploadées.
- Calendrier/échéances : gestion des délais légaux, relances automatiques, export ICS.
- Paiement/escrow : collecte sécurisée, éventuel compte séquestre, facturation/reçus.
- Conformité/sécurité : KYC/AML si requis, RGPD (droit d’accès/suppression), chiffrement repos/transit, rétention.***
