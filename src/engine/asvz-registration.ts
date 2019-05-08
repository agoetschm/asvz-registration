import { register, scheduleRegistration } from "./main";

if (process.argv[2] === "now") {
  register(process.argv[3], process.argv[4], process.argv[5]);
} else {
  scheduleRegistration(process.argv[2], process.argv[3], process.argv[4]);
}
