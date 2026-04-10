# SkillSwap 🤝

SkillSwap is a peer-to-peer skill exchange platform that connects people who want to learn new skills with those who can teach them. "Exchange skills, grow together."

## 🚀 Features

### Core Functionality
-   **User Authentication**: Secure Login & Signup using JWT.
-   **Dashboard**: Central hub to manage skills, requests, and messages.
-   **Browse Skills**: Explore skills offered by other users with category filtering and search.
-   **Offer a Skill**: List your own skills (e.g., Coding, Music, Cooking) for others to find.
-   **Exchange Requests**: Request to learn a skill from a specific tutor.

### 🌟 Premium Features
-   **Trust System (Reviews)**: User profiles feature a 5-star rating system and reviews to build trust.
-   **Real-time Notifications**: Navbar "Bell" icon updates instantly for new requests and status changes.
-   **Messaging System**: Built-in chat interface to coordinate exchange sessions.
-   **Smart Profile**: 
    -   View "My Skills" and "My Requests" in tabs.
    -   See your "Average Rating" and reviews from others.
    -   Edit profile (Avatar, Bio).

### 🛠 Support & improved UX
-   **Help Center**: Dedicated Help page and pop-up modal with Blog posts and FAQs.
-   **Robust Error Handling**: Friendly 404 Pages and Global Error Boundaries (no white screen of death!).
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS.

## 💻 Tech Stack

**Frontend:**
-   React.js (Vite)
-   Tailwind CSS (Styling)
-   React Router DOM (Routing)
-   Lucide React / SVGs (Icons)

**Backend:**
-   Node.js & Express.js
-   MongoDB (Database)
-   Mongoose (ORM)
-   JWT (Authentication)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/skillswap.git
    cd skillswap
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    -   Create a `.env` file in `/backend` with:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PORT=5000
        ```
    -   Start the server:
        ```bash
        node server.js
        ```

3.  **Frontend Setup**
    ```bash
    cd ..  # Go back to root
    npm install
    ```
    -   Start the development server:
        ```bash
        npm run dev
        ```

4.  **Open in Browser**
    -   Visit `http://localhost:5173` to verify the app is running.

## 📂 Project Structure

```
skillswap/
├── backend/            # Express Server & Database Models
│   ├── models/         # User, Skill, Request, Notification, Review
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry point
├── src/                # React Frontend
│   ├── components/     # Reusable UI (Navbar, Cards, Modals)
│   ├── pages/          # Full Pages (Help, NotFound)
│   ├── App.jsx         # Layout
│   └── main.jsx        # Routing & Entry
└── ...config files
```

## 🔮 Future Roadmap

-   **Video Integration**: Native video calls for remote sessions.
-   **Calendar Sync**: Schedule sessions directly in the app.
-   **Gamification**: Earn badges for teaching and learning.

---

Made with ❤️ by the SkillSwap Team.
