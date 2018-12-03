const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const date = new Date(process.argv[2]);
const lesson_number = process.argv[3];

const job = schedule.scheduleJob(date, function(fireDate){
  console.log('Registering at ' + new Date() + " ...");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://schalter.asvz.ch/tn/lessons/' + lesson_number);
    await page.click('body > app-root > div > div:nth-child(2) > app-lesson-details > div > div > app-lessons-enrollment-button > button');

    await page.waitForNavigation();
    await page.click('#switch-aai > div.panel-body > div > form > div > p > button');

    await page.waitFor(500);
    await page.click('#userIdPSelection_iddwrap');
    await page.click('#userIdPSelection_iddlist > div:nth-child(5)');

    await page.waitFor(500);
    const CREDS = require('./creds');
    await page.click('#username');
    await page.keyboard.type(CREDS.username);
    await page.click('#password');
    await page.keyboard.type(CREDS.password);
    await page.click('#LoginButtonText');

    await page.waitForSelector('#btnRegister');
    await page.click('#btnRegister');

    console.log("Registration done.")

    await browser.close();
  })();
});

console.log('Automatic registration for lesson ' + lesson_number + ' scheduled at ' + job.nextInvocation())
