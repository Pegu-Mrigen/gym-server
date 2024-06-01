import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { postEmail } from "./lib/postEmail.js";
const app = express();
const router = express.Router();

//config({ path: "./config.env" });
config();

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

router.get("/", (req, res, next) => {
  res.send("<h1>From GYM Server</h1>");
});
router.post("/send/email", async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(
      res.status(400).json({
        success: false,
        message: "Please fill up all the fields",
      })
    );
  }

  try {
    await postEmail({
      email: "mrig8520@gmail.com",
      subject: "GYM Emails",
      message,
      userEmail: email,
    });

    res.status(200).json({
      success: true,
      message: "Message sent Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try after sometime!",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
