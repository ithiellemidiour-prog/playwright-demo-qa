const { expect } = require('@playwright/test');

class PageCommande {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.lignesPanier = page.locator('[data-test="inventory-item"]');
    this.boutonCommander = page.locator('[data-test="checkout"]');
    this.prenom = page.locator('[data-test="firstName"]');
    this.nom = page.locator('[data-test="lastName"]');
    this.codePostal = page.locator('[data-test="postalCode"]');
    this.continuer = page.locator('[data-test="continue"]');
    this.erreur = page.locator('[data-test="error"]');
    this.prixArticles = page.locator('[data-test="inventory-item-price"]');
    this.sousTotal = page.locator('[data-test="subtotal-label"]');
    this.taxe = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.terminer = page.locator('[data-test="finish"]');
    this.confirmation = page.locator('[data-test="complete-header"]');
  }

  async renseignerLivraison({ prenom, nom, codePostal }) {
    await this.prenom.fill(prenom);
    await this.nom.fill(nom);
    await this.codePostal.fill(codePostal);
    await this.continuer.click();
  }

  /** Lit un montant affiché du type « Item total: $39.98 ». */
  static montant(texte) {
    const m = texte.match(/\$(\d+(?:\.\d+)?)/);
    if (!m) throw new Error(`Montant introuvable dans « ${texte} »`);
    return Number(m[1]);
  }

  async lireRecapitulatif() {
    await expect(this.total).toBeVisible();
    const prix = (await this.prixArticles.allTextContents()).map((t) => Number(t.replace('$', '')));
    return {
      prix,
      sousTotal: PageCommande.montant(await this.sousTotal.innerText()),
      taxe: PageCommande.montant(await this.taxe.innerText()),
      total: PageCommande.montant(await this.total.innerText()),
    };
  }
}

module.exports = { PageCommande };
