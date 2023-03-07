import "@testing-library/jest-dom/extend-expect";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { history, testRender as render } from "../utils/test.utils";

jest.mock("axios");

describe("DashboardNavbar Component Test", () => {
  it("should render the DashboardNavbar is properly rendered with sidebar closed", async () => {
    render(<DashboardNavbar />);

    expect(screen.getByText(/.*Log Dashboard*./i)).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    const sidebar = await screen.findByTestId("sidebar");
    expect(sidebar).not.toHaveClass("active");
  });

  it("should toggle sidebar", async () => {
    render(<DashboardNavbar />);
    const sidebar = await screen.findByTestId("sidebar");
    const showSidebarBtn = await screen.findByTestId("show-sidebar-btn");
    const closeSidebarBtn = await screen.findByTestId("close-sidebar-btn");
    await act(async () => {
      userEvent.click(showSidebarBtn);
    });
    await waitFor(() => expect(sidebar).toHaveClass("active"));
    await act(async () => {
      userEvent.click(closeSidebarBtn);
    });
    await waitFor(() => expect(sidebar).not.toHaveClass("active"));
  });

  it("should redirect to the login page after a successful logout", async () => {
    render(<DashboardNavbar />);

    const userDropdown = screen.getByTestId("navbar-user-dropdown");
    const userDropdownButton = within(userDropdown).getByRole("button");

    await userEvent.click(userDropdownButton);

    const logout = await screen.findByTestId("navbar-logout");
    userEvent.click(logout);

    // Check that we were redirected to the home page after login
    expect(history.location.pathname).toBe("/");
  });
});
