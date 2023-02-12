const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", "-blogs");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // if title or url is missing in the body, abort save
  if (!request.body.title || !request.body.url) {
    response.status(400).end();
  } else {
    const user = await User.findOne({})

    let blog = new Blog({ ...request.body, user: user._id});
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  // if title or url is missing in the body, abort save
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
