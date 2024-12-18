import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Router, MemoryRouter, Route } from "react-router-dom";
import PersonForm from "./PersonForm";
import { createMemoryHistory } from "history";

const mock = new MockAdapter(axios);

describe("PersonForm", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("fetches and displays cities", async () => {
    const history = createMemoryHistory();

    mock.onGet("http://localhost:8080/api/v1/tps/city").reply(200, [
      {
        id: 1,
        name: "Beograd",
        ptt: 11000,
        regionCode: "71",
        citizens: 1382000,
      },
      {
        id: 2,
        name: "Kragujevac",
        ptt: 34000,
        regionCode: "72",
        citizens: 147786,
      },
    ]);

    render(
      <Router history={history}>
        <PersonForm />
      </Router>
    );

    const cityBirthSelect = await screen.findByLabelText(/Mesto rodjenja:/i);
    const cityResidenceSelect = await screen.findByLabelText(/Prebivaliste:/i);

    expect(cityBirthSelect).toBeInTheDocument();
    expect(cityBirthSelect).toHaveTextContent("Odaberi grad");

    await waitFor(() => {
      expect(cityBirthSelect).toHaveTextContent("Beograd");
      expect(cityBirthSelect).toHaveTextContent("Kragujevac");
    });

    expect(cityResidenceSelect).toBeInTheDocument();
    expect(cityResidenceSelect).toHaveTextContent("Odaberi grad");

    await waitFor(() => {
      expect(cityResidenceSelect).toHaveTextContent("Beograd");
      expect(cityResidenceSelect).toHaveTextContent("Kragujevac");
    });
  });

  it("handles form submission for adding a person", async () => {
    const history = createMemoryHistory();
    mock.onPost("http://localhost:8080/api/v2/tps/person").reply(200, {});

    mock.onGet("http://localhost:8080/api/v1/tps/city").reply(200, [
      {
        id: 1,
        name: "Beograd",
        ptt: 11000,
        regionCode: "71",
        citizens: 1382000,
      },
      {
        id: 2,
        name: "Kragujevac",
        ptt: 34000,
        regionCode: "72",
        citizens: 147786,
      },
    ]);

    render(
      <Router history={history}>
        <PersonForm />
      </Router>
    );

    const cityBirthSelect = await screen.findByLabelText(/Mesto rodjenja:/i);
    const cityResidenceSelect = await screen.findByLabelText(/Prebivaliste:/i);

    expect(cityBirthSelect).toBeInTheDocument();
    expect(cityBirthSelect).toHaveTextContent("Odaberi grad");

    await waitFor(() => {
      expect(cityBirthSelect).toHaveTextContent("Beograd");
      expect(cityBirthSelect).toHaveTextContent("Kragujevac");
    });

    expect(cityResidenceSelect).toBeInTheDocument();
    expect(cityResidenceSelect).toHaveTextContent("Odaberi grad");

    await waitFor(() => {
      expect(cityResidenceSelect).toHaveTextContent("Beograd");
      expect(cityResidenceSelect).toHaveTextContent("Kragujevac");
    });

    fireEvent.change(screen.getByLabelText(/JMBG:/i), {
      target: { value: "1906977714551" },
    });
    fireEvent.change(screen.getByLabelText(/Ime:/), {
      target: { value: "Marko" },
    });
    fireEvent.change(screen.getByLabelText(/Prezime:/i), {
      target: { value: "Markovic" },
    });
    fireEvent.change(screen.getByLabelText(/Datum rodjenja:/i), {
      target: { value: "1977-06-19" },
    });
    fireEvent.change(screen.getByLabelText(/Starost u mesecima:/i), {
      target: { value: "569" },
    });
    fireEvent.change(screen.getByLabelText(/Visina:/i), {
      target: { value: "180" },
    });

    fireEvent.change(cityBirthSelect, { target: { value: 1 } });
    fireEvent.change(cityResidenceSelect, { target: { value: 2 } });

    fireEvent.click(screen.getByRole("button", { name: /Add Person/i }));

    await waitFor(() => expect(mock.history.post.length).toBe(1));

    const postData = JSON.parse(mock.history.post[0].data);
    expect(postData).toEqual({
      jmbg: "1906977714551",
      name: "Marko",
      surname: "Markovic",
      birthdate: "1977-06-19",
      ageInMonths: "569",
      heightInCm: "180",
      cityOfBirth: "1",
      residence: "2",
    });
  });

  it("shows validation errors for invalid input", async () => {
    const history = createMemoryHistory();

    mock.onGet("http://localhost:8080/api/v1/tps/city").reply(200, [
      {
        id: 1,
        name: "Beograd",
        ptt: 11000,
        regionCode: "71",
        citizens: 1382000,
      },
      {
        id: 2,
        name: "Kragujevac",
        ptt: 34000,
        regionCode: "72",
        citizens: 147786,
      },
    ]);

    render(
      <Router history={history}>
        <PersonForm />
      </Router>
    );

    const cityBirthSelect = await screen.findByLabelText(/Mesto rodjenja:/i);
    const cityResidenceSelect = await screen.findByLabelText(/Prebivaliste:/i);

    expect(cityBirthSelect).toBeInTheDocument();
    expect(cityResidenceSelect).toBeInTheDocument();

    await waitFor(() => {
      expect(cityBirthSelect).toHaveTextContent("Beograd");
      expect(cityBirthSelect).toHaveTextContent("Kragujevac");
      expect(cityResidenceSelect).toHaveTextContent("Beograd");
      expect(cityResidenceSelect).toHaveTextContent("Kragujevac");
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Person/i }));

    await waitFor(() =>
      expect(screen.queryByText(/Nevalidan unos/i)).toBeInTheDocument()
    );
  });

  it("displays 'Add Person' when no JMBG is provided (Add Mode)", async () => {
    mock.onGet("http://localhost:8080/api/v1/tps/city").reply(200, [
      {
        id: 1,
        name: "Beograd",
        ptt: 11000,
        regionCode: "71",
        citizens: 1382000,
      },
      {
        id: 2,
        name: "Kragujevac",
        ptt: 34000,
        regionCode: "72",
        citizens: 147786,
      },
      ,
    ]);

    render(
      <MemoryRouter initialEntries={["/add"]}>
        <Route path='/add'>
          <PersonForm />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add person/i })
      ).toBeInTheDocument();
    });
  });

  it("displays 'Update Person' when JMBG is provided (Edit Mode)", async () => {
    const jmbg = "1906977714551";

    mock.onGet("http://localhost:8080/api/v1/tps/city").reply(200, [
      {
        id: 1,
        name: "Beograd",
        ptt: 11000,
        regionCode: "71",
        citizens: 1382000,
      },
      {
        id: 2,
        name: "Kragujevac",
        ptt: 34000,
        regionCode: "72",
        citizens: 147786,
      },
    ]);

    mock
      .onGet(`http://localhost:8080/api/v2/tps/person/jmbg/${jmbg}`)
      .reply(200, {
        id: 1,
        jmbg,
        name: "Marko",
        surname: "Markovic",
        birthdate: "1977-06-19",
        ageInMonths: 569,
        heightInCm: 180,
        cityOfBirth: {
          id: 1,
          name: "Beograd",
          ptt: 11000,
          regionCode: "71",
          citizens: 1382000,
        },
        residence: {
          id: 2,
          name: "Kragujevac",
          ptt: 34000,
          regionCode: "72",
          citizens: 147786,
        },
      });

    render(
      <MemoryRouter initialEntries={[`/edit/${jmbg}`]}>
        <Route path='/edit/:jmbg'>
          <PersonForm />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Update Person/i })
      ).toBeInTheDocument();
    });
  });
});
