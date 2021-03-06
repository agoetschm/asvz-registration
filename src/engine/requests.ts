import puppeteer from "puppeteer";

export function checkLogin(user: string, password: string): Promise<boolean> {
    return puppeteerExecute(async (page) => {
        console.log("Checking login for user " + user);

        await page.goto("https://schalter.asvz.ch");
        // choose auth type
        await page.waitForNavigation();
        await click("#switch-aai > div.panel-body > div > form > div > p > button", page);
        // choose eth from list
        await page.waitForNavigation();
        await click("#userIdPSelection_iddwrap", page);
        await click("#userIdPSelection_iddlist > div:nth-child(5)", page);
        // authenticate
        await page.waitForNavigation();
        console.log("Reached login page");
        await page.focus("#username");
        await page.keyboard.type(user);
        await page.waitFor(200);
        await page.focus("#password");
        await page.keyboard.type(password);
        await page.waitFor(200);
        await click("#LoginButtonText", page);
        // await page.waitForNavigation();
        await page.waitFor(3000);
        // TODO wait better...
        // await page.waitForSelector(`body > app-root > div > div:nth-child(1)
        //     > app-navigation-bar > div > div > div.navbar-header > a > img`);
        const loggedIn = await page.$(`body > app-root > div > div:nth-child(1)
            > app-navigation-bar > div > div > div.navbar-header > a > img`);
        return loggedIn != null;
      });
}

export function registrationNameAndStartDate({url}): Promise<[string, Date]> {
  return puppeteerExecute((page) =>
    (async () => {
      await page.goto(url);

      console.log("Trying to get start time...");
      const rawDate = await textOf(`#eventDetails > div > div.col-sm-4 > div > div.panel-body.event-properties
        > app-lesson-properties-display > dl:nth-child(11) > dd`, page);
      const date = dateFromString(rawDate);
      console.log("Parsed start time: " + date);

      const name = await textOf(`body > app-root > div > div:nth-child(2)
        > app-lesson-details > div > div > div > h1`, page);

      const ret: [string, Date] = [name, date];
      return ret;
    })()
  );
}

// returns the registering task
export function registrationTask({url, user, password}): () => Promise<boolean> {
  return () =>
    puppeteerExecute((page) =>
      (async () => {
        console.log("Registering at " + new Date() + " ...");

        await page.goto(url);
        console.log("Reached ASVZ page");
        await click(`body > app-root > div > div:nth-child(2)
        > app-lesson-details > div > div > app-lessons-enrollment-button > button`, page);
        // choose auth type
        await page.waitForNavigation();
        await click("#switch-aai > div.panel-body > div > form > div > p > button", page);
        // choose eth from list
        await page.waitForNavigation();
        await click("#userIdPSelection_iddwrap", page);
        await click("#userIdPSelection_iddlist > div:nth-child(5)", page);
        // authenticate
        await page.waitForNavigation();
        console.log("Reached login page");
        await page.focus("#username");
        await page.keyboard.type(user);
        await page.waitFor(200);
        await page.focus("#password");
        await page.keyboard.type(password);
        await page.waitFor(200);
        await click("#LoginButtonText", page);

        await page.waitForSelector("#btnRegister");
        console.log("Logged in");
        await click("#btnRegister", page);

        await page.waitForSelector("#btnRegister");
        const successStr = await textOf("#btnRegister", page);
        const success = /entfernen/i.test(successStr); // success when register button contains 'entfernen'
        console.log(success ? "Registration successful." : "Registration failed.");

        return success;
      })()
    );
}

function click(selector: string, page: puppeteer.Page): Promise<void> {
  // because page.click wasn't working on my raspi
  return (async () => page.evaluate(
    (sel) => (document.querySelector(sel) as HTMLElement).click(),
    selector)
  )();
}

function textOf(selector: string, page: puppeteer.Page): Promise<string> {
  return (async () => page.evaluate(
    (sel) => (document.querySelector(sel) as HTMLElement).innerText,
    selector)
  )();
}

function puppeteerExecute<T>(todo: (page: puppeteer.Page) => Promise<T>): Promise<T> {
  return (async () => {
    const browser = await puppeteer.launch();
    // const browser = await puppeteer.launch({headless: false});
    // const browser = await puppeteer.launch({executablePath: "/usr/bin/chromium-browser"});
    const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(60000);

    const ret: T = await todo(page);

    // await new Promise((resolve) => setTimeout(resolve, 30000));

    await browser.close();
    return ret;
  })();
}

// date is in CET
function dateFromString(str: string): Date {
  const m = str.match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/);
  return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]);
}
