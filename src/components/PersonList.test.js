import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import PersonList from "./PersonList";
import { BrowserRouter as Router } from "react-router-dom";

const mock = new MockAdapter(axios);

describe("PersonList", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("renders person list from API", async () => {
    mock.onGet("http://localhost:8080/api/v1/tps/person").reply(200, [
      {
        id: 1,
        jmbg: "1906977714551",
        name: "Marko",
        surname: "Markovic",
        birthdate: "1977-06-19",
        ageInMonths: 569,
        heightInCm: 187,
        cityOfBirth: {
          citizens: 1382000,
          ptt: 11000,
          id: 1,
          name: "Beograd",
          regionCode: "71",
        },
        residence: {
          id: 2,
          name: "Kragujevac",
          ptt: 34000,
          regionCode: "72",
          citizens: 147786,
        },
      },
    ]);

    render(
      <Router>
        <PersonList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Marko/i)).toBeInTheDocument();
      expect(screen.getByText(/Markovic/i)).toBeInTheDocument();
      expect(screen.getByText(/1977-06-19/i)).toBeInTheDocument();
      expect(screen.getByText(/569/i)).toBeInTheDocument();
      expect(screen.getByText(/Beograd/i)).toBeInTheDocument();
      expect(screen.getByText(/Kragujevac/i)).toBeInTheDocument();
    });
  });

  it("handles delete person action", async () => {
    const deleteId = 1;

    mock.onGet("http://localhost:8080/api/v1/tps/person").reply(200, [
      {
        id: 1,
        jmbg: "1906977714551",
        name: "Marko",
        surname: "Markovic",
        birthdate: "1977-06-19",
        ageInMonths: 569,
        heightInCm: 187,
        cityOfBirth: {
          citizens: 1382000,
          ptt: 11000,
          id: 1,
          name: "Beograd",
          regionCode: "71",
        },
        residence: {
          id: 2,
          name: "Kragujevac",
          ptt: 34000,
          regionCode: "72",
          citizens: 147786,
        },
      },
    ]);

    mock
      .onDelete(`http://localhost:8080/api/v2/tps/person/id/${deleteId}`)
      .reply(200);

    render(
      <Router>
        <PersonList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Marko Markovic/i)).toBeInTheDocument();
    });

    window.confirm = jest.fn().mockReturnValue(true);

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mock.history.delete.length).toBe(1);
      expect(mock.history.delete[0].url).toBe(
        `http://localhost:8080/api/v2/tps/person/id/${deleteId}`
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/Marko Markovic/i)).not.toBeInTheDocument();
    });
  });

  it("handles add person action", async () => {
    mock.onGet("http://localhost:8080/api/v1/tps/person").reply(200, [
      {
        id: 1,
        jmbg: "1906977714551",
        name: "Marko",
        surname: "Markovic",
        birthdate: "1977-06-19",
        ageInMonths: 569,
        heightInCm: 187,
        cityOfBirth: {
          citizens: 1382000,
          ptt: 11000,
          id: 1,
          name: "Beograd",
          regionCode: "71",
        },
        residence: {
          id: 2,
          name: "Kragujevac",
          ptt: 34000,
          regionCode: "72",
          citizens: 147786,
        },
      },
    ]);
    render(
      <Router>
        <PersonList />
      </Router>
    );
    const addButton = screen.getByText(/Add New Person/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/add");
    });
  });

  afterEach(() => {
    mock.reset();
  });
});
