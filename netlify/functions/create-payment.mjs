const TICKETS = {
  STANDARD: 3000,
  PREMIUM: 7000,
  VIP: 20000,
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    const mode = process.env.FEDAPAY_MODE || "sandbox";

    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: "Configuration du paiement manquante" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (mode !== "sandbox") {
      return new Response(
        JSON.stringify({ error: "Le mode test est obligatoire pour le moment" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const ticketType = String(body.ticketType || "").toUpperCase();
    const amount = TICKETS[ticketType];

    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Type de ticket invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const customer = body.customer || {};
    const firstname = String(customer.firstname || "").trim();
    const lastname = String(customer.lastname || "").trim();
    const email = String(customer.email || "").trim();
    const phone = String(customer.phone || "").trim();

    if (
      !firstname ||
      !lastname ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\+?[0-9\s()-]{8,20}$/.test(phone)
    ) {
      return new Response(
        JSON.stringify({
          error: "Renseigne un nom, un prénom, un e-mail et un numéro valides.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiBase = "https://sandbox-api.fedapay.com/v1";
    const headers = {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const createResponse = await fetch(`${apiBase}/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        description: `Ticket ${ticketType} - Vibes Chill`,
        amount,
        currency: { iso: "XOF" },
        customer: {
          firstname,
          lastname,
          email,
          phone_number: {
            number: phone,
            country: "BJ",
          },
        },
      }),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      console.error("Échec création transaction FedaPay :", createResponse.status);

      return new Response(
        JSON.stringify({ error: "Impossible de créer le paiement. Réessaie plus tard." }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const transaction =
      createData["v1/transaction"] ||
      createData.transaction ||
      createData;

    if (!transaction.id) {
      console.error("Réponse FedaPay sans identifiant de transaction.");

      return new Response(
        JSON.stringify({ error: "Réponse de paiement inattendue." }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const tokenResponse = await fetch(
      `${apiBase}/transactions/${transaction.id}/token`,
      {
        method: "POST",
        headers,
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Échec génération lien FedaPay :", tokenResponse.status);

      return new Response(
        JSON.stringify({ error: "Impossible de générer le lien de paiement." }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const payment =
      tokenData["v1/transaction"] ||
      tokenData.transaction ||
      tokenData;

    const paymentUrl =
      payment.url ||
      payment.payment_url ||
      tokenData.url;

    if (!paymentUrl) {
      console.error("Réponse FedaPay sans URL de paiement.");

      return new Response(
        JSON.stringify({ error: "Lien de paiement indisponible." }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        paymentUrl,
        transactionId: transaction.id,
        ticketType,
        amount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur interne lors de la création du paiement.");

    return new Response(
      JSON.stringify({ error: "Une erreur est survenue. Réessaie plus tard." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
