const { expect } = require('@playwright/test');

class PageCatalogue {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.titre = page.locator('[data-test="title"]');
    this.articles = page.locator('[data-test="inventory-item"]');
    this.prix = page.locator('[data-test="inventory-item-price"]');
    this.noms = page.locator('[data-test="inventory-item-name"]');
    this.tri = page.locator('[data-test="product-sort-container"]');
    this.pastillePanier = page.locator('[data-test="shopping-cart-badge"]');
    this.lienPanier = page.locator('[data-test="shopping-cart-link"]');
  }

  async verifierAffiche() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.titre).toHaveText('Products');
  }

  /** Transforme « Sauce Labs Backpack » en identifiant data-test du bouton. */
  static slug(nomArticle) {
    return nomArticle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async ajouterAuPanier(nomArticle) {
    await this.page.locator(`[data-test="add-to-cart-${PageCatalogue.slug(nomArticle)}"]`).click();
  }

  async retirerDuPanier(nomArticle) {
    await this.page.locator(`[data-test="remove-${PageCatalogue.slug(nomArticle)}"]`).click();
  }

  async trierPar(valeur) {
    await this.tri.selectOption(valeur);
  }

  async lirePrix() {
    const textes = await this.prix.allTextContents();
    return textes.map((t) => Number(t.replace('$', '')));
  }

  async ouvrirPanier() {
    await this.lienPanier.click();
  }
}

module.exports = { PageCatalogue };
