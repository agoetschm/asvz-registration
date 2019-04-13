# How to use

1. `npm install`
2. rename `src/creds-template.js` to `src/creds.js` and edit it with your NETHZ credentials
3. compile Typescript with `tsc`
4. go on the ASVZ webpage to get the id of the lesson you want to register for (in the URL)
5. run `node built/asvz-registration.js <lesson>` to schedule the registration of the lesson with id `<lesson>`, for example `node built/asvz-registration.js 13411`

You can also test the registration process with `node built/asvz-registration.js <lesson> now`.
