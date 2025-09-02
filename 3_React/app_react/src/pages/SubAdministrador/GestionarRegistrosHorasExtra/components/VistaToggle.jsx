import React from 'react';

const VistaToggle = ({ vistaSemanal, setVistaSemanal, children }) => {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <button onClick={() => setVistaSemanal(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1976d2', background: vistaSemanal ? '#fff' : '#1976d2', color: vistaSemanal ? '#1976d2' : '#fff', cursor: 'pointer', fontWeight: 700 }}>Vista unitaria</button>
      <button onClick={() => setVistaSemanal(true)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1976d2', background: vistaSemanal ? '#1976d2' : '#fff', color: vistaSemanal ? '#fff' : '#1976d2', cursor: 'pointer', fontWeight: 700 }}>Vista semanal</button>
      {vistaSemanal && children}
    </div>
  );
};

export default VistaToggle;


