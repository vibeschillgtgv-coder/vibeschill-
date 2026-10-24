import { useState } from 'react';
import './App.css';

const tickets = [
  { name: 'STANDARD', price: 3000, description: 'Accès à l’événement', icon: '🎟️' },
  { name: 'PREMIUM', price: 7000, description: 'Une expérience privilégiée', icon: '⭐' },
  { name: 'VIP', price: 20000, description: 'Le confort et l’exclusivité', icon: '👑' },
];

function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setCustomer({
      ...customer,
      [event.target.name]: event.target.value,
    });
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!selectedTicket || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        '/.netlify/functions/create-payment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketType: selectedTicket.name,
            customer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.paymentUrl) {
        throw new Error(
          data.error || 'Impossible de préparer le paiement.'
        );
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(
        err.message ||
          'Une erreur est survenue. Vérifie ta connexion Internet.'
      );
      setLoading(false);
    }
  };

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
            <p className="eyebrow">LA RENCONTRE DES BONNES VIBES</p>
            <h1>
              VIBES <span>CHILL</span>
            </h1>
            <p className="hero-subtitle">
              La musique, le partage et des souvenirs inoubliables.
            </p>
            <p className="hero-description">
              Prépare-toi à vivre une expérience unique. Réserve ton ticket
              et rejoins-nous !
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
              Choisis la formule qui te correspond et prépare-toi à vivre
              Vibes Chill.
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
                <button
                  type="button"
                  className="ticket-button"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setError('');
                    document
                      .getElementById('reservation')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  CHOISIR CE TICKET
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="reservation" className="contact-section">
          <p className="eyebrow">RÉSERVATION</p>
          <h2>
            {selectedTicket
              ? `Ticket ${selectedTicket.name}`
              : 'Choisis ton ticket'}
          </h2>

          {selectedTicket ? (
            <>
              <p>
                Montant :{' '}
                <strong>
                  {selectedTicket.price.toLocaleString('fr-FR')} FCFA
                </strong>
              </p>

              <form onSubmit={handlePayment}>
                <label>
                  Prénom
                  <input
                    name="firstname"
                    value={customer.firstname}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label>
                  Nom
                  <input
                    name="lastname"
                    value={customer.lastname}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </label>

                <label>
                  Adresse e-mail
                  <input
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  Numéro de téléphone
                  <input
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="Ex. +229..."
                    required
                  />
                </label>

                {error && (
                  <p role="alert" style={{ color: '#ff7777' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading
                    ? 'PRÉPARATION DU PAIEMENT...'
                    : 'CONTINUER VERS LE PAIEMENT →'}
                </button>
              </form>
            </>
          ) : (
            <p>Sélectionne un ticket ci-dessus pour commencer.</p>
          )}
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
