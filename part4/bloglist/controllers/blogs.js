const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", "-blogs");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // if title or url is missing in the body, abort save
  if (!request.body.title || !request.body.url) {
    response.status(400).end();
  } else {
    // if user is not authenticated, abort save
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = request.user;

    let blog = new Blog({ ...request.body, user: user._id });
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const blogID = request.params.id;

  // if user is not authenticated, abort delete
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = request.user;
  const userBlogs_ContainsBlogID = user.blogs.find(
    (blog) => blog.toString() === blogID
  );

  if (!userBlogs_ContainsBlogID) {
    return response
      .status(403)
      .json({ error: "User has no permission to delete this blog" });
  }

  await Blog.findByIdAndRemove(blogID);
  response
    .status(204)
    .json({ success: "Successfully deleted this blog." })
    .end();
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
