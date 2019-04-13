import puppeteer = require('puppeteer');

export function getRegistrationStartDate({lessonNumber}): Promise<Date> {
  return puppeteerExecute((page) =>
    (async () => {
      await page.goto('https://schalter.asvz.ch/tn/lessons/' + lessonNumber);

      console.log("Trying to get start time...");
      let raw = await textOf('#eventDetails > div > div.col-sm-4 > div > div.panel-body.event-properties > app-lesson-properties-display > dl:nth-child(4) > dd', page);
      let parsed = dateFromString(raw);
      console.log("Parsed start time: " + parsed);
      return parsed;
    })()
  );
}

// returns the registering task
export function registrationTask({lessonNumber}): () => Promise<Boolean> {
  return () =>
    puppeteerExecute((page) =>
      (async () => {
        console.log('Registering at ' + new Date() + " ...");

        await page.goto('https://schalter.asvz.ch/tn/lessons/' + lessonNumber);
        console.log("Reached ASVZ page")
        await click('body > app-root > div > div:nth-child(2) > app-lesson-details > div > div > app-lessons-enrollment-button > button', page);
        // choose auth type
        await page.waitForNavigation();
        await click('#switch-aai > div.panel-body > div > form > div > p > button', page);
        // choose eth from list
        await page.waitForNavigation();
        await click('#userIdPSelection_iddwrap', page);
        await click('#userIdPSelection_iddlist > div:nth-child(5)', page);
        // authenticate
        await page.waitForNavigation();
        console.log("Reached login page");
        let CREDS = require('./creds');
        await page.focus('#username');
        await page.keyboard.type(CREDS.username);
        await page.waitFor(200);
        await page.focus('#password');
        await page.keyboard.type(CREDS.password);
        await page.waitFor(200);
        await click('#LoginButtonText', page);

        await page.waitForSelector('#btnRegister');
        console.log("Logged in");
        await click('#btnRegister', page);

        await page.waitForSelector('#btnRegister');
        let successStr = await textOf('#btnRegister', page);
        let success = /entfernen/i.test(successStr); // success when register button contains 'entfernen'
        console.log(success ? "Registration successful." : "Registration failed.");

        return success;
      })()
    );
}

function click(selector: string, page: puppeteer.Page): Promise<void> {
  // because page.click wasn't working on my raspi
  return (async () => page.evaluate((selector) => (<HTMLElement>document.querySelector(selector)).click(), selector))();
}

function textOf(selector: string, page: puppeteer.Page): Promise<string> {
  return (async () => page.evaluate((selector) => (<HTMLElement>document.querySelector(selector)).innerText, selector))();
}

function puppeteerExecute<T>(todo: (page:puppeteer.Page) => Promise<T>): Promise<T> {
  return (async () => {
    let browser = await puppeteer.launch();
    // let browser = await puppeteer.launch({headless: false});
    // let browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
    let page = await browser.newPage();
    // page.setDefaultNavigationTimeout(60000);

    let ret: T = await todo(page);

    await browser.close();
    return ret;
  })();
}

// date is in CET
function dateFromString(str: string): Date {
  let m = str.match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/);
  return new Date(+m[3], +m[2]-1, +m[1], +m[4], +m[5]);
}
