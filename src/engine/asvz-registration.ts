import { register, scheduleRegistration } from "./main";

if (process.argv[3] === "now") {
  register(process.argv[2]);
} else {
  scheduleRegistration(process.argv[2]);
}
