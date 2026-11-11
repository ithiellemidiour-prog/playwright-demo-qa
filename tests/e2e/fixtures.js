const base = require('@playwright/test');
const { PageConnexion } = require('../../pages/PageConnexion');
const { PageCatalogue } = require('../../pages/PageCatalogue');
const { PageCommande } = require('../../pages/PageCommande');
const { standard } = require('../../donnees/utilisateurs');

/**
 * Chaque test reçoit ses propres pages et, s'il le demande, une session déjà ouverte.
 * Aucun état partagé entre tests : chaque test part d'un contexte de navigateur neuf.
 */
const test = base.test.extend({
  connexion: async ({ page }, use) => use(new PageConnexion(page)),
  catalogue: async ({ page }, use) => use(new PageCatalogue(page)),
  commande: async ({ page }, use) => use(new PageCommande(page)),
  connecte: async ({ connexion, catalogue }, use) => {
    await connexion.ouvrir();
    await connexion.seConnecter(standard.identifiant, standard.motDePasse);
    await catalogue.verifierAffiche();
    await use(catalogue);
  },
});

module.exports = { test, expect: base.expect };
