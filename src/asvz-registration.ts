import { getRegistrationStartDate, registrationTask } from "./requests";
import schedule = require('node-schedule');


let [lessonNumber, url]  = lessonNumberAndUrl(process.argv[2]);
let task = registrationTask({url: url});

if (process.argv[3] == "now") {
  task();
}
else {
  (async () => {
    let date = await getRegistrationStartDate({url: url});
    date.setTime(date.getTime() - 15000); // substract 15s

    let job = schedule.scheduleJob(date, task);
    console.log('Automatic registration for lesson ' + lessonNumber + ' scheduled at ' + job.nextInvocation());
  })();
}

function lessonNumberAndUrl(str: string): string[] {
  if (str.includes('/')) {
    let m = str.match(/\/(\d+)\/?$/); // last part of url has to be a seq of digits
    let lessonNumber = m[1];
    return [lessonNumber, str];
  }
  else {
    return [str, 'https://schalter.asvz.ch/tn/lessons/' + str];
  }

}
