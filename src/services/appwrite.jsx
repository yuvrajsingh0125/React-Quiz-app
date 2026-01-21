import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Or self-hosted endpoint
  .setProject("YOUR_PROJECT_ID"); // Replace with your actual ID

export const account = new Account(client);
export const databases = new Databases(client);
