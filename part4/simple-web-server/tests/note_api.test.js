const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./../app");
const Note = require("./../models/note");
const helper = require("./test_helper");

const api = supertest(app);
const BASE_PATH = "/api/notes";

beforeEach(async () => {
  await Note.deleteMany({});
  console.log("===> DB Test cleared.");

  for (const note of helper.initialNotes) {
    let noteObj = new Note(note);
    await noteObj.save();
    console.log(`Note: - "${noteObj.content}" - saved.`);
  }
  console.log("===> DB Test setup done.");
});

test.only("notes are returned as json", async () => {
  await api
    .get(BASE_PATH)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("should be only two notes", async () => {
  const response = await api.get(BASE_PATH);
  console.log("TWO: ", response.body);
  assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test.only("should the first note be about HTTP methods", async () => {
  const response = await api.get(BASE_PATH);
  const contents = response.body.map((n) => n.content);
  assert(contents.includes("HTML is easy"));
});

test.only("should add a valid note", async () => {
  const newNote = { content: "async/await calls", important: true };

  await api
    .post(BASE_PATH)
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  assert(contents.includes("async/await calls"));
});

test.only("should not add a note without content", async () => {
  const newNote = { important: false };

  await api.post(BASE_PATH).send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});

test("should get a specific note", async () => {
  const notesAtStart = await helper.notesInDb();

  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`${BASE_PATH}/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});

test("should delete a note", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`${BASE_PATH}/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();
  const contents = notesAtEnd.map((n) => n.content);
  assert(!contents.includes(noteToDelete.content));

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});

// CLOSE DB Connection after al tests have run
after(async () => await mongoose.connection.close());
