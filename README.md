## How to use (CLI)

1. `npm install`
2. rename `src/engine/creds-template.js` to `src/engine/creds.js` and edit it with your NETHZ credentials
3. `npm run build`
4. go on the ASVZ webpage to get the id of the lesson you want to register for (in the URL)
5. run `node dist/engine/asvz-registration.js <lesson>` to schedule the registration of the lesson with id `<lesson>`, for example `node dist/engine/asvz-registration.js 13411`

You can also test the registration process with `node dist/engine/asvz-registration.js <lesson> now`.

## How to use (web app)
IN CONSTRUCTION

## References
- https://developer.okta.com/blog/2018/11/15/node-express-typescript
