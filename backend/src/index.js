import express from "express";
import cors from "cors";
import submitRoute from "./routes/submit.js";
import vendorsRoute from "./routes/vendors.js";
import chatRoute from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/submit", submitRoute);
app.use("/api/vendors", vendorsRoute);
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TrustVet backend on :${PORT}`));
