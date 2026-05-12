# PetAdopt Full Stack Application - Comprehensive Documentation

This document serves as the complete technical blueprint and architectural breakdown of the **PetAdopt** platform. It details every technology used, architectural decisions made, and a comprehensive breakdown of every folder and file in the system.

---

## 1. High-Level Architecture Overview

The system is designed as a modern **Single Page Application (SPA)** architecture, separated into two distinct layers:
1. **The Backend (API Layer):** A RESTful API built with **C# ASP.NET Core 8**, acting as the brain of the application. It handles business logic, security (JWT Authentication), database interactions, and real-time communication.
2. **The Frontend (Client Layer):** A dynamic UI built with **React.js** and **Vite**. It handles all user interactions, routing, and state management, communicating with the backend purely through JSON API calls.
3. **The Database Layer:** A local **SQLite** embedded database (`petadopt.db`) managed entirely via **Entity Framework Core (EF Core)**.

---

## 2. Technology Stack Breakdown

### Backend Technologies
*   **C# / .NET 8.0:** The core programming language and framework providing high performance and modern web capabilities.
*   **ASP.NET Core Web API:** The framework used to expose RESTful HTTP endpoints (`GET`, `POST`, `PUT`, `DELETE`).
*   **Entity Framework Core (EF Core):** An Object-Relational Mapper (ORM) that allows the backend to interact with the database using C# objects instead of raw SQL queries.
*   **Microsoft.EntityFrameworkCore.Sqlite:** The specific database provider allowing EF Core to generate and manage the embedded `petadopt.db` SQLite database file.
*   **JWT (JSON Web Tokens):** Used for stateless, secure authentication. Users log in, receive a cryptographic token, and attach it to subsequent requests to prove their identity and role (Admin, PetOwner, Adopter).
*   **SignalR:** Microsoft's real-time communication library. It establishes a WebSocket connection to the frontend to push instant pop-up notifications without requiring a page refresh.
*   **Swagger (Swashbuckle):** Auto-generates a visual documentation page for the API, allowing developers to test endpoints directly from the browser during development.

### Frontend Technologies
*   **React.js:** A JavaScript library for building component-based user interfaces.
*   **Vite:** A modern, incredibly fast frontend build tool and development server used instead of Create-React-App.
*   **Axios:** A promise-based HTTP client used to send API requests to the ASP.NET Core backend. It automatically attaches the JWT token to requests.
*   **React Router DOM:** Manages client-side routing, allowing users to navigate between pages (e.g., `/dashboard`, `/login`) without the browser reloading the page.
*   **React Context API:** A global state management system built into React. Used heavily in `AuthContext` to keep track of the currently logged-in user across the entire app.
*   **Bootstrap 5:** A CSS framework used for rapid, responsive UI design (Grid systems, buttons, cards, badges).
*   **React-Toastify:** A library used to display sleek, non-intrusive pop-up notifications (e.g., "Login Successful" or real-time SignalR alerts).

---

## 3. Backend Folder & File Breakdown

The backend follows a strict **N-Tier Architecture** pattern, separating concerns into Controllers (API Layer), Services (Business Logic Layer), Data (Database Layer), and Models/DTOs (Data Structures).

### `/controllers`
Controllers handle incoming HTTP requests from the React app, validate the input, pass it to the Services layer, and return HTTP responses (`200 OK`, `400 Bad Request`).
*   **`AuthController.cs`**: Handles user Registration, Login, and Admin approval of new accounts. Issues JWT tokens upon successful login.
*   **`PetController.cs`**: Manages CRUD operations for Pets. Handles image uploads, fetching approved pets, and allows Admins to approve/reject pending pet posts.
*   **`AdoptionController.cs`**: Manages adoption requests. Allows Adopters to apply, and Owners to view, approve, or reject applications.
*   **`ReviewController.cs`**: Allows Adopters to submit or update feedback/ratings on pets they have adopted.
*   **`FavoriteController.cs`**: Manages the logic for Adopters to save ("favorite") and un-save pets they are interested in.

### `/Services`
This layer contains the core **Business Logic**. Controllers should be "thin" (just routing traffic), while Services are "thick" (doing the actual work and database queries).
*   **`AuthService.cs`**: Validates passwords, creates new users in the DB, and generates the JWT tokens.
*   **`PetService.cs`**: Queries the database for pets. Handles the mapping of database `Pet` models into `PetResponseDto` objects. Contains logic for editing and deleting pets.
*   **`AdoptionService.cs`**: Contains the logic ensuring an Adopter cannot apply for a pet twice, and updates the Pet's status to "Adopted" once an Owner approves an application.
*   **`ReviewService.cs`**: Enforces rules (e.g., verifying a user *actually* adopted the pet before allowing them to leave a review).
*   **`FavoriteService.cs`**: Handles adding/removing relationships in the `Favorites` table.

### `/Data`
*   **`AppDbContext.cs`**: The absolute core of database communication. It inherits from `DbContext` and defines `DbSet` properties for every table. It also contains `OnModelCreating`, which enforces database rules (like preventing destructive cascading deletes to protect data integrity).

### `/Models`
These are the C# classes that represent exact tables in the SQLite database.
*   **`User.cs`**: Represents the `Users` table.
*   **`Pet.cs`**: Represents the `Pets` table. Contains Foreign Keys linking to the `User` (Owner).
*   **`AdoptionRequest.cs`, `Favorite.cs`, `Review.cs`, `Image.cs`**: Mapping tables that create relationships between Users and Pets.

### `/DTOs` (Data Transfer Objects)
DTOs are crucial for security and efficiency. Instead of sending raw Database Models (which might contain sensitive data like Password Hashes or cause infinite JSON loops), we send/receive DTOs.
*   **`/Adoption/AdoptionRequestDto.cs` & `AdoptionResponseDto.cs`**: Defines exactly what data an adopter sends to apply, and what formatted data the owner sees.
*   **`/PET/PetCreateDto.cs`, `PetUpdateDto.cs`, `PetResponseDto.cs`**: Defines the required fields to create/edit a pet, and formats the pet data (including flattening Review comments) to send to the frontend.
*   **`/Review/ReviewDto.cs`**: Data structure for submitting a rating and comment.

### `/Helpers`
*   **`JwtService.cs`**: Contains the cryptographic logic to sign and generate JSON Web Tokens using a secret key.
*   **`PasswordHelper.cs`**: Uses BCrypt to securely hash user passwords before saving them to the database, and compares hashes during login.

### `/Hubs`
*   **`NotificationHub.cs`**: The SignalR WebSocket hub. It acts as the pipeline that pushes real-time string messages from the backend directly to the frontend.

### Root Files
*   **`Program.cs`**: The entry point of the application. It configures Dependency Injection (registering services), sets up the SQLite database connection, configures JWT Authentication middleware, sets up CORS (allowing React to talk to the API), applies database migrations automatically on startup, and maps the API endpoints.
*   **`appsettings.json`**: Contains configuration variables, most notably the `ConnectionStrings` defining `Data Source=petadopt.db`.
*   **`petadopt.db`**: The physical SQLite database file holding all system data.

---

## 4. Frontend Folder & File Breakdown

The React frontend is located entirely within the `/frontend` directory.

### `/src/api`
*   **`axios.js`**: An Axios interceptor setup. It intercepts every outgoing HTTP request from the frontend and automatically attaches the user's JWT token (retrieved from `localStorage`) to the `Authorization` header. This ensures authenticated endpoints work seamlessly.

### `/src/context`
*   **`AuthContext.jsx`**: The core state manager for user sessions. It holds the `user` object and `token`. It provides global `login()` and `logout()` functions. Any component in the app can access `AuthContext` to check if a user is logged in and what their `role` is to restrict UI elements.

### `/src/components`
Reusable UI building blocks.
*   **`Navbar.jsx`**: The top navigation bar. It dynamically changes its links based on the `AuthContext` (e.g., showing "Dashboard" only to Owners, or "Admin Panel" only to Admins).
*   **`PetCard.jsx`**: A reusable card component used on the Home page to display a pet's image, name, breed, and a "View Details" button.
*   **`ProtectedRoute.jsx`**: A wrapper component used in routing. It intercepts navigation and checks if the user is logged in or has the correct role. If not, it redirects them to the login page.

### `/src/pages`
The distinct "screens" of the application.
*   **`Home.jsx`**: Fetches and displays all *Approved* pets. Allows users to filter/search for pets.
*   **`Login.jsx` & `Register.jsx`**: Forms for user authentication. They send data to `AuthController` and update `AuthContext` on success.
*   **`Dashboard.jsx`**: The dedicated screen for **Pet Owners**. It displays a table of their posted pets, allows them to Edit/Delete pets, and displays a list of incoming pending Adoption Requests with Approve/Reject buttons.
*   **`AdminDashboard.jsx`**: The dedicated screen for **Admins**. Displays pending User accounts and pending Pet posts requiring approval.
*   **`CreatePet.jsx`**: A form using `FormData` to handle text inputs alongside Image File uploads, sending them to the backend to create a pet.
*   **`PetDetails.jsx`**: The expanded view of a single pet. Contains the "Apply for Adoption" form and the "Add to Favorites" button.
*   **`Favorites.jsx`**: Displays a list of pets the Adopter has saved.
*   **`AdoptedPets.jsx`**: Displays a list of pets the Adopter has successfully adopted. It also contains the UI allowing the Adopter to submit a Rating and Review for the pet.

### Root Frontend Files
*   **`App.jsx`**: The main React component that sets up React Router. It defines all the URL paths (`/`, `/login`, `/dashboard`) and maps them to their respective Page components. Crucially, it also initiates the **SignalR connection** here, listening globally for `"ReceiveNotification"` and firing a `toast` popup.
*   **`main.jsx`**: The React entry point that injects `App.jsx` into the HTML DOM.
*   **`vite.config.js`**: Configuration file for the Vite build engine.
*   **`package.json`**: Lists all installed NPM libraries (React, Axios, SignalR, Bootstrap, etc.) and contains the `npm run dev` script.

---

## 5. Feature Workflows Explained

### A. Authentication & Security Workflow
1. User submits details on `Register.jsx`.
2. Backend hashes password via `PasswordHelper` and saves to SQLite. If they register as a PetOwner, `IsApproved` is set to `false`.
3. Admin approves the user via `AdminDashboard.jsx`.
4. User logs in. `AuthService.cs` verifies the hash and generates a JWT string containing their ID and Role.
5. React receives the token, saves it to `localStorage`, and updates `AuthContext`.
6. For all future requests, `axios.js` attaches the token. ASP.NET Core automatically decrypts it and enforces security via the `[Authorize(Roles="...")]` attributes on controllers.

### B. Pet Creation & Image Upload Workflow
1. Owner fills out `CreatePet.jsx` and selects an image. Data is appended to a `FormData` object.
2. `PetController.Create()` receives the multi-part form data. It generates a unique `Guid` file name and saves the physical image file to the `/wwwroot/uploads/` directory.
3. The string URL path to that image is saved into the database row for the new Pet.
4. The Pet is marked as "Pending" until an Admin approves it.

### C. The Adoption & Review Workflow
1. Adopter views `PetDetails.jsx` and submits an application message.
2. The Request is saved as "Pending" in the DB.
3. The Owner sees the request in `Dashboard.jsx`.
4. When the Owner clicks "Approve", `AdoptionService.Approve()` changes the request status to "Approved" AND automatically updates the Pet's status to "Adopted".
5. Because the Pet is "Adopted", it disappears from the public Home page.
6. The Adopter can now see the pet in their `AdoptedPets.jsx` view. Because the status is "Adopted", the UI unlocks the "Leave a Review" form.
7. The Adopter submits a review, which is mapped back to the Owner's `Dashboard.jsx` alongside the pet.

### D. Real-Time SignalR Workflow
1. When `App.jsx` loads in the browser, it builds a WebSocket tunnel to `https://localhost:XXXX/notificationHub`.
2. An Adopter applies for a pet -> Backend processes the database insertion -> Backend executes `_hub.Clients.All.SendAsync("ReceiveNotification", "New request!")`.
3. The signal travels near-instantly through the WebSocket to all connected React clients.
4. `App.jsx` catches the signal via `.on("ReceiveNotification")` and triggers `toast.info()`, resulting in a popup on the screen.

---

## 6. Missing / Additional File & Folder Documentation

### Root-Level Files (Previously Undocumented)

*   **`.gitignore`**: Tells Git which files and folders to ignore and never commit. It excludes `bin/`, `obj/` (build outputs), `petadopt.db` (runtime database), `wwwroot/uploads/` (user-uploaded images), and `frontend/node_modules/`. Without this file, compiled binaries and runtime data would pollute the repository.
*   **`README.md`**: A short public-facing description of the project shown on the GitHub repository homepage. Contains a brief summary of the platform and its purpose.
*   **`schema.sql`**: A manually exported SQL script that represents the full database schema in plain SQL. It includes `CREATE TABLE` statements for all 6 tables (`Users`, `Pets`, `AdoptionRequests`, `Favorites`, `Images`, `Reviews`) with all their columns, constraints, and foreign keys. It also includes the `CREATE INDEX` statements for performance and the EF Core migration history entry. This file is for documentation and portability — it lets anyone understand or recreate the database structure without running the .NET application.
*   **`package-lock.json`** *(root)*: An auto-generated file by npm that locks the exact version of every dependency in the root-level Node environment (if any). In this project it is largely a leftover artifact and the real frontend dependencies are managed by `frontend/package-lock.json`.

### `/Properties` Folder

*   **`launchSettings.json`**: Configures how Visual Studio and the `dotnet run` command start the application locally. It defines two profiles:
    *   **`https`**: Starts the API on `https://localhost:7207` and `http://localhost:5158` with HTTPS redirect enabled. This is the profile used in development.
    *   **`http`**: Starts the API on `http://localhost:5158` only (no HTTPS). The environment variable `ASPNETCORE_ENVIRONMENT` is set to `Development` in both profiles, which enables Swagger UI.

### `/PetAdopt.csproj`

The project file that defines the entire .NET backend project. It specifies:
*   **Target Framework**: `net8.0` — the application runs on .NET 8.
*   **NuGet Package Dependencies**:
    *   `Microsoft.AspNetCore.Authentication.JwtBearer` — JWT middleware for validating tokens.
    *   `Microsoft.EntityFrameworkCore.Sqlite` — SQLite database driver for EF Core.
    *   `Microsoft.EntityFrameworkCore.Design` & `Tools` — enable running `dotnet ef migrations` commands from the terminal.
    *   `Microsoft.EntityFrameworkCore.InMemory` — an in-memory database provider (used for testing purposes).
    *   `Swashbuckle.AspNetCore` — generates the Swagger/OpenAPI documentation UI.
    *   `System.IdentityModel.Tokens.Jwt` — provides the JWT token reading/writing classes used by `JwtService.cs`.

### `/DTOs` — Complete Breakdown

The DTOs folder contains 5 subfolders, one per feature domain:

**`/DTOs/Auth/`**
*   **`RegisterDto.cs`**: The data shape accepted when a user registers. Contains `Name`, `Email`, `Password`, and `Role` fields.
*   **`LoginDto.cs`**: Contains `Email` and `Password` — the minimum needed to authenticate.
*   **`AuthResponseDto.cs`**: What the backend sends back after a successful login or register. Contains `Email`, `Role`, and the `Token` (JWT string).

**`/DTOs/Adoption/`**
*   **`AdoptionRequestDto.cs`**: Data sent by an Adopter when applying. Contains `PetId` and `Message` (their experience/history text).
*   **`AdoptionResponseDto.cs`**: Formatted adoption data sent to the Owner's dashboard. Contains `Id`, `PetId`, `PetName`, `AdopterId`, `AdopterName`, `AdopterEmail`, `Message`, and `Status`.

**`/DTOs/PET/`**
*   **`PetCreateDto.cs`**: Data sent when creating a pet post. Contains all pet fields (`Name`, `Age`, `Type`, `Breed`, `Gender`, `HealthStatus`, `Location`, `Description`) plus an `Image` field (`IFormFile`) for the uploaded photo.
*   **`PetUpdateDto.cs`**: Same fields as Create but includes `Id` to identify which pet to update. Does not include an image field (image changes are not supported on edit).
*   **`PetResponseDto.cs`**: The standardized pet data shape returned to the frontend. Includes all pet fields, `OwnerName` (flattened from the related User), and the first `ReviewRating` and `ReviewComment` attached to the pet.

**`/DTOs/Review/`**
*   **`ReviewDto.cs`**: Contains `PetId`, `Rating` (integer), and `Comment` (string) — what an Adopter submits when leaving feedback.

**`/DTOs/Favourite/`**
*   **`FavoriteDto.cs`**: Contains only `PetId` — the minimal data needed to add a pet to a user's favorites list.

### `/wwwroot/uploads/`

The `wwwroot` folder is the only publicly accessible directory in ASP.NET Core. The `uploads/` subfolder inside it is where all pet images uploaded by Pet Owners are physically saved on disk. When an Owner uploads a photo via `CreatePet.jsx`, `PetController.cs` generates a unique `Guid`-based filename (e.g., `3808ac71-ba96-4958-a0e8-18a29c86fb03.jpg`), saves the file here, and stores the relative URL path `/uploads/{filename}` in the database. When `PetService.MapToDto()` builds the response, it prepends `https://localhost:7207` to this path so the frontend can display the image directly via an `<img>` tag.

---

## 7. Frontend — Additional Files (Previously Undocumented)

### `/src/context/SignalRContext.jsx`

This is one of the most important frontend files, responsible for the entire real-time communication layer. It was **not previously documented**.

*   **What it does**: Creates a React Context that wraps the SignalR WebSocket connection and exposes a `subscribe(eventName, callback)` function to any component in the app.
*   **How it works**:
    1.  On mount, it creates a new `HubConnectionBuilder` connection to `https://localhost:7207/notificationHub` with `withAutomaticReconnect()` enabled.
    2.  It pre-registers listeners for all 6 known server events: `PetPending`, `PetApproved`, `PetRejected`, `NewAdoptionRequest`, `AdoptionStatusChanged`, and `ReceiveNotification`.
    3.  When any of these events fire from the server, it looks up which components have subscribed to that event (stored in `listenersRef`) and calls their callbacks.
    4.  The `subscribe()` function returns an **unsubscribe** function, which components call on cleanup to prevent memory leaks.
*   **Why a Context**: Centralizing the connection in a Context means only **one** WebSocket connection is ever created, no matter how many components need real-time updates. Without this, each component would open its own connection.
*   **Used by**: `App.jsx` (subscribes to `ReceiveNotification` for toast popups) and `Dashboard.jsx` / `AdminDashboard.jsx` (subscribe to specific events to auto-refresh data).

### `/src/routes/ProtectedRoute.jsx`

*   **Correct Location**: This file lives in `/src/routes/`, not `/src/components/` as previously stated.
*   **What it does**: A wrapper component used in `App.jsx` around any page that requires the user to be logged in. It reads the `user` object from `AuthContext`. If `user` is `null` (not logged in), it immediately redirects the browser to `/login`. If the user is logged in, it renders the wrapped child page normally.

### `/src/services/` *(empty folder)*

This folder was created as a placeholder for future **API service modules** — JavaScript files that would group all Axios API calls by feature (e.g., `petService.js`, `authService.js`). Currently, API calls are made directly inside page components. This folder represents a planned but not yet implemented separation of concerns.

### `/src/socket/` *(empty folder)*

Created as a placeholder for a standalone SignalR connection module. This functionality was instead implemented inside `SignalRContext.jsx`, so this folder remains empty.

### `/src/index.css`

A minimal global CSS file loaded by `main.jsx`. Contains base body styling (font family, margin resets). Most of the UI styling comes from **Bootstrap 5**, which is imported inside `main.jsx` directly from `node_modules`.

### `frontend/index.html`

The single HTML file that serves as the shell for the entire React SPA. It contains a `<div id="root"></div>` which is the mount point where React injects the entire application, and a `<script>` tag pointing to `/src/main.jsx` as the JavaScript entry point. Vite processes this file during build.

### `frontend/public/` *(folder)*

A folder for static assets that Vite copies directly to the build output without processing them. Commonly used for favicons, `robots.txt`, or other files that need a fixed URL. Currently empty in this project.

### `frontend/dist/` *(folder)*

The production build output folder generated by running `npm run build`. Vite compiles, bundles, and minifies all React source code into optimized static HTML, CSS, and JavaScript files here. This folder is excluded from Git via `.gitignore`.

### `frontend/.gitignore`

A frontend-specific `.gitignore` that excludes `node_modules/` from being committed. The `node_modules/` folder can contain tens of thousands of files and is always re-generated by running `npm install`, so it must never be committed to the repository.

### `frontend/README.txt`

A plain text file with basic notes about the frontend project setup and how to run it locally (`npm install` then `npm run dev`).

### `frontend/vite.config.js`

Configuration file for the Vite build tool. Currently minimal — it registers the `@vitejs/plugin-react` plugin, which enables Vite to understand and transform `.jsx` syntax and React Fast Refresh (hot-reloading during development).

---

## 8. Database Design

### Overview

The database is a **SQLite** file (`petadopt.db`) managed entirely by **Entity Framework Core**. SQLite was chosen for simplicity — it requires no separate server installation and stores all data in a single file. EF Core acts as the bridge between C# objects and database rows.

### Tables

| Table | Purpose |
|---|---|
| `Users` | Stores all users regardless of role |
| `Pets` | Stores all pet listings |
| `AdoptionRequests` | Stores adoption applications from Adopters to Owners |
| `Favorites` | Junction table linking Users to their saved Pets |
| `Images` | Stores extra image URLs linked to a Pet |
| `Reviews` | Stores ratings and comments from Adopters on adopted Pets |

### Column Details

**`Users`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK, Identity) | Auto-incremented unique ID |
| `Name` | nvarchar | Display name |
| `Email` | nvarchar | Unique login email |
| `PasswordHash` | nvarchar | SHA-256 hashed password |
| `Role` | nvarchar | `"Admin"`, `"PetOwner"`, or `"Adopter"` |
| `IsApproved` | bit | `false` by default; Admin sets to `true` to activate account |

**`Pets`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK) | Auto-incremented unique ID |
| `Name` | nvarchar | Pet's name |
| `Age` | int | Age in years |
| `Type` | nvarchar | Animal type (Dog, Cat, etc.) |
| `Breed` | nvarchar | Specific breed |
| `Gender` | nvarchar | Male / Female |
| `HealthStatus` | nvarchar | Vaccinated, Healthy, etc. |
| `Location` | nvarchar | City or area |
| `Description` | nvarchar | Free-text description |
| `ImageUrl` | nvarchar | Relative path to uploaded image in `wwwroot/uploads/` |
| `Status` | nvarchar | `"Pending"` → `"Approved"` / `"Rejected"` → `"Adopted"` |
| `OwnerId` | int (FK → Users) | The owner who listed this pet |

**`AdoptionRequests`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK) | Auto-incremented unique ID |
| `Message` | nvarchar | Adopter's personal history / experience message |
| `Status` | nvarchar | `"Pending"`, `"Approved"`, or `"Rejected"` |
| `PetId` | int (FK → Pets) | Which pet is being applied for |
| `AdopterId` | int (FK → Users) | Which user submitted the request |

**`Favorites`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK) | Auto-incremented unique ID |
| `UserId` | int (FK → Users) | The Adopter who saved the pet |
| `PetId` | int (FK → Pets) | The pet that was saved |

**`Images`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK) | Auto-incremented unique ID |
| `Url` | nvarchar | Full URL to the image |
| `PetId` | int (FK → Pets) | The pet this image belongs to |

**`Reviews`**
| Column | Type | Description |
|---|---|---|
| `Id` | int (PK) | Auto-incremented unique ID |
| `Rating` | int | Numeric score (e.g., 1–5) |
| `Comment` | nvarchar | Written feedback text |
| `UserId` | int (FK → Users) | Adopter who wrote the review |
| `PetId` | int (FK → Pets) | Pet being reviewed |

### Relationships

| Relationship | Type | On Delete |
|---|---|---|
| Users → Pets | One-to-Many (one owner, many pets) | Restrict |
| Users → AdoptionRequests | One-to-Many (one adopter, many requests) | Restrict |
| Users → Favorites | One-to-Many | Restrict |
| Users → Reviews | One-to-Many | Restrict |
| Pets → AdoptionRequests | One-to-Many (one pet, many applications) | Restrict |
| Pets → Favorites | One-to-Many | Restrict |
| Pets → Images | One-to-Many (one pet, multiple photos) | Restrict |
| Pets → Reviews | One-to-Many | Restrict |

> **Note on Delete Behavior**: The `AppDbContext.cs` explicitly sets all relationships to `DeleteBehavior.Restrict`. This means the database will **prevent** deleting a User or Pet if it still has related records, protecting data integrity and preventing accidental cascading deletions.

### Admin Seeding

On every application startup, `Program.cs` checks if any `Admin` user exists. If not, it automatically creates one with:
- **Email**: `admin@petadopt.com`
- **Password**: `Admin123`
- **IsApproved**: `true`

This ensures the system always has at least one administrator to approve new accounts and pet posts.

---

## 9. Requirements Implementation Mapping

This section maps every official project requirement to the exact files responsible for implementing it.

| # | Requirement | Implementation |
|---|---|---|
| 1 | **Different actors can log in / log out** | `Login.jsx` sends credentials to `POST /api/auth/login`. `AuthService.Login()` verifies password hash and returns a JWT. `AuthContext.jsx` stores the token in `sessionStorage` and exposes a `logout()` function that clears it. Navbar shows/hides links based on role. |
| 2 | **Adopter can browse pets without logging in** | `GET /api/pet` in `PetController` has **no** `[Authorize]` attribute. `Home.jsx` calls this endpoint freely. |
| 3 | **Adopter cannot apply without logging in** | `POST /api/adopation/apply` has `[Authorize(Roles = "Adopter")]`. If no JWT is present, the API returns `401 Unauthorized`. `PetDetails.jsx` also hides the Apply button if `user` is null in `AuthContext`. |
| 4 | **Admin manages (approve/reject) new accounts** | `GET /api/auth/pending` and `POST /api/auth/approve` & `/reject` — all `[Authorize(Roles="Admin")]`. `AuthService.ApproveUser()` sets `IsApproved=true`. `AuthService.RejectUser()` deletes the record. `AdminDashboard.jsx` displays and acts on pending users. |
| 5 | **Admin approves/rejects pet posts** | `GET /api/pet/pending`, `POST /api/pet/approve`, `POST /api/pet/reject` — all `[Authorize(Roles="Admin")]`. `PetService.ApprovePet()` / `RejectPet()` updates `Status`. `AdminDashboard.jsx` displays pending pets with Approve/Reject buttons. |
| 6 | **Adopters can browse and search pets by type, age, breed, location** | `Home.jsx` fetches all approved pets and filters them client-side using React state (search inputs for type, breed, location, and age range). |
| 7 | **Pet post includes Owner Name, Pet Name, Age, Breed, Gender, Health Status, Description, Location, Images** | `PetResponseDto.cs` contains all these fields including `OwnerName` (flattened from the `User` navigation property). `PetCard.jsx` and `PetDetails.jsx` display them on the frontend. |
| 8 | **Adopters can submit adoption requests** | `POST /api/adopation/apply` receives `AdoptionRequestDto` (containing `PetId` and `Message`). `AdoptionService.Apply()` validates the pet is `"Approved"` and the user hasn't already applied, then creates the record. `PetDetails.jsx` provides the apply form. |
| 9 | **Adopters can include history/experience in their request** | The `Message` field in `AdoptionRequestDto` and the `AdoptionRequest` model serves this purpose. The adopter writes their history (past pets, vet references, experience) in this text field. |
| 10 | **Pet Owners can accept/reject adoption requests** | `POST /api/adopation/approve` and `/reject` with `[Authorize(Roles="Admin,PetOwner")]`. `AdoptionService.Approve()` / `Reject()` updates request status. `Dashboard.jsx` shows incoming requests with Approve/Reject buttons. |
| 11 | **Once accepted, pet status changes to Adopted** | Inside `AdoptionService.Approve()`: `request.Status = "Approved"` AND `request.Pet.Status = "Adopted"` — both saved atomically. The pet then disappears from `Home.jsx` (which only shows `"Approved"` status pets). |
| 12 | **Adopters can save pets to a favorites list** | `POST /api/favorite` (adds) and `GET /api/favorite` (retrieves). `FavoriteService` checks for duplicates before adding. `PetDetails.jsx` has the "Add to Favorites" button; `Favorites.jsx` displays the saved list. |
| 13 | **Users who adopt can submit reviews** | `POST /api/review` with `[Authorize]`. `ReviewService.Add()` first verifies the user has an **Approved** adoption request for that specific pet. If so, it adds or updates their review. `AdoptedPets.jsx` shows the review form only for adopted pets. |
| 14 | **Shelter/Pet Owner manages pet posts (CRUD)** | **Create**: `POST /api/pet` with `[FromForm]` for image upload. **Read**: `GET /api/pet/mypets`. **Update**: `PUT /api/pet` via `PetUpdateDto`. **Delete**: `DELETE /api/pet/{id}`. All require `[Authorize(Roles="PetOwner")]`. `Dashboard.jsx` and `CreatePet.jsx` provide the UI. |
| 15 | **Real-time sockets** | `NotificationHub.cs` is the SignalR hub. `Program.cs` maps it to `/notificationHub`. Every key action (new adoption request, approval, pet submission) calls `_hub.Clients.All.SendAsync(...)`. Frontend `SignalRContext.jsx` manages the persistent WebSocket connection and routes events to subscriber components via a pub/sub pattern. |
| 16 | **DB Design (Schema) is required** | `schema.sql` contains the full exported SQL schema. `Migrations/` contains the EF Core migration files. See Section 8 of this document for complete table and column documentation. |
