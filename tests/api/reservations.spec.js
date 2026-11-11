const { test, expect } = require('@playwright/test');

// API publique d'entraînement : https://restful-booker.herokuapp.com
// Identifiants de démonstration publiés dans sa documentation.
const ADMIN = { username: 'admin', password: 'password123' };

const nouvelleReservation = () => ({
  firstname: 'Camille',
  lastname: `Test-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, // donnée unique : les tests ne se marchent pas dessus
  totalprice: 180,
  depositpaid: true,
  bookingdates: { checkin: '2027-03-01', checkout: '2027-03-04' },
  additionalneeds: 'Petit-déjeuner',
});

async function jeton(request) {
  const reponse = await request.post('/auth', { data: ADMIN });
  expect(reponse.ok()).toBeTruthy();
  const { token } = await reponse.json();
  expect(token, "l'API doit renvoyer un jeton").toBeTruthy();
  return token;
}

async function supprimer(request, id) {
  const token = await jeton(request);
  await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
}

test.describe('API de réservation', () => {
  test('cycle de vie complet : créer, lire, modifier, supprimer', async ({ request }) => {
    const donnees = nouvelleReservation();

    // Créer
    const creation = await request.post('/booking', { data: donnees });
    expect(creation.status()).toBe(200);
    const { bookingid, booking } = await creation.json();
    expect(booking).toMatchObject(donnees);

    // Lire
    const lecture = await request.get(`/booking/${bookingid}`);
    expect(lecture.status()).toBe(200);
    expect(await lecture.json()).toMatchObject(donnees);

    // Modifier (authentifié)
    const token = await jeton(request);
    const modifiee = { ...donnees, totalprice: 240, additionalneeds: 'Dîner' };
    const maj = await request.put(`/booking/${bookingid}`, {
      data: modifiee,
      headers: { Cookie: `token=${token}` },
    });
    expect(maj.status()).toBe(200);
    expect(await maj.json()).toMatchObject(modifiee);

    // Supprimer, puis vérifier que la ressource a bien disparu
    const suppression = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(suppression.status()).toBe(201);
    const relecture = await request.get(`/booking/${bookingid}`);
    expect(relecture.status()).toBe(404);
  });

  test('une modification sans jeton est refusée et ne change rien', async ({ request }) => {
    const donnees = nouvelleReservation();
    const { bookingid } = await (await request.post('/booking', { data: donnees })).json();

    const refus = await request.put(`/booking/${bookingid}`, {
      data: { ...donnees, totalprice: 1 },
    });
    expect(refus.status()).toBe(403);

    // Le refus ne suffit pas : on vérifie que la donnée n'a pas bougé.
    const lecture = await request.get(`/booking/${bookingid}`);
    expect((await lecture.json()).totalprice).toBe(donnees.totalprice);

    await supprimer(request, bookingid);
  });

  test('de mauvais identifiants ne donnent pas de jeton', async ({ request }) => {
    const reponse = await request.post('/auth', { data: { username: 'admin', password: 'faux' } });
    const corps = await reponse.json();
    expect(corps.token).toBeUndefined();
    expect(corps.reason).toBe('Bad credentials');
  });

  test('la recherche par nom retrouve la réservation créée', async ({ request }) => {
    const donnees = nouvelleReservation();
    const { bookingid } = await (await request.post('/booking', { data: donnees })).json();

    const recherche = await request.get('/booking', {
      params: { firstname: donnees.firstname, lastname: donnees.lastname },
    });
    expect(recherche.status()).toBe(200);
    const ids = (await recherche.json()).map((r) => r.bookingid);
    expect(ids).toContain(bookingid);

    await supprimer(request, bookingid);
  });
});
