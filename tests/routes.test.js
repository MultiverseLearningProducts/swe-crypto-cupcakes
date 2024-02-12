const request = require("supertest");
const app = require("../app");

// Mock auth0
// auth = jest.fn();
// requiresAuth = jest.fn(true);
jest.mock("express-openid-connect", () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next();
    };
  }),
  requiresAuth: jest.fn(() => {
    return (req, res, next) => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST adds a cupcake", async () => {
    const response = await request(app)
      .post("/cupcakes")
      .type("json")
      .send(marbleCupcake);
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expect.objectContaining(marbleCupcake));
    newCupcakeID = response.body.id;
  });

  it("GET returns all cupcakes", async () => {
    const response = await request(app).get("/cupcakes");
    expect(response.body).toBeDefined();
    expect(response.body.length).toEqual(9); // seedData + 1, this is actually a bad way to do it
  });

  it("GET returns one cupcake", async () => {
    const response = await request(app).get(`/cupcakes/${newCupcakeID}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining(marbleCupcake));
  });
});
