## Formulaire de création d'avis

**Pré-requis** :

Docker avec utilisation de docker-compose

**Installation** :

clonez le projet puis lancez les commandes suivantes

Téléchargement des images :

`docker-compose pull`

Installation et lancement des conteneurs (prenez un café) :

`docker-compose up -d`
ou
`docker-compose up -build` si la première commande génère une erreur

Création de la base de données :

`docker-compose exec php bin/console doctrine:migrations:migrate`

Création des fixtures

`docker-compose exec php bin/console hautelook:fixtures:load`


L'interface devrait être disponible à l'adresse https://localhost/reviews/

Vous pouvez tester l'API grâce à l'interface swagger à l'adresse https://localhost:8443
