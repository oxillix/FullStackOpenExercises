const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

describe("when there is initially some blogs saved", () => {
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

  describe("addition of a new blog", () => {
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
      const blog = blogsAtEnd.filter((b) => b.title === newBlog.title)[0];

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

    describe("deletion of a blog", () => {
      test("succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

        const titles = blogsAtEnd.map((b) => b.title);

        expect(titles).not.toContain(blogToDelete.title);
      });
    });

    describe("updating a blog", () => {
      test("updating a blog returns the blog with updated values, status 200", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[1];

        const updatedBlog = {
          title: "This is an updated title",
          author: "This is an updated author",
          url: "this is an updated url",
          likes: 7,
        };

        const result = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlog)
          .expect(200);

        // console.log(`result.body: ${JSON.stringify(result.body)}`);
        // console.log(`blogToUpdate: ${JSON.stringify(blogToUpdate)}`);
        // console.log(`updatedBlog: ${JSON.stringify(updatedBlog)}`);

        // console.log(
        //   `the blog to compare to: ${JSON.stringify({
        //     ...blogToUpdate,
        //     ...updatedBlog,
        //   })}`
        // );

        // returned blog equals updated blog
        expect(result.body).toEqual({ ...blogToUpdate, ...updatedBlog });

        const blogsAtEnd = await helper.blogsInDb();

        const atEndUpdatedBlog = blogsAtEnd.filter(
          (blog) => blog.id === blogToUpdate.id
        )[0];

        expect(atEndUpdatedBlog).toEqual({ ...blogToUpdate, ...updatedBlog });
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
