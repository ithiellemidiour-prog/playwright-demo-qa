# Démo QA : tests E2E et API avec Playwright

![Tests](https://github.com/ithiellemidiour-prog/playwright-demo-qa/actions/workflows/tests.yml/badge.svg)

Un petit projet pour montrer comment j'organise une suite de tests automatisés :
lisible, stable, jouée sur plusieurs navigateurs et branchée sur l'intégration continue.

Les tests visent deux sites publics conçus pour l'entraînement :
- [saucedemo.com](https://www.saucedemo.com), une boutique de démonstration (tests E2E) ;
- [restful-booker](https://restful-booker.herokuapp.com), une API de réservation (tests d'API).

Aucun code ni aucune donnée de client ou d'employeur n'est utilisé ici.

## Ce que couvre la suite

| Domaine | Ce qui est vérifié |
|---|---|
| Connexion | compte valide, compte bloqué, mauvais mot de passe, champs vides, accès direct sans session |
| Catalogue | tri par prix et par nom, vérifié sur les valeurs affichées et non sur l'ordre attendu recopié |
| Panier | compteur après ajouts et retraits, contenu conservé après rechargement |
| Commande | parcours complet jusqu'à la confirmation, sous-total recalculé, champs obligatoires |
| API | cycle créer, lire, modifier, supprimer ; refus sans jeton **et** donnée inchangée ; recherche |

Les tests E2E tournent sur **Chromium, Firefox et WebKit** (le moteur de Safari).

## Choix de conception

- **Page Object Model** (`pages/`) : les sélecteurs vivent à un seul endroit, les tests se lisent comme des scénarios.
- **Données séparées** (`donnees/`) : les cas de connexion refusée sont un seul test joué avec plusieurs jeux de données.
- **Aucun état partagé** : chaque test part d'un navigateur neuf et, côté API, crée sa propre donnée avec un nom unique, puis la supprime.
- **Pas de relance automatique** (`retries: 0`) : un test instable doit se voir, pas se cacher derrière une deuxième chance.
- **Pas d'attente fixe** : uniquement les attentes automatiques de Playwright sur l'état réel de la page.
- **On vérifie l'effet, pas seulement la réponse** : un refus 403 ne suffit pas, le test relit la ressource pour prouver qu'elle n'a pas changé.
- **Traces et captures** conservées uniquement en cas d'échec, et rapport HTML publié par la CI.

## Lancer les tests

```bash
npm ci
npx playwright install --with-deps
npm test              # tout
npm run test:e2e      # les trois navigateurs
npm run test:api      # l'API seule
npm run rapport       # ouvrir le dernier rapport HTML
```

## Intégration continue

`.github/workflows/tests.yml` lance chaque navigateur et l'API dans un job séparé, en parallèle,
à chaque push, à chaque pull request et tous les lundis matin, puis publie le rapport HTML de chaque job.

---

Ithielle Midiour, ingénieure QA et Business Analyst, certifiée ISTQB.
