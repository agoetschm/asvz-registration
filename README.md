## How to use (CLI)

1. `npm install`
2. `npm run build`
3. go on the ASVZ webpage to get the id of the lesson you want to register for (in the URL)
4. run `node dist/engine/asvz-registration.js <lesson> <user> <password>` to schedule the registration of the lesson with id `<lesson>` for NETHZ user `<user>`, for example `node dist/engine/asvz-registration.js 13411 sjohn pwd123`

You can also test the registration process with `node dist/engine/asvz-registration.js now <lesson> <user> <password>`.

## How to use (web app)
IN CONSTRUCTION

## References
- https://developer.okta.com/blog/2018/11/15/node-express-typescript
