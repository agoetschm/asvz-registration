# How to use

1. `npm install`
2. rename `creds-template.js` to `creds.js` and edit it with your NETHZ credentials
3. go on the ASVZ webpage to get the id of the lesson you want to register for (in the URL)
4. run `node asvz-registration.js <date> <lesson>` to schedule the registration of the lesson with id `<lesson>` at `<date>`, for example `node asvz-registration.js 13411 2019-01-27T20:55:00`

### Note
I had to replace `page.click('<selector>')` with `await page.evaluate(() => { document.querySelector('<selector>').click() })`, I don't know why the first one wasn't working on Raspbian.
