const { test, expect } = require('./fixtures');
const { standard, cas_de_connexion } = require('../../donnees/utilisateurs');

test.describe('Connexion', () => {
  test('un compte valide arrive sur le catalogue', async ({ connexion, catalogue }) => {
    await connexion.ouvrir();
    await connexion.seConnecter(standard.identifiant, standard.motDePasse);
    await catalogue.verifierAffiche();
    await expect(catalogue.articles).toHaveCount(6);
  });

  // Un même scénario, joué avec plusieurs jeux de données.
  for (const cas of cas_de_connexion) {
    test(`refus de connexion : ${cas.nom}`, async ({ connexion, page }) => {
      await connexion.ouvrir();
      await connexion.seConnecter(cas.identifiant, cas.motDePasse);
      await expect(connexion.erreur).toContainText(cas.erreur);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test("le catalogue n'est pas accessible sans connexion", async ({ page, connexion }) => {
    await page.goto('/inventory.html');
    await expect(connexion.erreur).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
