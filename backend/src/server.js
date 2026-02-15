import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { server } from "./socket/socket.js";
import "./app.js";
import { startWalletCron } from "../cron/walletCron.js";


connectDB();

startWalletCron();
console.log("Wallet Cron Job initialized.");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
