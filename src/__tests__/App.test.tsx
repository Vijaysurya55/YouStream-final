import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../App";
import store from "../redux/store";

jest.mock("../assets/YouStream.jpg", () => "logo-mock");

jest.mock("../api/googleAuth", () => ({
  revokeToken: jest.fn(),
}));

jest.mock("../api/youtubeApi", () => ({
  fetchCategories: jest.fn().mockResolvedValue([]),
  fetchVideos: jest.fn().mockResolvedValue([]),
  fetchTrendingVideos: jest.fn().mockResolvedValue([]),
}));

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders main UI after auth initialization", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/YouStream/i)).toBeInTheDocument();
    });
  });

  test("restores user from localStorage and renders main UI", async () => {
    const fakeAuth = {
      user: { name: "vijay", email: "vijay@example.com" },
      token: "fake-token",
      provider: "google",
    };
    localStorage.setItem("youstream_current_auth", JSON.stringify(fakeAuth));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/YouStream/i)).toBeInTheDocument();
    });
  });
});
