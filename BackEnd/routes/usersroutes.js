import express from 'express';
import { User } from '../models/usermodel.js';


const router = express.Router();

router.post("/add_user", async (req, res) => {
  const data = new User(req.body)
  await data.save()
  res.send({ success: true, message: "data created successfuly" })
})

////User Login 
router.post("/user_signin", async (req, res) => {
  console.log('in-------------------------------');
  const { email, password } = req.body;

  try {
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid1 = user.password === password;

    console.log('Input password:', password);
    console.log('Stored hashed password:', user.password);
    console.log('isPasswordValid:', isPasswordValid1);

    if (isPasswordValid1 === false) { // Fixed condition
      console.log('Request body:', req.body);
      return res.status(401).json({ success: false, message: "Incorrect password" });


    }

    // If password is valid, send success message and user data
    res.status(200).json({ success: true, message: "Login successful", data: user });
  } catch (error) {
    console.log('Retrieved user:', user);

    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/users", async (req, res) => {
  const data = await User.find({})

  res.json({ success: true, data: data })
});


router.put("/user_update", async (req, res) => {
  const { id, ...rest } = req.body
  const data = await User.updateOne({ _id: id }, rest)
  res.send({ success: true, message: "updated successfuly", data: data })
})




router.delete("/user_delete/:id", async (req, res) => {
  const id = req.params.id
  const data = await User.deleteOne({ _id: id })
  res.send({ success: true, message: "deleted successfully", data: data })
})





router.get("/user_order/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const order = await User.findById(id);

    if (!order) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.send({ success: true, message: "User fetched successfully", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

export default router;