import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import passport from "passport";
import path from "path";
import * as server from "./server";
import {generateRsaKeyPair} from "./shared/crypto";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;
const cert = process.env.TLS_CERT;
const key = process.env.TLS_KEY;
const passphrase = process.env.RSA_PASSPHRASE;

const options = {
  cert: fs.readFileSync(cert),
  key: fs.readFileSync(key)
};

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( express.json() );

app.use(passport.initialize());

const [publicKey, privateKey] = generateRsaKeyPair(passphrase);

server.register(app, publicKey, privateKey, passphrase);

https.createServer(options, app).listen( port, () => {
// app.listen( port, () => {
  console.log( `server started at https://localhost:${ port }` );
} );
