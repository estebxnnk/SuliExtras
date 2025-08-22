function Contactanos() {
  return (
    <div className="contactanos-bg">
      <style>{`
        .contactanos-bg {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/img/Recepcion.jpg') no-repeat center center;
          background-size: cover;
        }
        .contactanos-card {
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
        }
        .contactanos-card:hover {
          box-shadow: 0 16px 48px rgba(82,171,65,0.10), 0 0 0 2px #52AB4144;
          transform: scale(1.01);
        }
        .contactanos-title {
          font-size: 2rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 18px;
          text-align: center;
        }
        .contactanos-text {
          font-size: 1.1rem;
          color: #333;
          text-align: center;
          margin-bottom: 10px;
        }
        .contactanos-mail {
          font-size: 1.1rem;
          color: #52AB41;
          font-weight: 600;
          text-align: center;
          word-break: break-all;
        }
        @media (max-width: 600px) {
          .contactanos-card {
            padding: 24px 8px 16px 8px;
            min-width: 90vw;
          }
        }
      `}</style>
      <div className="contactanos-card">
        <div className="contactanos-title">Contáctanos</div>
        <div className="contactanos-text">Puedes escribirnos a nuestro correo:</div>
        <div className="contactanos-mail">contacto@suliextras.com</div>
      </div>
    </div>
  );
}

export default Contactanos;