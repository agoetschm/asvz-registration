import schedule from "node-schedule";
import { registrationNameAndStartDate, registrationTask } from "./requests";

export function scheduleRegistration(arg: string, user: string, password: string): Promise<void> {
  const [lessonNumber, url]  = lessonNumberAndUrl(arg);
  const task = registrationTask({url, user, password});

  return (async () => {
    const [name, date] = await registrationNameAndStartDate({url});
    date.setTime(date.getTime() - 15000); // substract 15s

    const job = schedule.scheduleJob(`[${user}] ${name} (${lessonNumber})`, date, task);
    console.log("Automatic registration for lesson " + lessonNumber + " scheduled at " + job.nextInvocation());
  })();
}

export function register(arg, user, password) {
  const [_, url]  = lessonNumberAndUrl(arg);
  registrationTask({url, user, password})();
}

function lessonNumberAndUrl(str: string): [string, string] {
  if (str.includes("/")) {
    const m = str.match(/\/(\d+)\/?$/); // last part of url has to be a seq of digits
    const lesson = m[1];
    return [lesson, str];
  } else {
    return [str, "https://schalter.asvz.ch/tn/lessons/" + str];
  }
}
