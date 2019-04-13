import { getRegistrationStartDate, registrationTask } from "./requests";
import schedule = require('node-schedule');


let lessonNumber: string = process.argv[2];
let task = registrationTask({lessonNumber: lessonNumber});

if (process.argv[3] == "now") {
  task();
}
else {
  (async () => {
    let date = await getRegistrationStartDate({lessonNumber: lessonNumber});
    date.setTime(date.getTime() - 15000); // substract 15s

    let job = schedule.scheduleJob(date, task);
    console.log('Automatic registration for lesson ' + lessonNumber + ' scheduled at ' + job.nextInvocation());
  })();
}
