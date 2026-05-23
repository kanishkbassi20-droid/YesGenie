# YesGenie (Firebase Hosting)

## 1) Set your Firebase project

This repo is configured to deploy to the Firebase project id `yesgenie-c3d52` via `.firebaserc`.

To switch projects (optional):
- `firebase use --add`

## 2) Deploy

Install Firebase CLI (if you don’t have it):
- `npm i -g firebase-tools`

Login and deploy:
- `firebase login`
- `firebase deploy --only hosting`

## Local preview

- `firebase emulators:start --only hosting`
