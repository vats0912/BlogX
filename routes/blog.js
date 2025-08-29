const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.js');
const Blog = require('../models/blog.js');
const USER = require('../models/user.js');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogx-covers', // all covers go in this Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }] // optimize images
  }
});
const upload = multer({ storage });

router.get('/add-new', async (req, res) => {
  res.render('addBlog', { user: req.user });
});



router.post("/like/:id", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Login required" });

    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user._id;

    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({ likesCount: blog.likes.length, liked: blog.likes.includes(userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }

  const blog = await Blog.findOne({ _id: id }).populate('createdBy');
  const comments = await Comment.find({ blogid: id }).populate('createdBy');
  res.render('blog', { blog, user: req.user, comments,liked: req.user ? blog.likes.includes(req.user._id) : false });
});


router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send('Blog not found');
    res.render('edit', { blog });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.post('/', upload.single('coverImageUrl'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const user = req.user;

    const blog = await Blog.create({
      title,
      body,
      coverImageUrl: req.file.path,
      createdBy: user._id,
    });

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create blog');
  }
});


router.post('/comment/:id', async (req, res) => {
  const { content } = req.body;
  const id = req.params.id;

  if (!content) return res.status(400).send('Content is required');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blogId');
  }

  await Comment.create({
    content,
    createdBy: req.user._id,
    blogid: id,
  });

  res.redirect(`/blog/${id}`);
});

// Update blog
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  try {
    await Blog.findByIdAndUpdate(id, { title, body });
    res.redirect(`/blog/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update blog');
  }
});

// Delete blog
router.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }

  const res1 = await Blog.findByIdAndDelete(id);
  if (res1) return res.status(200).send('Deleted Successfully');
  return res.status(500).send('Error in deleting');
});

module.exports = router;
