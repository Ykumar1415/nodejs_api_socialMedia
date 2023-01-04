const router = require("express").Router();
const Userpost = require("../models/userposts");
const User = require("../models/user");
router.post("/create", async (req, res) => {
  const Post = new Userpost(req.body);
  try {
    const savenewpost = await Post.save();
    res.send(savedPost);
  } catch (err) {
    res.send(err);
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      post = new Post(req.body);
      await post.save();
      res.send("the post has been updated");
    } else {
      res.send("you can update only your post");
    }
  } catch (err) {
    res.send(err);
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.send("the post has been deleted");
    } else {
      res.send("you can delete only your post");
    }
  } catch (err) {
    res.send(err);
  }
});



router.get("/allrelativepost", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
