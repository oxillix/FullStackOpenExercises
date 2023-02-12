const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");
const helper = require("./test_helper");

describe("when there is initially some users saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    users = await User.find();
    console.log("====================================");
    console.log(users);
    console.log("====================================");
    await User.insertMany(helper.initialUsers);
  });

  describe("invalid users are not created", () => {
    test("if username and password are missing from the request data, backend responds with 400", async () => {
      const invalidUser_NoPassword = {
        username: "Johan",
      };

      const invalidUser_NoUsername = {
        password: "supersafepassword",
      };

      // check newUserNoTitle
      await api.post("/api/users").send(invalidUser_NoUsername).expect(400);

      // check newUserNoPassword
      await api.post("/api/users").send(invalidUser_NoPassword).expect(400);

      const usersAtEnd = await helper.usersInDb();

      expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
    });

    test("Both username and password must be at least 3 characters long.", async () => {
      const usersAtStart = await helper.usersInDb();

      // valid password, invalid username
      const invalidUser_username = {
        username: "j",
        password: "safwepass",
      };

      const result_user = await api
        .post("/api/users")
        .send(invalidUser_username)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result_user.body.error).toContain(
        "Both username and password must be at least 3 characters long"
      );

      // valid username, invalid password
      const invalidUser_password = {
        username: "klaasje1",
        password: "ab",
      };

      const result_pass = await api
        .post("/api/users")
        .send(invalidUser_password)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result_pass.body.error).toContain(
        "Both username and password must be at least 3 characters long"
      );

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test("username must be unique", async () => {
      const invalidUser_Username_NotUnique = {
        username: "joost",
        password: "kaas",
      };

      const result_user = await api
        .post("/api/users")
        .send(invalidUser_Username_NotUnique)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result_user.body.error).toContain(
        "The username must be unique."
      );

      const usersAtEnd = await helper.usersInDb();

      expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
