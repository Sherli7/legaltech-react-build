// Mock data for development - simulates API responses
import type { User, Subscription, CaseFile, IAQuestion, Analysis, SettlementVersion } from "@/types";

export const mockUser: User = {
  id: "usr_001",
  email: "jean.dupont@email.fr",
  firstName: "Jean",
  lastName: "Dupont",
  role: "individual",
  isVerified: true,
};

export const mockSubscription: Subscription = {
  plan: "standard",
  status: "active",
  limits: {
    cases: 5,
    documents: 20,
  },
  usage: {
    cases: 2,
    documents: 8,
  },
  renewDate: "2025-02-15",
};

export const mockCases: CaseFile[] = [
  {
    id: "case_001",
    reference: "SOL-2025-0001",
    status: "analysis",
    currentStep: "Analyse en cours",
    role: "DEM",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
    opposingParty: "SAS Entreprise ABC",
    subject: "Litige contractuel - Livraison",
  },
  {
    id: "case_002",
    reference: "SOL-2025-0002",
    status: "clarification",
    currentStep: "Questions IA",
    role: "DEM",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-14",
    opposingParty: "M. Martin Pierre",
    subject: "Inexécution contractuelle",
  },
  {
    id: "case_003",
    reference: "SOL-2024-0089",
    status: "signed",
    currentStep: "Accord signé",
    role: "DEF",
    createdAt: "2024-11-20",
    updatedAt: "2024-12-05",
    opposingParty: "SARL Tech Solutions",
    subject: "Retard de paiement",
  },
];

export const mockIAQuestions: IAQuestion[] = [
  {
    id: "q_001",
    question: "Pouvez-vous préciser la date exacte de la dernière communication avec la partie adverse concernant le litige ?",
    answer: undefined,
    deadline: "2025-01-20",
    isAnswered: false,
  },
  {
    id: "q_002",
    question: "Disposez-vous de preuves écrites (emails, courriers) attestant de vos tentatives de résolution amiable préalables ?",
    answer: "Oui, j'ai envoyé 3 emails de relance les 15/10, 22/10 et 05/11/2024.",
    deadline: "2025-01-20",
    isAnswered: true,
  },
  {
    id: "q_003",
    question: "Le contrat initial prévoit-il une clause de médiation ou d'arbitrage ?",
    answer: undefined,
    deadline: "2025-01-20",
    isAnswered: false,
  },
];

export const mockAnalysis: Analysis = {
  id: "ana_001",
  caseId: "case_001",
  summary: "Le litige porte sur l'inexécution partielle d'un contrat de prestation de services. Le demandeur allègue un retard de livraison de 45 jours et des non-conformités techniques. Les éléments fournis permettent d'établir une base factuelle solide.",
  analysis: "Après examen des pièces versées au dossier, il apparaît que :\n\n1. Le contrat signé le 15/06/2024 stipule clairement un délai de livraison de 30 jours (Article 4.2)\n2. La livraison effective est intervenue le 15/09/2024, soit 45 jours après l'échéance contractuelle\n3. Le procès-verbal de réception fait état de 3 non-conformités majeures\n4. Les échanges de courriels démontrent l'absence de force majeure justifiant le retard\n\nAu regard des articles 1217 et suivants du Code civil, le créancier dispose de plusieurs options : exécution forcée, résolution du contrat, ou réduction du prix.",
  conclusion: "Le demandeur est fondé à solliciter une indemnisation au titre du préjudice subi. Les manquements contractuels sont caractérisés et documentés. Une résolution amiable avec compensation financière semble la voie la plus appropriée.",
  disposition: "Il est recommandé de proposer à la partie adverse :\n- Une réduction de 15% du prix contractuel (soit 4 500 €)\n- Le règlement des non-conformités sous 15 jours\n- À défaut d'accord, une procédure contentieuse pourrait être envisagée avec de bonnes chances de succès.",
  createdAt: "2025-01-15",
};

export const mockSettlementVersions: SettlementVersion[] = [
  {
    id: "set_001",
    version: 1,
    content: "ACCORD TRANSACTIONNEL\n\nEntre les parties soussignées...\n\nArticle 1 - Objet\nLe présent accord a pour objet de mettre fin définitivement au litige opposant les parties.\n\nArticle 2 - Concessions réciproques\n- La partie défenderesse s'engage à verser la somme de 4 500 € au titre de la réduction de prix\n- La partie demanderesse renonce à toute action contentieuse future\n\nArticle 3 - Délais\nLe paiement interviendra sous 30 jours à compter de la signature.",
    status: "pending",
    createdAt: "2025-01-16",
    proposedBy: "system",
  },
];

export const subscriptionPlans = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    features: [
      "1 dossier par mois",
      "5 documents maximum",
      "Analyse de base",
      "Support email",
    ],
    limits: { cases: 1, documents: 5 },
  },
  {
    id: "standard",
    name: "Standard",
    price: 29,
    features: [
      "5 dossiers par mois",
      "20 documents maximum",
      "Analyse complète",
      "Questions IA illimitées",
      "Support prioritaire",
    ],
    limits: { cases: 5, documents: 20 },
    popular: true,
  },
  {
    id: "pro",
    name: "Professionnel",
    price: 79,
    features: [
      "20 dossiers par mois",
      "100 documents maximum",
      "Analyse avancée",
      "Export PDF illimité",
      "API access",
      "Support dédié",
    ],
    limits: { cases: 20, documents: 100 },
  },
  {
    id: "lawyer",
    name: "Avocat",
    price: 149,
    features: [
      "Dossiers illimités",
      "Documents illimités",
      "Gestion multi-clients",
      "White-label",
      "Intégrations cabinet",
      "Account manager",
    ],
    limits: { cases: -1, documents: -1 },
  },
];
