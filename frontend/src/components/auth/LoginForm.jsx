import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import useAuth from '@/hooks/useAuth.jsx';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(
        formData.email, 
        formData.password, 
        formData.twoFactorCode || null
      );

      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
      } else if (result.success) {
        onSuccess?.();
      }
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {requiresTwoFactor ? 'Autenticação de Dois Fatores' : 'Login'}
        </CardTitle>
        <p className="text-muted-foreground">
          {requiresTwoFactor 
            ? 'Digite o código do seu aplicativo autenticador'
            : 'Entre na sua conta para continuar'
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!requiresTwoFactor && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {requiresTwoFactor && (
            <div className="space-y-2">
              <Label htmlFor="twoFactorCode">Código de Verificação</Label>
              <Input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                placeholder="000000"
                value={formData.twoFactorCode}
                onChange={handleChange}
                maxLength={6}
                required
                disabled={loading}
                className="text-center text-lg tracking-widest"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {requiresTwoFactor ? 'Verificar Código' : 'Entrar'}
          </Button>

          {requiresTwoFactor && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setRequiresTwoFactor(false);
                setFormData(prev => ({ ...prev, twoFactorCode: '' }));
              }}
              disabled={loading}
            >
              Voltar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

