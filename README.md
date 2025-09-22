# Pixel Rift: Anomaly Echo 👾

Welcome to the frontend repository for **Pixel Rift: Anomaly Echo**, a cyberpunk-themed Capture The Flag (CTF) platform. This project provides an immersive, gamified interface for users to navigate fractured digital realms, solve hacking challenges, and compete against other teams.

> Navigate through corrupted zones, decode digital mysteries, and restore the fractured system before it's too late.

![Pixel Rift Landing Page](https://lovable.dev/opengraph-image-p98pqg.png)
*(Image from `index.html` OpenGraph tags - consider replacing with an updated screenshot or GIF of the application in action.)*

## ✨ Key Features

-   **Immersive Cyberpunk Theme:** Animated backgrounds, scan lines, glitch text effects, and a futuristic UI create a deeply engaging atmosphere.
-   **Component-Driven Architecture:** Built with React and TypeScript, featuring a library of reusable components (Cards, Buttons, Inputs) styled with Tailwind CSS, based on the principles of Shadcn/ui.
-   **Fluid Animations:** Rich, meaningful animations and page transitions powered by Framer Motion to enhance user experience.
-   **Team-Based Authentication:** A secure login page for teams to access the CTF event.
-   **Gamified Challenge Structure:** Challenges are organized into thematic "Zones" (e.g., "Boot Sector", "Corrupted Forest"), each with its own set of "Anomalies" to solve.
-   **Responsive Design:** A fully responsive layout that works seamlessly on desktops, tablets, and mobile devices.
-   **Centralized State Management:** Global authentication state is managed cleanly using React's Context API.

## 🛠️ Built With

This project is built with a modern frontend stack designed for performance and developer experience:

-   **React** - A JavaScript library for building user interfaces.
-   **TypeScript** - For static type-checking and improved code quality.
-   **Vite** - Next-generation frontend tooling for a blazing-fast development experience.
-   **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
-   **Framer Motion** - A production-ready motion library for React.
-   **React Router** - For declarative routing in React applications.
-   **Shadcn/ui** - A set of re-usable components built using Radix UI and Tailwind CSS.
-   **Lucide React** - A beautiful and consistent icon toolkit.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and a package manager (npm, yarn, or pnpm) installed on your machine.

-   Node.js (v18.x or later recommended)
-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/pixel-rift-ui.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd pixel-rift-ui
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command. The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

```sh
npm run dev
```

## 📂 Project Structure

The project follows a standard React application structure, organizing files by feature and type for clarity and maintainability.

```
src/
├── components/
│   ├── ui/         # Reusable UI components from Shadcn/ui (Button, Card, etc.)
│   ├── ChallengeCard.tsx
│   └── GlitchText.tsx
├── contexts/
│   └── AuthContext.tsx # Manages authentication state and logic
├── data/
│   └── mockData.ts   # Mock data for teams, challenges, and zones
├── hooks/
│   └── use-toast.ts  # Custom hook for displaying notifications
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   └── ChallengeView.tsx
├── App.tsx           # Main application component with routing
└── main.tsx          # Application entry point
```

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode with hot-reloading.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run lint`: Lints the project files using ESLint to enforce code quality.
-   `npm run preview`: Serves the production build locally to preview before deployment.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE.md` for more information.

---

**Project Link:** https://github.com/your-username/pixel-rift-ui