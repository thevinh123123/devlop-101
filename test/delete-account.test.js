const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");

describe("DELETE /accounts/:id", () => {
  let accountId;

  beforeEach(async () => {
    const payload = { name: "Test User", email: "test@example.com" };
    const res = await request(app)
      .post("/accounts")
      .send(payload)
      .set("Accept", "application/json");
    accountId = res.body.id;
  });

  it("should return status 204 and delete the account", async () => {
    const res = await request(app).delete(`/accounts/${accountId}`);

    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should verify account is deleted by getting 404 on subsequent GET", async () => {
    await request(app).delete(`/accounts/${accountId}`);
    const res = await request(app)
      .get(`/accounts/${accountId}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(404);
  });

  it("should return status 404 when deleting non-existent account", async () => {
    const res = await request(app).delete("/accounts/99999");

    expect(res.status).to.equal(404);
  });

  it("should verify account is removed from accounts list", async () => {
    const beforeRes = await request(app)
      .get("/accounts")
      .set("Accept", "application/json");
    const beforeCount = beforeRes.body.length;
    await request(app).delete(`/accounts/${accountId}`);

    const afterRes = await request(app)
      .get("/accounts")
      .set("Accept", "application/json");
    const afterCount = afterRes.body.length;

    expect(afterCount).to.equal(beforeCount - 1);
    expect(afterRes.body.find((a) => a.id === accountId)).to.be.undefined;
  });
});