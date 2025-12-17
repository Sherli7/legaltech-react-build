import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

export default function Verify() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Email vérifié",
        description: "Votre compte est maintenant actif",
      });
      navigate("/dashboard");
    }, 1000);
  };

  const handleResend = async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast({
        title: "Email envoyé",
        description: "Un nouveau code de vérification a été envoyé",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Scale className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">SOLVILO</span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
            <CardDescription className="mt-2">
              Nous avons envoyé un code de vérification à votre adresse email. 
              Entrez ce code ci-dessous pour activer votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              className="w-full h-11" 
              onClick={handleVerify}
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Vérifier mon email
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Vous n'avez pas reçu le code ?
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Renvoyer le code
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link to="/auth/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
