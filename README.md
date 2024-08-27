# Yoga App - Backend et Frontend

Ce projet constitue le backend et le frontend d'une application de gestion de Yoga. Ce guide vous expliquera comment installer la base de données, comment installer et faire fonctionner l'application, comment lancer les différents tests, et comment générer les rapports de couverture de code.

## Prérequis

- Java 11
- Maven
- Node.js et npm
- MySQL

## Installation de la base de données

1. **Installation de MySQL** :
   - Téléchargez et installez MySQL depuis le [site officiel](https://dev.mysql.com/downloads/installer/).
   - Pendant l'installation, assurez-vous de noter le nom d'utilisateur et le mot de passe que vous configurez.

2. **Création de la base de données** :
    - En ligne de commande :
        - Connectez-vous à MySQL via la ligne de commande ou un client GUI comme MySQL Workbench.
        - Exécutez le fichier SQL fourni dans /resources/sql pour créer le schéma de la base de données :
            ```bash
            mysql -u <username> -p yoga dump-yoga-202408272111.sql
            ```
        - Remplacez `<username>` par votre nom d'utilisateur MySQL.
    - Via un gestionnaire de base de données tel que DBeaver.

## Installation de l'application

### Backend

1. **Cloner le dépôt** :
    ```bash
        git clone https://github.com/RykesZ/Testez-une-application-full-stack.git
    ```

2. **Naviguer dans le répertoire backend** :
    ```bash
        cd Testez-une-application-full-stack/back
    ```

3. **Installer les dépendances Maven** :
    ```bash
        mvn clean install
    ```

### Frontend

1. **Naviguer dans le répertoire frontend** :
    ```bash
        cd Testez-une-application-full-stack/front
    ```
2. **Installer les dépendances npm** :
    ```bash
        npm install
    ```

## Lancer l'application

### Backend

1. **Lancer le backend** :
    - Via la ligne de commande :
    ```bash
        mvn spring-boot:run
    ```

    - Ou via un IDE :
        - Ouvrez le projet dans votre IDE préféré.
        - Exécutez la classe com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication.

### Frontend

1. **Lancer le frontend** :
    ```bash
        npm run start
    ```
    - L'application frontend sera accessible via http://localhost:4200.

## Lancer les tests

### Tests Backend

1. **Lancer les tests unitaires et d'intégration** :
    ```bash
        mvn clean test
    ```
2. **Générer le rapport de couverture** :
    - Dans IntelliJ IDEA :
        - Clic droit sur le répertoire test/java.
        - Sélectionnez "More Run/Debug" > "Run 'Tests in 'java'' with Coverage".

    - Via la ligne de commande :
        ```bash
            mvn jacoco:report
        ```
    - Les rapports de couverture seront générés dans le répertoire target

### Tests Frontend

1. **Lancer les tests unitaires avec couverture** :
    ```bash
        npx jest --coverage
    ```
    - Le rapport de couverture sera disponible dans le répertoire front/coverage/lcov-report/index.html, et visible dans la console.

2. **Lancer les tests E2E et d'intégration** :
    - Lancer le backend avant de commencer les tests E2E.
    - Lancer les tests E2E :
        ```bash
            npm run e2e
        ```
    - Générer le rapport de couverture pour les tests E2E :
        ```bash
            npm run e2e:coverage
        ```
    - Le rapport de couverture sera visible dans la console.

## Comptes par défaut
    - Admin :
        - Email : yoga@studio.com
        - Mot de passe : test!1234
