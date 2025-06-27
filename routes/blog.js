const express = require('express')
const router = express.Router()
const Comment=require('../models/comment.js')
const Blog = require('../models/blog.js')
const path = require('path')
const multer = require('multer')
const USER = require('../models/user.js')
const mongoose=require('mongoose')
const { log } = require('console')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`)
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})
const upload = multer({ storage: storage })
router.get('/add-new', async (req, res) => {
  res.render('addBlog', {
    user: req.user,
  })
})

router.get(`/:id`,async(req,res)=>{
const id=req.params.id
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).send('Invalid blog ID');
}
const blog=await Blog.findOne({_id:id}).populate('createdBy')
const comments=await Comment.find({blogid:req.params.id}).populate('createdBy')
const user = req.user;
res.render('blog',{
  blog,
  user,
  comments
})
})

router.get('/edit/:id', async (req, res) => {
  const id  = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).send('Invalid blog ID');
}

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    res.render('edit', { blog }); // assumes views/edit.ejs exists
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/', upload.single('coverImageUrl'), async (req, res) => {
  const { title, body } = req.body
  const user=req.user
  const blog = await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy:user._id,
 } )
  res.redirect(`/blog/${blog._id}`)
})

router.post(`/comment/:id`,async(req,res)=>{
const {content}=req.body
const id=req.params.id
if (!content) { return res.status(400).send('Content is required'); }
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).send('Invalid blogId');
}
await Comment.create({
  content,
  createdBy:req.user._id,
  blogid:id
})

res.redirect(`/blog/${id}`)

})

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

router.post(`/delete/:id`,async(req,res)=>{
    const id=req.params.id
     if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }
    const res1=await Blog.findByIdAndDelete(id)
    if(res1)
    return res.status(200).send('Deleted Successfully')
    return res.status(500).send("Error in deleting")
    
})

module.exports =
  router
