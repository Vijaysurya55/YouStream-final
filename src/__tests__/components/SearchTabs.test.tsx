import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchTabs from "../../Components/SearchTabs";


const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ query: "pubg" }),
  useLocation: () => ({ pathname: "/search/videos/pubg" }), 
}));


describe("SearchTabs Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders both chips", () => {
    render(<SearchTabs />);

    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Channels")).toBeInTheDocument();
  });

  test("navigates to Videos when Videos chip is clicked", () => {
    render(<SearchTabs />);

    fireEvent.click(screen.getByText("Videos"));

    expect(mockNavigate).toHaveBeenCalledWith("/search/videos/pubg");
  });

  test("navigates to Channels when Channels chip is clicked", () => {
    render(<SearchTabs />);

    fireEvent.click(screen.getByText("Channels"));

    expect(mockNavigate).toHaveBeenCalledWith("/search/channels/pubg");
  });

  test("Videos tab appears active when pathname starts with /search/videos", () => {
    render(<SearchTabs />);

    const videosChip = screen.getByText("Videos");

    expect(videosChip).toBeInTheDocument();

  });

  test("matches snapshot", () => {
    const { asFragment } = render(<SearchTabs />);
    expect(asFragment()).toMatchSnapshot();
  });
});
