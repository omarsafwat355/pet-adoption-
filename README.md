# PetAdopt Full Stack Application

This is a complete full-stack Pet Adoption application featuring:
- **Backend**: ASP.NET Core Web API
- **Frontend**: React.js with Vite
- **Database**: SQLite (Stored locally as `petadopt.db`)

## 🚀 How to Run the Project

### 1. Start the Backend
1. Open a terminal in the root folder (`pet-adoption-repo`).
2. Run the command:
   ```bash
   dotnet run
   ```
3. The server will start and automatically connect to the `petadopt.db` SQLite database.

### 2. Start the Frontend
1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Run the command:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173/` or `http://localhost:5174/`.

## 🗄️ Database Setup (SQLite)
The application uses **SQLite**, making it extremely portable. 
You do **not** need SQL Server installed on your device.

The entire database is contained within a single file: `petadopt.db` located in the root of the project.

### How to View the Database
You can easily view and manage all the data (Users, Pets, AdoptionRequests, etc.) directly in your code editor or using a free tool:

**Option 1: Using VS Code**
1. Install the extension **SQLite Viewer** (by Florian Klampfer) or **SQLite** (by alexcvzz).
2. Right-click on the `petadopt.db` file in the file explorer.
3. Click "Open Database" or "Open with SQLite Viewer" to see the tables.

**Option 2: Using DB Browser for SQLite**
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/dl/).
2. Open the application and click **Open Database**.
3. Select the `petadopt.db` file from the project folder.
4. Go to the **Browse Data** tab to view and edit all records.

## 📝 Default Accounts
Upon the first run, the system automatically seeds an **Admin** account into the database:
- **Email:** `admin@petadopt.com`
- **Password:** `Admin123`
