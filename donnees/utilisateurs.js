// Comptes publics fournis par le site d'entraînement saucedemo.com (affichés sur sa page d'accueil).
const MOT_DE_PASSE = 'secret_sauce';

module.exports = {
  MOT_DE_PASSE,
  standard: { identifiant: 'standard_user', motDePasse: MOT_DE_PASSE },
  cas_de_connexion: [
    {
      nom: 'compte bloqué',
      identifiant: 'locked_out_user',
      motDePasse: MOT_DE_PASSE,
      erreur: 'Sorry, this user has been locked out.',
    },
    {
      nom: 'mauvais mot de passe',
      identifiant: 'standard_user',
      motDePasse: 'pas_le_bon',
      erreur: 'Username and password do not match any user in this service',
    },
    {
      nom: 'identifiant vide',
      identifiant: '',
      motDePasse: MOT_DE_PASSE,
      erreur: 'Username is required',
    },
    {
      nom: 'mot de passe vide',
      identifiant: 'standard_user',
      motDePasse: '',
      erreur: 'Password is required',
    },
  ],
};
