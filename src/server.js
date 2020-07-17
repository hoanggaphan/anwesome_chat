import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import session from "./config/session";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParse from "cookie-parser";
import configSocketio from "./config/socketio";
import events from 'events';
import * as configApp from './config/app';
import { PeerServer } from 'peer';

// Init app
const app = express();

// Set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;


// Init server with socket.io & express app
const server = http.createServer(app);
const io = socketio(server);

// Init a peer server 
const peerServer = PeerServer({
  port: configApp.app.peer_port, 
  path: configApp.app.peer_path 
});

// Connect to MongoDB
connectDB();

// Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(express.urlencoded({ extended: true }));

// Enable flash messages
app.use(connectFlash());

// Use Cookie Parse
app.use(cookieParse());

// Config passport
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Config for socket.io
configSocketio(io, cookieParse, session.sessionStore);

// Init all socket
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(
    `App listening at http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
  );
});
