const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");

describe("GET /accounts/:id", () => {
  it("should return status 200 & the account if exists", async () => {
    const newAcc = await request(app)
      .post("/accounts")
      .send({ name: "DonaldTrump", email: "dt@us.a" });

    const id = newAcc.body.id;

    const res = await request(app).get(`/accounts/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(id);
    expect(res.body.name).to.equal("DonaldTrump");
  });
  it("should return 404 if account not found", async () => {
    const res = await request(app).get(`/accounts/9999`);
    expect(res.status).to.equal(404);
  });
});