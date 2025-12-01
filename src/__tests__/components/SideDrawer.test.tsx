import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SideDrawer from "../../Components/SideDrawer";
import { fetchCategories } from "../../api/youtubeApi";
import { signOutAll } from "../../redux/auth/authThunk";
import { useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/youtubeApi", () => ({
  fetchCategories: jest.fn(),
}));

jest.mock("../../assets/YouStream.jpg", () => "logo-mock");

jest.mock("../../redux/auth/authThunk", () => ({
  signOutAll: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));
 
const mockUseSelector = useSelector as jest.Mock;

describe("SideDrawer Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders guest greeting and Login when user is not logged in", async () => {
     
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({ auth: { user: null } })
    );

    (fetchCategories as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText("Hi, there stranger")).toBeInTheDocument();

    const loginBtn = screen.getByText("Login");
    expect(loginBtn).toBeInTheDocument();

    fireEvent.click(loginBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("renders user greeting and logout button when user is logged in", async () => {
     
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({
        auth: {
          user: { name: "vijay surya", email: "vijay@example.com" },
        },
      })
    );

    (fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText("Hi, Vijay")).toBeInTheDocument();
  
    expect(screen.getByText("LOGOUT")).toBeInTheDocument();
  });

  test("fetches and displays categories from API", async () => {
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({ auth: { user: null } })
    );

    (fetchCategories as jest.Mock).mockResolvedValue([
      { id: "10", snippet: { title: "Music", assignable: true } },
      { id: "20", snippet: { title: "Sports", assignable: true } },
      { id: "30", snippet: { title: "Hidden", assignable: false } },  
    ]);

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(await screen.findByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();

     
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  test("clicking a category dispatches setSelectedCategory, closes drawer, and navigates home", async () => {
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({ auth: { user: null } })
    );

    (fetchCategories as jest.Mock).mockResolvedValue([
      { id: "10", snippet: { title: "Music", assignable: true } },
    ]);

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const musicItem = await screen.findByText("Music");
    fireEvent.click(musicItem);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("clicking Profile navigates to /profile and closes drawer", async () => {
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({ auth: { user: null } })
    );

    (fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const profileItem = screen.getByText("Profile");
    fireEvent.click(profileItem);

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("clicking LOGOUT dispatches signOutAll, closes drawer, and navigates home", async () => {
    mockUseSelector.mockImplementation((selectorFn: any) =>
      selectorFn({
        auth: {
          user: { name: "vijay surya", email: "vijay@example.com" },
        },
      })
    );
     
    mockDispatch.mockResolvedValueOnce(undefined);
    (fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <SideDrawer open={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText("LOGOUT");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
       
      expect(signOutAll).toHaveBeenCalled();
       
      expect(mockOnClose).toHaveBeenCalled();
       
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });
});
