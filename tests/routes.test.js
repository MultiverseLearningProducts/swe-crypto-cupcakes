const request = require("supertest");
const app = require("../app");

// Mock auth0
jest.mock("express-openid-connect", () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next();
    };
  }),
  requiresAuth: jest.fn(() => {
    return (req, res, next) => {
      const email = req.headers.authorization.split(" ")[1];
      req.oidc = { user: { email } };
      next();
    };
  }),
}));

describe("/ endpoint", () => {
  it("returns 404", async () => {
    const response = await request(app).get("/").expect(404);
  });
});

describe("/CUPCAKES endpoint", () => {
  const marbleCupcake = {
    flavor: "marble",
    instructions: "swirl chocolate and vanilla",
  };
  let newCupcakeID;
  const testOwnerId = "someuser@somedomain.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST adds a cupcake", async () => {
    const response = await request(app)
      .post("/cupcakes")
      .type("json")
      .set("Authorization", `Bearer ${testOwnerId}`)
      .send(marbleCupcake);
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expect.objectContaining(marbleCupcake));
    newCupcakeID = response.body.id;
  });

  it("GET returns all cupcakes", async () => {
    const response = await request(app)
      .get("/cupcakes")
      .set("Authorization", `Bearer ${testOwnerId}`);
    expect(response.body).toBeDefined();
    expect(response.body.length).toEqual(9); // seedData + 1, this is actually a bad way to do it
  });

  it("GET returns one cupcake", async () => {
    const response = await request(app)
      .get(`/cupcakes/${newCupcakeID}`)
      .set("Authorization", `Bearer ${testOwnerId}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining(marbleCupcake));
  });

  it("DELETE deletes a cupcake if the owner is making the request", async () => {
    const response = await request(app)
      .delete(`/cupcakes/${newCupcakeID}`)
      .set("Authorization", `Bearer ${testOwnerId}`);
    expect(response.status).toEqual(200);
  });

  it("DELETE won't delete a cupcake if the owner is not making the request", async () => {
    const response = await request(app)
        .delete(`/cupcakes/1`)
        .set("Authorization", `Bearer ${testOwnerId}`);
    expect(response.status).toEqual(403);
  });
});
