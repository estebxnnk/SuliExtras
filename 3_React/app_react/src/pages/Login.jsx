import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [mensaje, setMensaje] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }
    setMensaje('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {}
      if (!response.ok) {
        setMensaje(data.message || 'Credenciales incorrectas');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRol', data.rol);
      setMensaje('');
      // Redirección según el rol
      if (data.rol === 'SubAdministrador') {
        navigate('/panel-admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: "url('/img/Recepcion.jpg') no-repeat center center",
      backgroundSize: 'cover',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '40px 32px 32px 32px',
        minWidth: 340,
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#222', marginBottom: 18, textAlign: 'center' }}>
          Iniciar sesión
        </div>
        {mensaje && <div style={{ color: '#d32f2f', marginBottom: 10, fontWeight: 500 }}>{mensaje}</div>}
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit} autoComplete="off">
          <input
            style={{
              width: '100%',
              maxWidth: 300,
              margin: '10px 0',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #bbb',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={{
              width: '100%',
              maxWidth: 300,
              margin: '10px 0',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #bbb',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              maxWidth: 300,
              margin: '18px 0 0 0',
              padding: '14px 0',
              borderRadius: 16,
              background: '#52AB41',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 