import express from "express";
import cors from 'cors';
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/LoginSignForm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Mongoose connected");
})
.catch((error) => {
    console.error("Mongoose connection error:", error);
});

 const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const User=mongoose.model("User", userSchema)

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email: email });
      if (user) {
          if (password === user.password) {
              res.send({ message: 'Login successfully' });
          } else {
              res.send({ message: 'Password did not match' });
          }
      } else {
          res.send({ message: 'User not registered', email: email });
      }
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).send({ error: error.message });
  }
});



app.post("/signin", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        res.send({ message: 'Email already registered' });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        await newUser.save();
        res.send({ message: "Successful registration" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
app.listen(9000, () => {
    console.log("Server started at port 9000");
});
