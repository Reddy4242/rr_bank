# RR Bank deployment

RR Bank uses one deployed Node service:

- Express serves the API and the built React application.
- Turso stores the persistent SQLite-compatible data.
- Render runs the service and supplies its public URL.

## Required Render environment variables

Add these variables in Render. Never commit their real values to GitHub.

```text
NODE_ENV=production
TURSO_DATABASE_URL=libsql://your-database-name-your-username.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

## Deployment order

1. Create a free Turso database and copy its database URL and auth token.
2. Push this repository to GitHub.
3. In Render, create a Blueprint from the GitHub repository.
4. Enter the two Turso values when Render requests them.
5. Wait for the build and open the Render URL.
6. Create an RR Bank account and test adding a transaction.

Render reads `render.yaml`, runs `npm run build`, starts Express with `npm start`,
and checks `/api/health`. The React routes are served by Express in production,
so links such as `/signin`, `/dashboard`, and `/transactions` work after refresh.

## Local development

Run the backend:

```powershell
cd server
npm install
npm run dev
```

In a second terminal, run the React client:

```powershell
cd client
npm install
npm run dev
```

Without Turso environment variables, the backend automatically uses
`server/data/rr-bank.db` on the local computer.
