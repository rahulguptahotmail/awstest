const express = require("express");
const mongoose = require("mongoose");

const app = express();

const connect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://rahulguptahotmail:RahulGupta@assignmenttask.mqse4.mongodb.net/?retryWrites=true&w=majority&appName=AssignmentTask/normal-docker-test"
    )
    .then(() => console.log("mongodb connected"))
    .catch(() => console.log("mongodb false"));
};

connect();

const userSchema = mongoose.Schema({
  email: "string",
  password: "string",
});

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello, world!");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !((await user.password) !== password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 8000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
