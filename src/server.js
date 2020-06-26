import express from "express";

import connectDB from "./config/connectDB";
import ContactModel from './models/contact.model';

const app = express();

// Connect to MongoDB
connectDB();

app.get("/", async (req, res) => {
  try {
    const item = {
      userId: "123456",
      contactId: "A30123BZ",
    }
    const contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.error(err);
  }
})

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`App listening at ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`)
})
