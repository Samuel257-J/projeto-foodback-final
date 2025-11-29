import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";
import "./LoginPage.css"; // ✅ Carrega primeiro
import "../components/LoginForm/LoginForm.css"; // Carrega depois

function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* LADO ESQUERDO */}
        <div className="left-box">
          <h3 className="welcome-title">Bem-vindo ao</h3>

          <h1 className="logo">
            <span className="logo-food">Food</span>
            <span className="logo-back">Back</span>
          </h1>

          <p className="join-text">Junte-se a nós!</p>

          <Link to="/register" className="btn-cadastrar">
            CADASTRAR
          </Link>
        </div>

        {/* LADO DIREITO - FORMULÁRIO */}
        <div className="right-box">
          <div className="form-area">
            <LoginForm />
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
