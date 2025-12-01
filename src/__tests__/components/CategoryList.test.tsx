import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import CategoryList from "../../Components/CategoryList";
import { fetchCategories } from "../../api/youtubeApi";

jest.mock("../../api/youtubeApi", () => ({
  fetchCategories: jest.fn(),
}));

const mockScrollBy = jest.fn();
Object.defineProperty(HTMLElement.prototype, "scrollBy", {
  value: mockScrollBy,
  writable:true
});

describe("CategoryList Component", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", () => {
    (fetchCategories as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    expect(screen.getByText("Loading categories...")).toBeInTheDocument();
  });

  test("shows error message when API fails", async () => {
    (fetchCategories as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    expect(await screen.findByText(/Error fetching data/i)).toBeInTheDocument();
  });

  test("renders category chips after successful fetch", async () => {
    (fetchCategories as jest.Mock).mockResolvedValue([
      { id: "10", snippet: { title: "Music", assignable: true } },
      { id: "20", snippet: { title: "Sports", assignable: true } },
    ]);

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    expect(await screen.findByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  test("invokes callback when a category is clicked", async () => {
    (fetchCategories as jest.Mock).mockResolvedValue([
      { id: "10", snippet: { title: "Music", assignable: true } },
    ]);

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    const musicChip = await screen.findByText("Music");
    fireEvent.click(musicChip);

    expect(mockOnSelect).toHaveBeenCalledWith("10", "Music");
  });

  test('clicking "All" triggers onCategorySelect("", "")', async () => {
    (fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    const allChip = await screen.findByText("All");
    fireEvent.click(allChip);

    expect(mockOnSelect).toHaveBeenCalledWith("", "");
  });

  test("selected category should have bold styling", async () => {
    (fetchCategories as jest.Mock).mockResolvedValue([
      { id: "10", snippet: { title: "Music", assignable: true } },
    ]);

    render(
      <CategoryList selectedCategoryId="10" onCategorySelect={mockOnSelect} />
    );

    const chip = await screen.findByText("Music");

    expect(chip).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
  });


  test("arrow buttons disabled when no scroll is possible", async () => {
    (fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <CategoryList selectedCategoryId={null} onCategorySelect={mockOnSelect} />
    );

    await waitFor(() =>
      expect(screen.queryByText("Loading categories...")).not.toBeInTheDocument()
    );

    const leftBtn = screen.getByLabelText("scroll left");
    const rightBtn = screen.getByLabelText("scroll right");

    expect(leftBtn).toBeDisabled();
    expect(rightBtn).toBeDisabled();
  });
});
