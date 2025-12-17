import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Calendar, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockCases, mockAnalysis, mockIAQuestions, mockSettlementVersions } from "@/lib/mock-data";
import { useState } from "react";
import { useMessages } from "@/hooks/use-messages";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CaseDetail() {
  const { id } = useParams();
  const caseFile = mockCases.find(c => c.id === id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState("");
  const { items: messages, isLoading: messagesLoading, isSending, sendMessage } = useMessages(id || "");

  if (!caseFile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Dossier non trouvé</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/cases">Retour aux dossiers</Link>
        </Button>
      </div>
    );
  }

  const isAnalysisReady = caseFile.status === "analysis" || caseFile.status === "settlement" || caseFile.status === "signed";
  const needsClarification = caseFile.status === "clarification";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard/cases">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{caseFile.reference}</h1>
              <StatusBadge status={caseFile.status} type="case" />
            </div>
            <p className="text-muted-foreground mt-1">{caseFile.subject}</p>
          </div>
        </div>
        {isAnalysisReady && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        )}
      </div>

      {/* Case info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <User2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Partie adverse</p>
                <p className="font-medium">{caseFile.opposingParty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Votre rôle</p>
                <p className="font-medium">{caseFile.role === "DEM" ? "Demandeur" : "Défendeur"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{new Date(caseFile.updatedAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IA Questions section */}
      {needsClarification && (
        <Card>
          <CardHeader>
            <CardTitle>Questions de l'IA juridique</CardTitle>
            <CardDescription>
              Répondez aux questions suivantes pour permettre une analyse complète de votre dossier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {mockIAQuestions.map((question, index) => (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1">{question.question}</span>
                      {question.isAnswered ? (
                        <Badge variant="secondary" className="ml-2">Répondu</Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">En attente</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9">
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Date limite : {new Date(question.deadline).toLocaleDateString("fr-FR")}
                      </p>
                      <Textarea
                        placeholder="Votre réponse..."
                        value={question.answer || answers[question.id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        rows={4}
                        disabled={question.isAnswered}
                      />
                      {!question.isAnswered && (
                        <Button size="sm">Soumettre la réponse</Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Analysis section */}
      {isAnalysisReady && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse juridique</CardTitle>
            <CardDescription>
              Analyse générée le {new Date(mockAnalysis.createdAt).toLocaleDateString("fr-FR")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Synthèse</TabsTrigger>
                <TabsTrigger value="analysis">Analyse</TabsTrigger>
                <TabsTrigger value="conclusion">Conclusion</TabsTrigger>
                <TabsTrigger value="disposition">Dispositif</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="mt-6">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>{mockAnalysis.summary}</p>
                </div>
              </TabsContent>
              <TabsContent value="analysis" className="mt-6">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {mockAnalysis.analysis}
                </div>
              </TabsContent>
              <TabsContent value="conclusion" className="mt-6">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>{mockAnalysis.conclusion}</p>
                </div>
              </TabsContent>
              <TabsContent value="disposition" className="mt-6">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {mockAnalysis.disposition}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Settlement section */}
      {(caseFile.status === "settlement" || caseFile.status === "signed") && (
        <Card>
          <CardHeader>
            <CardTitle>Proposition d'entente</CardTitle>
            <CardDescription>
              Version {mockSettlementVersions[0].version} - {new Date(mockSettlementVersions[0].createdAt).toLocaleDateString("fr-FR")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
              {mockSettlementVersions[0].content}
            </div>
            
            {caseFile.status === "settlement" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Proposer un amendement</label>
                  <Textarea placeholder="Décrivez vos modifications souhaitées..." rows={4} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Accepter l'accord</Button>
                  <Button variant="outline">Proposer une modification</Button>
                  <Button variant="destructive">Refuser</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Messaging */}
      <Card>
        <CardHeader>
          <CardTitle>Messagerie du dossier</CardTitle>
          <CardDescription>
            Échanges sécurisés avec les parties autorisées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-64 border rounded-md p-3 bg-muted/40">
            {messagesLoading ? (
              <p className="text-sm text-muted-foreground">Chargement des messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-lg bg-background border">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{msg.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <p className="text-sm mt-1">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="space-y-2">
            <Textarea
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!newMessage.trim()) return;
                  sendMessage(newMessage.trim()).then(() => setNewMessage(""));
                }}
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
