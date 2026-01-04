


<img width="1657" height="811" alt="image" src="https://github.com/user-attachments/assets/ec607088-76a8-481a-9107-17b3a441d1e9" />


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- 🚀 Future Feature Roadmap for SkillSwap
You have a solid foundation (Auth, Dashboard, Profiles, Messaging). Here are the most high-impact features you can add next to take the app to the next level.

1. 🌟 Raring & Reviews (Trust System)
Why? Users need to trust who they are learning from.

Feature: Allow users to leave a 1-5 star rating and comment after a session.
Implementation: New Review model linked to User. Display "Average Rating" on Profile cards.
2. 🔔 Real-time Notifications
Why? Users shouldn't have to refresh to see new messages or requests.

Feature: A bell icon in the Navbar that lights up when you get a request or message.
Implementation:
Simple: Polling every 30s.
Advanced: Socket.io for instant updates.
New Notification model to store history.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
