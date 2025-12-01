import store from "../../redux/store";
import rootReducer from "../../redux/rootReducer";

describe("Redux store", () => {
  test("creates store with the root reducer", () => {
    const state = store.getState();

    expect(state).toHaveProperty("videoState");
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("category");
  });
});
