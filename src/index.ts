import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import path from "path";
import * as server from "./server";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( express.json() );

app.use(passport.initialize());

server.register( app );

app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );
