import request from "supertest";
import { expect } from "chai";
import app from "../app.js";

describe("ShoppingList endpoints", function () {
  this.timeout(5000);
  let createdId;
  let token;
  let email;

  before(async function () {
    email = `test-${Date.now()}@test.com`;
    // create user
    const createUser = await request(app).post("/v1/users/create-user").send({
      name: "Test User",
      username: "testuser",
      email,
      passwordHash: "test123",
    });
    expect(createUser.status).to.equal(201);

    // login
    const loginRes = await request(app).post("/v1/users/login").send({
      email,
      passwordHash: "test123",
    });
    expect(loginRes.status).to.equal(200);
    expect(loginRes.body).to.have.property("accessToken");

    token = loginRes.body.accessToken;
  });

  // Happy day
  it("provides a data list (GET /v1/lists/all)", async function () {
    const res = await request(app)
      .get("/v1/lists/all")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload").that.is.an("array");
  });

  it("creates a record (POST /v1/lists/create-list)", async function () {
    const payload = {
      archived: false,
      name: "items test",
      description: "za deset minut check",
      members: [],
      items: [],
    };

    const res = await request(app)
      .post("/v1/lists/create-list")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send(payload);

    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.have.property("payload");
    createdId = res.body.payload._id;
    expect(createdId).to.exist;
  });

  it("returns a single record (GET /v1/lists/find/:id)", async function () {
    if (!createdId) this.skip();
    const res = await request(app)
      .get(`/v1/lists/find/${createdId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property("_id", createdId);
  });

  it("updates a record (PUT /v1/lists/update/:id)", async function () {
    const updateData = {
      name: "Updated name",
      archived: true,
      description: "Updated description",
    };

    const res = await request(app)
      .put(`/v1/lists/update/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(res.status).to.equal(200);
    expect(res.body.payload.name).to.equal("Updated name");
    expect(res.body.payload.creatorId).to.exist;
  });

  it("deletes a record (DELETE /v1/lists/delete/:id)", async function () {
    const res = await request(app)
      .delete(`/v1/lists/delete/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("msg", "List deleted");
  });

  // Alternative 
  it("fails to get a non-existing list", async function () {
    const res = await request(app)
      .get("/v1/lists/find/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(404);
  });

  it("fails to update a non-existing list", async function () {
    const res = await request(app)
      .put("/v1/lists/update/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Should fail" });
    expect(res.status).to.equal(404);
  });

  it("fails to delete a non-existing list", async function () {
    const res = await request(app)
      .delete("/v1/lists/delete/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(404);
  });

  it("fails to create a list with invalid data", async function () {
    const payload = {
      archived: false,
      name: "", 
      description: "desc",
    };
    const res = await request(app)
      .post("/v1/lists/create-list")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).to.equal(400); 
  });

  it("fails to access endpoints without token", async function () {
    const res = await request(app).get("/v1/lists/all");
    expect(res.status).to.equal(401);
  });
});
