import './App.css';

const tickets = [
  {
    name: 'STANDARD',
    price: 3000,
    description: 'Accès à l’événement',
    icon: '🎟️',
  },
  {
    name: 'PREMIUM',
    price: 7000,
    description: 'Une expérience privilégiée',
    icon: '⭐',
  },
  {
    name: 'VIP',
    price: 20000,
    description: 'Le confort et l’exclusivité',
    icon: '👑',
  },
];

function App() {
  const whatsappNumber = '2290167103818';
  const phoneNumber = '+2290167103818';

  return (
    <div className="site">
      <header className="navbar">
        <div className="logo">
          VIBES <span>CHILL</span>
        </div>

        <a href="#tickets" className="nav-button">
          Nos tickets
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              LA RENCONTRE DES BONNES VIBES
            </p>

            <h1>
              VIBES <span>CHILL</span>
            </h1>

            <p className="hero-subtitle">
              La musique, le partage et des souvenirs inoubliables.
            </p>

            <p className="hero-description">
              Prépare-toi à vivre une expérience unique.
              Réserve ton ticket et rejoins-nous !
            </p>

            <a href="#tickets" className="primary-button">
              DÉCOUVRIR LES TICKETS →
            </a>
          </div>

          <div className="hero-decoration">
            <div className="gold-circle">VC</div>
            <span>GOOD VIBES ONLY</span>
          </div>
        </section>

        <section id="tickets" className="tickets-section">
          <div className="section-heading">
            <p className="eyebrow">CHOISIS TON EXPÉRIENCE</p>

            <h2>Nos tickets</h2>

            <p>
              Choisis la formule qui te correspond et prépare-toi à
              vivre Vibes Chill.
            </p>
          </div>

          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <article
                className={`ticket-card ${ticket.name.toLowerCase()}`}
                key={ticket.name}
              >
                <div className="ticket-icon">{ticket.icon}</div>

                <h3>{ticket.name}</h3>

                <p className="ticket-description">
                  {ticket.description}
                </p>

                <p className="ticket-price">
                  {ticket.price.toLocaleString('fr-FR')}
                  <span> FCFA</span>
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Bonjour, je souhaite réserver un ticket ${ticket.name} pour Vibes Chill au prix de ${ticket.price} FCFA.`
                  )}`}
                  className="ticket-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RÉSERVER
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <p className="eyebrow">RESTONS CONNECTÉS</p>

          <h2>On se retrouve à Vibes Chill !</h2>

          <p>
            Pour toute information sur les tickets, contacte-nous.
          </p>

          <a
            href={`tel:${phoneNumber}`}
            className="contact-button"
          >
            NOUS CONTACTER
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="logo">
          VIBES <span>CHILL</span>
        </div>

        <p>
          © {new Date().getFullYear()} Vibes Chill. Tous droits réservés.
        </p>

        <p>Good vibes only ✨</p>
      </footer>
    </div>
  );
}

export default App;