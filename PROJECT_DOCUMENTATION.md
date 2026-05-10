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
