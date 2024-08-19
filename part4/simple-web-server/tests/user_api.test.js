const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("./../app");
const bcrypt = require("bcrypt");
const User = require("./../models/user");
const helper = require("../tests/test_helper");

const BASE_PATH = "/api/users";
const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test.only("should create a new username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "kurusu",
      name: "Fer",
      password: "qwertyui",
    };

    await api
      .post(BASE_PATH)
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });

  test.only("should return proper statusCode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post(BASE_PATH)
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("should return all users", async () => {
    const usersAtStart = await helper.usersInDb();
    const usersAtEnd = await api.get(BASE_PATH).expect(200);
    console.log(usersAtEnd.body.length);
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.length);
  });
});

// CLOSE DB Connection after al tests have run
after(async () => await mongoose.connection.close());
