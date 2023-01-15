const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  expect(titles).toContain("React patterns");
});

test("the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];

  expect(blog.id).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New blog post",
    author: "Nicolas Arnouts",
    url: "https://google.com",
    likes: 17,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain("New blog post");
});

test("if the likes property is missing from the request, it will default to the value 0", async () => {
  const newBlog = {
    title: "Blog post without likes",
    author: "Nicolas Arnouts",
    url: "https://nicolasarnouts.be",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const blog = blogsAtEnd.filter(
    (b) => b.title === "Blog post without likes"
  )[0];

  expect(blog.likes).toEqual(0);
});

test("if the title or url properties are missing from the request data, backend responds with 400", async () => {
  const newBlogNoUrl = {
    title: "Blog post without likes",
    author: "Nicolas Arnouts",
  };

  const newBlogNoTitle = {
    author: "Nicolas Arnouts",
    url: "https://nicolasarnouts.be",
  };

  // check newBlogNoUrl
  await api.post("/api/blogs").send(newBlogNoUrl).expect(400);

  // check newBlogNoTitle
  await api.post("/api/blogs").send(newBlogNoTitle).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
