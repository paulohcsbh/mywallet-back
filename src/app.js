import express from "express";
import cors from "cors";
import signRouters from "./routes/signRoutes.js"
import registerRouters from "./routes/registerRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(signRouters);
app.use(registerRouters);

app.listen(5000, () => {
    console.log("App running in port 5000")
});


