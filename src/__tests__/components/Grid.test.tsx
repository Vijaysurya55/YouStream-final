import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Grids from "../../Components/Grid";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("moment", () => {
  const fn = (date) => ({
    fromNow: () => "a few seconds ago",
  });
  return {
    __esModule: true,   
    default: fn,
  };
});


Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

const sampleVideos = [
  {
    id: "video1",
    snippet: {
      title: "Sample Video",
      channelTitle: "Sample Channel",
      publishedAt: "2024-01-01T00:00:00Z",
      thumbnails: {
        high: { url: "http://sampleurl.com/thumb.jpeg" },
      },
    },
    statistics: {
      viewCount: "1500", 
    },
  },
];

describe("Grids component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (window.scrollTo as jest.Mock).mockClear();
  });

  test("renders video cards with title, channel and formatted views", () => {
    render(<Grids videos={sampleVideos} />);

    expect(screen.getByText("Sample Video")).toBeInTheDocument();

    expect(screen.getByText(/Channel: Sample Channel/i)).toBeInTheDocument();

    expect(
      screen.getByText("1.5K views • a few seconds ago")
    ).toBeInTheDocument();
  });

  test("navigates to watch page and scrolls to top on card click", () => {
    render(<Grids videos={sampleVideos} />);

    const card = screen.getByText("Sample Video").closest("div");
    
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/watch/video1");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("matches snapshot", () => {
    const { asFragment } = render(<Grids videos={sampleVideos} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
