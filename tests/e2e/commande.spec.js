const { test, expect } = require('./fixtures');

const LIVRAISON = { prenom: 'Camille', nom: 'Test', codePostal: '59000' };

test.describe('Commande', () => {
  test('parcours complet : du panier à la confirmation', async ({ connecte, commande }) => {
    await connecte.ajouterAuPanier('Sauce Labs Backpack');
    await connecte.ajouterAuPanier('Sauce Labs Fleece Jacket');
    await connecte.ouvrirPanier();
    await expect(commande.lignesPanier).toHaveCount(2);

    await commande.boutonCommander.click();
    await commande.renseignerLivraison(LIVRAISON);

    const recap = await commande.lireRecapitulatif();
    // Le sous-total doit être la somme des articles : on le recalcule au lieu de recopier l'écran.
    const somme = recap.prix.reduce((a, b) => a + b, 0);
    expect(recap.sousTotal).toBeCloseTo(somme, 2);
    expect(recap.total).toBeCloseTo(recap.sousTotal + recap.taxe, 2);

    await commande.terminer.click();
    await expect(commande.confirmation).toHaveText('Thank you for your order!');
  });

  for (const champ of ['prenom', 'nom', 'codePostal']) {
    test(`la commande est bloquée si le champ « ${champ} » est vide`, async ({ connecte, commande, page }) => {
      await connecte.ajouterAuPanier('Sauce Labs Bolt T-Shirt');
      await connecte.ouvrirPanier();
      await commande.boutonCommander.click();
      await commande.renseignerLivraison({ ...LIVRAISON, [champ]: '' });
      await expect(commande.erreur).toBeVisible();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
