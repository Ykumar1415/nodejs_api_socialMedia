const user = require("../models/user");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.put("/update/:userid", async (req, res) => {
  try {
    if (req.body.userid === req.params.userid || req.body.isAdmin) {
      if (req.body.password)
        req.body.password = await bcrypt.hash(req.body.password, 12);
      const updateresult = await User.findByIdAndUpdate(req.params.userid, {
        $set: req.body,
      });
      if (updateresult) res.send("updated successfully");
      else res.send("not updated");
    }
  } catch (e) {
    console.log(e);
  }
});

router.delete("/delete/:userid", async (req, res) => {
  try {
    if (req.body.userid === req.params.userid || req.body.isAdmin) {
      const delteresult = await User.findByIdAndDelete(req.params.userid);
      if (!delteresult) res.send("not deleted");
      else res.send("deleted successfully");
    } else res.send("you can delete only your account");
  } catch (e) {
    console.log(e);
  }
});

router.get("/find/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json(other);
    if (!user) res.send("no user found ");
  } catch (e) {
    res.send("No User Found");
  }
});

router.put("/follow/:userid", async (req, res) => {
  if (req.body.userId !== req.params.userid) {
    try {
      const user = await User.findById(req.params.userid);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.userid },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

router.put("/unfollow/:userid", async (req, res) => {
  if (req.body.userId !== req.params.userid) {
    try {
      const user = await User.findById(req.params.userid);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        user.followers = user.followers.filter((id) => id != req.body.userId);
        currentUser.followings = currentUser.followings.filter(
          (id) => id != req.params.userid
        );
        await user.save();
        await currentUser.save();
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
