# ATIx2.1_Full-Stack-Web-LU1-OPDR1
Koen Smit

## Samenvatting

In dit project bouw je in 3 weken een fullstack webapplicatie met JavaScript, Node.js, Express, Bootstrap en MySQL (Sakila database).
Je werkt vanuit één viewpoint (Staff, Customer of Admin) en bouwt functionaliteit die past bij die rol.

**Weekopdrachten:**
- Week 1: Basisstructuur maken, koppeling met MySQL Sakila, eerste routes & data tonen in de browser.
- Week 2: Functionaliteiten uitbreiden (CRUD + validatie + foutafhandeling) passend bij viewpoint.
- Week 3: Afronding → responsive frontend, UX, koppeling frontend-backend, testen & gebruiksvriendelijkheid.

**Doel:**
Een stabiele, robuuste en gebruiksvriendelijke Node.js/Express applicatie volgens MVC-architectuur, die data ontsluit uit de Sakila database, met duidelijke lagen:
Controller → Service → DAO → DB en Views voor presentatie.


# Project Checklist – Fullstack JS & SQL (Sakila)

## eigen to do:
- [ ] error handling in het nederlands met simpelere teksten? nu staat 2/3 van de berichten in engels
- [ ] pagina als database niet laad! om error tegen te gaan op bijv azure, maybe om de 5 seconde check om opnieuw te kijken of hij met database kan connecten?
- [ ] express-session voor inloggen, encrypt etc
- [ ] about page maken met onder andere: wireframes, userstories etc
- [ ] wireframes lijdend

## 📌 Weekopdrachten
- [ ] **Week 1 – Basisopzet en databasekoppeling**
  - [X] Projectstructuur opgezet met Node.js + Express + Bootstrap
  - [X] Verbinding gemaakt met de Sakila MySQL database
  - [ ] Minimaal 1 dataset ophalen en tonen in de browser
  - [ ] Code overzichtelijk en voorzien van comments/documentatie

- [ ] **Week 2 – Functionaliteit en interactie**
  - [ ] Functionaliteiten geïmplementeerd volgens gekozen viewpoint:
    - Staff → klanten beheren / verhuur registreren
    - Customer → films doorzoeken / huurgeschiedenis bekijken
    - Admin → medewerkers / klanten / films beheren, statistieken?
  - [ ] Ten minste 1 volledige CRUD-functionaliteit
  - [ ] Routes en queries werken correct
  - [ ] Validatie toegevoegd
  - [ ] Foutafhandeling aanwezig
  - [X] Architectuurprincipes gevolgd (MVC, lagen)

- [ ] **Week 3 – Afronding**
  - [ ] Frontend responsive en gebruiksvriendelijk gemaakt
  - [ ] UX richtlijnen gevolgd
  - [ ] Frontend ↔ Backend koppeling werkt correct
  - [ ] Applicatie getest op bruikbaarheid
  - [ ] About-pagina toegevoegd met user stories en acceptatiecriteria

---

## 📌 Functionele Requirements
- [ ] Minimaal 1 dataset uit DB tonen (Week 1)
- [ ] Minstens 1 CRUD-functionaliteit (Week 2)
- [ ] Authenticatie geïmplementeerd
- [ ] Functionaliteit sluit aan bij viewpoint (Staff / Customer / Admin)
- [ ] UX richtlijnen gevolgd
- [ ] About-pagina met user stories + acceptatiecriteria

---

## 📌 Non-Functionele Requirements
- [ ] **NF-01 Modulariteit:** lagen communiceren alleen met direct onderliggende laag
- [ ] **NF-02 Onderhoudbaarheid:** geen duplicatie van code (DRY)
- [ ] **Gebruiksvriendelijkheid:** logische toegang tot functionaliteit
- [ ] (Extra non-functionals volgen uit lessen)

---

## 📌 Randvoorwaarden
- [ ] **RV-01:** Alleen JavaScript + MySQL gebruiken (geen TS of SQL Server)
- [ ] **RV-02:** Server-side rendering (geen clientside SPA)
- [ ] **RV-03:** CSS framework gebruiken (Bootstrap of vergelijkbaar)
- [ ] **RV-04:** Open source technologieën waar mogelijk
- [ ] **RV-05:** Geen ORM, queries handmatig schrijven
- [ ] **RV-06:** Alleen callbacks (geen async/await of promises)
- [ ] **RV-07:** About-pagina aanwezig met user stories + acceptatiecriteria

---

## 📌 Rubric – Beoordelingscriteria

### Verplichte onderdelen (55 punten)
- [ ] App gebouwd met **JavaScript + Express** volgens **MVC**
- [ ] Data ontsloten uit Sakila database via **MySQL**
- [ ] App is stabiel, crasht niet, foutmeldingen helder
- [ ] Alle non-functionals en randvoorwaarden gerealiseerd
- [ ] Online CI/CD pipeline met automatische tests + deployment **// cypress**
- [ ] Online applicatie gebruikt online MySQL database
- [ ] Functionaliteit getest met geautomatiseerde testcases die slagen
- [ ] Server helder beschreven in `README.md`
- [ ] Must-have functionaliteiten passend bij viewpoint aanwezig
- [ ] Authenticatie aanwezig
- [ ] UX richtlijnen gevolgd

### Optionele onderdelen (extra punten)
- [ ] **Creativiteit (10):** originele uitwerking boven verwachting
- [ ] **Technische uitwerking (10):** technisch verrassende oplossingen
- [ ] **Usability & UX (15):** uitstekende bruikbaarheid en toegankelijkheid
- [ ] **Extra functionaliteit (10):** bijzondere aanvullingen naast verplichten
