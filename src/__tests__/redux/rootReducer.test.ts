import rootReducer from "../../redux/rootReducer";

describe("rootReducer", () => {
  test("returns the initial root state structure", () => {
    const state = rootReducer(undefined, { type: "@@INIT" });

    expect(state).toHaveProperty("videoState");
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("category");
  });

})