import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockCases, mockSubscription } from "@/lib/mock-data";
import type { CaseStatus } from "@/types";

export default function CasesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const quotaReached = mockSubscription.usage.cases >= mockSubscription.limits.cases;

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch = 
      c.reference.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.opposingParty?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes dossiers</h1>
          <p className="text-muted-foreground mt-1">
            {mockCases.length} dossier{mockCases.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button asChild disabled={quotaReached}>
          <Link to="/dashboard/cases/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un dossier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="clarification">Éclaircissement</SelectItem>
                <SelectItem value="analysis">Analyse</SelectItem>
                <SelectItem value="settlement">Négociation</SelectItem>
                <SelectItem value="signed">Signé</SelectItem>
                <SelectItem value="closed">Clôturé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Partie adverse</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Mise à jour</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun dossier trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((caseFile) => (
                    <TableRow key={caseFile.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/dashboard/cases/${caseFile.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {caseFile.reference}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {caseFile.subject}
                      </TableCell>
                      <TableCell>{caseFile.opposingParty}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                          {caseFile.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={caseFile.status} type="case" />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(caseFile.updatedAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/cases/${caseFile.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir le dossier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
