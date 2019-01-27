const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const lesson_number = process.argv[2];

const task = function(fireDate){
  console.log('Registering at ' + new Date() + " ...");
  (async () => {
    const browser = await puppeteer.launch();
    // const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
    const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(60000);

    await page.goto('https://schalter.asvz.ch/tn/lessons/' + lesson_number);
    console.log("Reached ASVZ page")
    await page.evaluate(() => { document.querySelector('body > app-root > div > div:nth-child(2) > app-lesson-details > div > div > app-lessons-enrollment-button > button').click(); });

    await page.waitForNavigation();
    await page.evaluate(() => { document.querySelector('#switch-aai > div.panel-body > div > form > div > p > button').click(); });

    await page.waitForNavigation();
    await page.evaluate(() => { document.querySelector('#userIdPSelection_iddwrap').click(); });
    await page.evaluate(() => { document.querySelector('#userIdPSelection_iddlist > div:nth-child(5)').click(); });

    await page.waitForNavigation();
    console.log("Reached login page")
    const CREDS = require('./creds');
    await page.focus('#username');
    await page.keyboard.type(CREDS.username);
    await page.focus('#password');
    await page.keyboard.type(CREDS.password);
    await page.evaluate(() => { document.querySelector('#LoginButtonText').click(); });

    await page.waitForSelector('#btnRegister');
    console.log("Logged in")
    await page.evaluate(() => { document.querySelector('#btnRegister').click(); });

    console.log("Registration done.")

    await browser.close();
  })();
};

if (process.argv[3]) {
    const date = new Date(process.argv[3]);
    const job = schedule.scheduleJob(date, task);
    console.log('Automatic registration for lesson ' + lesson_number + ' scheduled at ' + job.nextInvocation());
}
else {
    task();
}
