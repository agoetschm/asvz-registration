import dotenv from "dotenv";
import * as express from "express";
import schedule from "node-schedule";
import passport from "passport";
import passportHttp from "passport-http";
import { scheduleRegistration } from "../engine/main";

passport.use(new passportHttp.BasicStrategy(
  (username, password, done) => {
    if (username === process.env.CLIENT_USER && password === process.env.CLIENT_PASSWORD) {
      return done(null, username);
    } else {
      return done(null, false);
    }
  }
));
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });

export const register = (app: express.Application) => {
  app.get("/", passport.authenticate("basic"), ( req: any, res ) => {
    res.render("index");
  } );

  app.get("/api/registration/all", (req: any, res) => {
    const scheduledRegistrations = [];
    for (const name in schedule.scheduledJobs) {
      const job = schedule.scheduledJobs[name];
      if (job.nextInvocation() >= new Date()) {
        scheduledRegistrations.push({ name, date: job.nextInvocation() });
      }
    }

    res.json(scheduledRegistrations);
  });

  app.post("/api/registration/add", passport.authenticate("basic"), async (req: any, res, next) => {
    try {
      await scheduleRegistration(req.body.url);
      return res.json({});
    } catch (err) {
      console.error(err);
      res.status(500).json( { error: err.message || err } );
    }
  });

  app.post("/api/registration/cancel", passport.authenticate("basic"), (req: any, res, next) => {
    console.log("got cancel");
    try {
      const job = schedule.scheduledJobs[req.body.name];
      const success = job.cancel();
      return res.json({ success });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || err });
    }
  });
};
