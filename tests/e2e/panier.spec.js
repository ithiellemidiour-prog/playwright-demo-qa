const { test, expect } = require('./fixtures');

test.describe('Panier', () => {
  test('la pastille suit les ajouts et les retraits', async ({ connecte }) => {
    await expect(connecte.pastillePanier).toHaveCount(0);

    await connecte.ajouterAuPanier('Sauce Labs Backpack');
    await expect(connecte.pastillePanier).toHaveText('1');

    await connecte.ajouterAuPanier('Sauce Labs Bike Light');
    await expect(connecte.pastillePanier).toHaveText('2');

    await connecte.retirerDuPanier('Sauce Labs Backpack');
    await expect(connecte.pastillePanier).toHaveText('1');
  });

  test('le panier garde son contenu après un rechargement de page', async ({ connecte, commande, page }) => {
    await connecte.ajouterAuPanier('Sauce Labs Onesie');
    await page.reload();
    await expect(connecte.pastillePanier).toHaveText('1');
    await connecte.ouvrirPanier();
    await expect(commande.lignesPanier).toHaveCount(1);
    await expect(commande.lignesPanier).toContainText('Sauce Labs Onesie');
  });
});
