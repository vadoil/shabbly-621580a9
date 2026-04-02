import { useAuth, useIsAdmin } from "@/hooks/use-auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminPage = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user?.id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-6 rounded-lg border border-border bg-card">
          <h1 className="font-display text-xl font-bold text-center">Админ-панель</h1>
          {error && <p className="text-xs text-destructive text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button type="submit" className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Войти
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Нет прав администратора.</p>
          <button onClick={signOut} className="text-sm text-primary hover:underline">Выйти</button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={signOut} />;
};

export default AdminPage;
