import "@testing-library/jest-dom/extend-expect";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AddSourceModalForm from "../components/AddSourceModalForm";
import { history, testRender as render } from "../utils/test.utils";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

jest.mock("axios");
let show = true;
function onHide() {
  show = false;
}
describe("DashboardNavbar Component Test", () => {
  it("should render the name input on show true", async () => {
    render(<AddSourceModalForm show={true} onHide={onHide} />);

    const name = await screen.findByTestId("name");

    expect(name).toBeInTheDocument();
  });
  it("should not render the name input on show false", async () => {
    render(<AddSourceModalForm show={false} onHide={onHide} />);

    const name = screen.queryByPlaceholderText("Source name");

    expect(name).not.toBeTruthy();
  });
  it("should update the username and password values when input changes", async () => {
    render(<AddSourceModalForm show={true} onHide={onHide} />);

    const name = await screen.findByTestId("name");
    userEvent.type(name, "testSource");

    await waitFor(() => expect(name.value).toBe("testSource"));
  });

  it("should show error on character less than 2", async () => {
    render(<AddSourceModalForm show={true} onHide={onHide} />);
    const name = await screen.findByTestId("name");
    const addButton = screen.getByText("ADD");
    await act(async () => {
      await userEvent.type(name, "t");
      // Submit form
      userEvent.click(addButton);
    });
    expect(
      screen.getAllByText(
        /.*Too Short! Minimun legth is 2 characters long*/i
      )[0]
    ).toBeInTheDocument();
  });

  it("should show success message", async () => {
    render(<AddSourceModalForm show={true} onHide={onHide} />);
    const name = await screen.findByTestId("name");
    const addButton = screen.getByText("ADD");
    await act(async () => {
      await userEvent.type(name, "t");
      // Submit form
      userEvent.click(addButton);
    });
    expect(
      screen.getAllByText(
        /.*Too Short! Minimun legth is 2 characters long*/i
      )[0]
    ).toBeInTheDocument();
  });
});

