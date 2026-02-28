# wallaby
Wallaby is an AI-powered web application that helps you make smarter food choices instantly. Simply scan any food item's ingredients list, and our AI analyzes it against your personal dietary needs, allergies, and health goals.

## Run locally

Install dependencies:

```bash
npm install
```

Start a local server from the `public` folder:

```bash
python3 -m http.server 5500 --directory public
```

Open:

```text
http://localhost:5500
```

Do not use `file://` for Firebase auth.

## Auth setup

Google login and email/password auth use Firebase.

Make sure in Firebase Console:

- Email/Password is enabled
- Google provider is enabled
- `localhost` is added to Authorized Domains

## Push to GitHub

Commit these:

- `public/`
- `img/`
- `README.md`
- `package.json`
- `package-lock.json`

Do not commit:

- `node_modules/`
