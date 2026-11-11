const { expect } = require('@playwright/test');

class PageConnexion {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.identifiant = page.locator('[data-test="username"]');
    this.motDePasse = page.locator('[data-test="password"]');
    this.bouton = page.locator('[data-test="login-button"]');
    this.erreur = page.locator('[data-test="error"]');
  }

  async ouvrir() {
    await this.page.goto('/');
    await expect(this.bouton).toBeVisible();
  }

  async seConnecter(identifiant, motDePasse) {
    await this.identifiant.fill(identifiant);
    await this.motDePasse.fill(motDePasse);
    await this.bouton.click();
  }
}

module.exports = { PageConnexion };
