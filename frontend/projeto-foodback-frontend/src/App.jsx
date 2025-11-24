import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CompletarPerfil from './pages/CompletarPerfil';
import HomeOng from './pages/HomeOng';
import HomeEmpresa from './pages/HomeEmpresa';
import DoacoesDisponiveis from "./pages/DoacoesDisponiveis";
import Solicitacoes from "./pages/Solicitacoes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home-ong" element={<HomeOng />} />
        <Route path="/home-empresa" element={<HomeEmpresa />} />
        <Route path="/completar-perfil" element={<CompletarPerfil />} />
        <Route path="/doacoes-disponiveis" element={<DoacoesDisponiveis />} />
        <Route path="/solicitacoes" element={<Solicitacoes />} />
      </Routes>
    </Router>
  );
}

export default App;
