import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Navbar from "../../Components/Navbar";

jest.mock("../../assets/YouStream.jpg", () => "logo-mock");

const mockSignOutAll = jest.fn();
jest.mock("../../redux/auth/authThunk", () => ({
  signOutAll: () => mockSignOutAll(), // just call the mock when used
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import * as ReactRedux from "react-redux";

const mockUseSelector = jest.spyOn(ReactRedux, "useSelector");
const mockUseDispatch = jest.spyOn(ReactRedux, "useDispatch");

jest.mock("../../Components/SideDrawer", () => () => (
  <div data-testid="side-drawer" />
));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (user: null | { name?: string; email?: string } = null) => {
    mockUseSelector.mockImplementation((selector: any) =>
      selector({
        auth: { user },
      })
    );

    const dispatchMock = jest.fn().mockResolvedValue(undefined);
    mockUseDispatch.mockReturnValue(dispatchMock);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    return { dispatchMock };
  };

  test("shows logo and Login button when user is not authenticated", () => {
    setup(null);

    expect(screen.getByText(/YouStream/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("navigates to search page when clicking search icon", () => {
    setup(null);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "react testing" } });
    const searchIcon = screen.getByTestId("SearchIcon");
    const searchButton = searchIcon.closest("button") as HTMLButtonElement;

    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/search/videos/react%20testing"
    );
  });

  test("navigates to search page when pressing Enter in search field", () => {
    setup(null);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "vite jest" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/search/videos/vite%20jest"
    );
  });

  test("clicking logo clears search and navigates home", () => {
    setup(null);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "something" } });

    const logoImg = screen.getByAltText("YouStream");
    fireEvent.click(logoImg);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows avatar and no Login button when user is authenticated", () => {
    setup({ name: "Test User", email: "test@example.com" });

    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();

    const avatarButton = screen.getByRole("button", {
      name: /t/i, // avatar uses first letter of name/email
    });
    expect(avatarButton).toBeInTheDocument();
  });

  test("opens menu on avatar click and shows Profile/Settings/Logout", () => {
    setup({ name: "Test User", email: "test@example.com" });

    const avatarButton = screen.getByRole("button", {
      name: /t/i,
    });
    fireEvent.click(avatarButton);

    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("clicking Logout calls signOutAll and navigates home", async () => {
    setup({ name: "Test User", email: "test@example.com" });

    const avatarButton = screen.getByRole("button", {
      name: /t/i,
    });
    fireEvent.click(avatarButton);

    const logoutItem = screen.getByText(/Logout/i);
    fireEvent.click(logoutItem);

    expect(mockSignOutAll).toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
