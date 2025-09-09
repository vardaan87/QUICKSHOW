import { Inngest } from "inngest";
import User from "../models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });
async ({ event }) => {
  const { id, first_name, last_name, email_addresses, image_url } = event.data;
  const userData = {
    _id: id,
    email: email_addresses,
    name: first_name + " " + last_name,
    image: image_url,
  };
};

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

//Inngest function to update user in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" }
);

//Inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
