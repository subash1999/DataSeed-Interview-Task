import { fireEvent, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import LoginPage from "../pages/LoginPage";
import { testRender as render, history, fakeLoginAPIResponse } from "../utils/test.utils";
jest.mock("axios");

describe("LoginPage", () => {
  it("should render the username and password input", () => {
    render(<LoginPage />);

    const usernameLabel = screen.getByLabelText("Username");
    const passwordLabel = screen.getByLabelText("Password");

    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  it("should update the username and password values when input changes", async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    await waitFor(() => expect(usernameInput.value).toBe("testuser"));
    await waitFor(() => expect(passwordInput.value).toBe("testpassword"));
  });

  it("should show client side validation error for username and password", async () => {
    render(<LoginPage />);

    const usernameInput = await screen.findByLabelText("Username");
    const passwordInput = await screen.findByLabelText("Password");
    const loginButton = await screen.findByRole("button");

    fireEvent.change(usernameInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    userEvent.click(loginButton);

    await waitFor(() =>
      expect(screen.getAllByText(/.*username is required.*/i).length).toBe(1)
    );
    await waitFor(() =>
      expect(screen.getAllByText(/.*password is required.*/i).length).toBe(1)
    );
    await waitFor(() =>
      expect(
        screen.getAllByText(/.*username is required.*/i)[0]
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.getAllByText(/.*password is required.*/i)[0]
      ).toBeInTheDocument()
    );

    fireEvent.change(usernameInput, { target: { value: "a" } });
    fireEvent.change(passwordInput, { target: { value: "a" } });
    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(
        screen.getAllByText(/.*Too Short! Minimun legth is 2 characters long*/i)
          .length
      ).toBe(2)
    );
    await waitFor(() =>
      expect(
        screen.getAllByText(
          /.*Too Short! Minimun legth is 2 characters long*/i
        )[0]
      ).toBeInTheDocument()
    );
  });

  it("should redirect to the home page (root url) after a successful login", async () => {
    // Set up mock API response
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost("/auth/token/").reply(200, fakeLoginAPIResponse);

    render(
      
        <LoginPage />
 
    );

    // Fill in form fields with valid data
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "admin" },
    });

    const loginButton = await screen.findByRole("button");
    await act(async () => {
    // Submit form
    fireEvent.click(loginButton);
    });

    // Check that we were redirected to the home page, root url
    expect(history.location.pathname).toBe("/");
  });
});
