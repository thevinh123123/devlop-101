
const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");

describe("PUT /accounts/:id", () => {
  let accountId;

  beforeEach(async () => {
    const payload = { name: "John Doe", email: "john@example.com" };
    const res = await request(app)
      .post("/accounts")
      .send(payload)
      .set("Accept", "application/json");
    accountId = res.body.id;
  });

  it("should return status 200 and update account name", async () => {
    const updatePayload = { name: "Jane Doe" };
    const res = await request(app)
      .put(`/accounts/${accountId}`)
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys("id", "name", "email");
    expect(res.body.id).to.equal(accountId);
    expect(res.body.name).to.equal(updatePayload.name);
    expect(res.body.email).to.equal("john@example.com");
  });

  it("should return status 200 and update account email", async () => {
    const updatePayload = { email: "newemail@example.com" };
    const res = await request(app)
      .put(`/accounts/${accountId}`)
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys("id", "name", "email");
    expect(res.body.id).to.equal(accountId);
    expect(res.body.name).to.equal("John Doe");
    expect(res.body.email).to.equal(updatePayload.email);
  });

  it("should return status 200 and update both name and email", async () => {
    const updatePayload = { name: "Jane Smith", email: "jane@example.com" };
    const res = await request(app)
      .put(`/accounts/${accountId}`)
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys("id", "name", "email");
    expect(res.body.id).to.equal(accountId);
    expect(res.body.name).to.equal(updatePayload.name);
    expect(res.body.email).to.equal(updatePayload.email);
  });

  it("should return status 404 when account does not exist", async () => {
    const updatePayload = { name: "Non Existent" };
    const res = await request(app)
      .put("/accounts/99999")
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(404);
  });
});
