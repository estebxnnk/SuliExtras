  import { useState } from 'react';

function LoginModal({ onClose }) {
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario || !password) {
      setMensaje('Por favor, completa todos los campos.');
    } else {
      setMensaje('');
      // Aquí iría la lógica real de login
      onClose && onClose(); // Cierra el modal al hacer login (opcional)
    }
  };

  return (
    <div className="login-modal-bg">
      <style>{`
        .login-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .login-card {
          background: rgba(255,255,255,0.92);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 40px 32px 32px 32px;
          min-width: 340px;
          max-width: 95vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s, transform 0.3s;
          position: relative;
        }
        .login-close {
          position: absolute;
          top: 12px;
          right: 18px;
          font-size: 1.5rem;
          color: #888;
          cursor: pointer;
          font-weight: bold;
          transition: color 0.2s;
        }
        .login-close:hover {
          color: #52AB41;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 18px;
          text-align: center;
        }
        .login-error {
          color: #d32f2f;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-input {
          width: 100%;
          max-width: 300px;
          margin: 10px 0;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #bbb;
          font-size: 1rem;
          transition: border 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .login-input:focus {
          border: 1.5px solid #52AB41;
          box-shadow: 0 2px 8px #52AB4133;
        }
        .login-btn {
          width: 100%;
          max-width: 300px;
          margin: 18px 0 0 0;
          padding: 14px 0;
          border-radius: 16px;
          background: #52AB41;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover {
          background: #3fa32c;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 16px rgba(82,171,65,0.18);
        }
        @media (max-width: 600px) {
          .login-card {
            padding: 24px 8px 16px 8px;
            min-width: 90vw;
          }
        }
      `}</style>
      <div className="login-card">
        <span className="login-close" onClick={onClose} title="Cerrar">&times;</span>
        <div className="login-title">Iniciar sesión</div>
        {mensaje && <div className="login-error">{mensaje}</div>}
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            className="login-input"
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="login-btn" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal; 