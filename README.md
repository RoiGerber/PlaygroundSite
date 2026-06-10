# Playground Marketing Site

Static marketing website for **Playground: Swipe & Play**.

## Local preview

Run any static file server from this directory:

```powershell
npm run dev
```

Then open `http://localhost:4173`.

The development server listens on all network interfaces by default. Other
devices can use the LAN or Tailscale URL printed in the terminal, provided
Windows Firewall allows inbound TCP traffic on port `4173`.

To override the listening address:

```powershell
npm run dev -- --host 127.0.0.1
```

## Deploy to Vercel

Import this folder as a new Vercel project. No build command or output
directory is required because the site is fully static.
