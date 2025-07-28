# Gamech

## 🖥️ Frontend Client Setup Guide

This guide provides clear steps for teammates to **set up, run, and deploy** the client application.

## 1. Clone or Pull the Repository

If you haven't cloned the repository yet, do:

```
git clone https://github.com/Alejandrocsdev/Uniclubs-Client.git
```

or if the Git repository was already created locally, you can pull the latest changes:

```
git pull
```

## 2. Install Dependencies

In the frontend project directory, run:

```
npm install
```

## 3. Create `.env` File

Create a `.env` file in the root of the frontend directory. Use the provided data for the contents. You need to configure the following variables:

`PORT` — The server port for development

`VITE_SERVER_PORT` — Your frontend Vite server port for development

## 4. Running the frontend Server

Start the frontend project with:

```
npm run start
```

For development with hot reloading:

```
npm run dev
```

To send requests to server running on a Wi-Fi IP (must set `VITE_WIFI_URL` in .env):

```
npm run dev:wifi
```

## 5. Deployment to Vercel

Every time you push to the `main` branch, the frontend server will be automatically deployed to `Vercel` via Vercel’s built-in Git integration.
