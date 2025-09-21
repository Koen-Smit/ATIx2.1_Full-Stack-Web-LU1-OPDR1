# Avans HBO Jaar 2, Periode 1: ATIx2.1 Full-Stack-Web-LU1-OPDR1 (2025-26)
- (02-09-2025 / 21-09-2025)
- Node.js, Express.js, MySQL, Bootstrap 5, Pug, Cypress, Azure

## Project Overview
Dit is het eerste project in periode 1 van jaar 2 van mijn Informatica-opleiding. Het project richt zich op full-stack webdevelopment. De focus in dit project ligt op de **staff viewpoint** van een filmverhuur systeem.

De opdracht: een complete web applicatie ontwikkelen met de Sakila database waarbij staff members klanten en films kunnen beheren.

**Waarom een medewerker viewpoint?**
Staff members hebben toegang tot klantbeheer, film catalogus, verhuur administratie en account management - dit zorgt voor een realistische en uitgebreide demonstratie van full-stack development vaardigheden.

**Projectstructuur:**
- **Backend**: Node.js/Express.js met MVC architectuur
- **Frontend**: Server-side rendering met Pug templates + Bootstrap 5
- **Database**: MySQL (Sakila schema)
- **Testing**: Cypress E2E tests (28 geautomatiseerde tests)
- **Deployment**: Azure Web App met CI/CD pipeline

Preview:
*[GIF]*

## Beveiliging
Beveiliging is een kernonderdeel van dit project:

**Geïmplementeerde beveiligingsmaatregelen:**
- **Bcrypt Password Hashing**: Alle wachtwoorden worden gehashed met salt
- **Sessions**: Veilige sessie-based authenticatie 
- **Input Validation**: JOI schema validatie voor alle user input
- **SQL Injection Prevention**: Prepared statements via MySQL2
- **Authentication Middleware**: Route protection voor alle gevoelige endpoints
- **Environment Variables**: Gevoelige configuratie via environment secrets
- **HTTPS Deployment**: SSL/TLS versleuteling in productie

**Authentication:**
- Registratie met sterke wachtwoord requirements
- Account activatie proces voor staff members
- Automatische sessie timeout bij inactiviteit

---

## Applicatiestructuur/Functionaliteit/Demo

### Backend (Node.js/Express.js):
Het systeem volgt een strikte **MVC (Model-View-Controller)** architectuur:

**Folder structuur:**
```
src/
├── controllers/    # Request handling & response logic
├── services/       # Business logic & data processing  
├── daos/           # Database access & SQL queries
├── routes/         # API endpoints & routing
├── utils/          # Security middleware & helpers
└── views/          # Pug templates
```

---

### Frontend (Pug + Bootstrap 5):

**1. Homepage & Navigatie**
- Welkomstpagina met duidelijke navigatie
- Responsive menu met active states
- Geoptimaliseerd voor desktop, tablet en mobile (responsive)

**2. Authenticatie Systeem**
- **Login**: Veilige authenticatie met email/wachtwoord
- **Registratie**: Account aanmaken met validatie en bcrypt hashing
- **Profiel**: Persoonlijke gegevens beheren en account activatie

*[GIF]*

**3. Klanten Management**
- **Overzicht**: Gepagineerde lijst met alle klanten
- **Zoeken**: Zoekfunctionaliteit op verschillende termen
- **Detail**: Volledig klantprofiel met verhuurgeschiedenis
- **Bewerken**: CRUD operaties met form validatie

*[GIF]*

**4. Films Catalogus**
- **Overzicht**: Film grid met beschikbaarheidsstatus
- **Zoeken**: Op titel, jaar en categorie
- **Detail**: Gedetailleerde film informatie
- **Verhuur**: Nieuwe verhuur kunnen starten

*[GIF]*

---

### Database (MySQL - Sakila):
Het project gebruikt de industry-standard **Sakila database** met optimalisaties.

---

### Testing (Cypress E2E):
Uitgebreide test suite met **28 geautomatiseerde tests** verdeeld over 4 categorieën:

**Test Coverage:**
- **Authentication Tests (7 tests)**: Login, registratie, form validatie
- **Navigation Tests (10 tests)**: Responsive design, menu functionaliteit
- **Customer Tests (5 tests)**: CRUD operaties, zoeken, paginatie  
- **Film Tests (6 tests)**: Catalogus browsing, filtering, detail views

**Test Execution:**
```bash
npm run cy:run          # Alle tests headless
npm run cy:open         # Interactive test runner
npm run cy:run:chrome   # Chrome-specific tests
npm run cy:run:firefox  # Firefox-specific tests
```

**CI/CD Pipeline:**
- Tests draaien automatisch bij elke push naar de main branch
- Deployment alleen bij 100% test success rate
- Screenshot/video capture bij test failures

---

### Deployment (Azure + GitHub Actions):

**Productie Environment:**
- **Azure Web App**: Cloud hosting
- **Environment Variables**: Veilige configuratie via Azure App Settings
- **CI/CD Pipeline**: Geautomatiseerde deployment via GitHub Actions

**Deployment Process:**
1. **Test Phase**: Alle Cypress tests moeten slagen
2. **Build Phase**: Dependencies installatie
3. **Deploy Phase**: Azure deployment met environment secrets

---

## Technische Stack Details

**Backend:**
- **Node.js 22.x** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver met connection pooling
- **Bcrypt** - Password hashing
- **JOI** - Input validation
- **Express-session** - Session management

**Frontend:**
- **Pug** - Template engine
- **Bootstrap 5** - CSS framework
- **Custom CSS** - Mobile optimalisaties
- **JavaScript** - Client-side interactivity

**Development Tools:**
- **Nodemon** - Development server
- **Cypress** - E2E testing
- **Winston** - Logging
- **Dotenv** - Environment configuration

---

_In de "about" pagina op de site vind je nog meer informatie over dit project._