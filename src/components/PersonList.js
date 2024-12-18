import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const PersonList = () => {
  const [persons, setPersons] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/tps/person")
      .then((response) => setPersons(response.data))
      .catch((error) =>
        console.error("There was an error fetching persons!", error)
      );
  }, []);

  const handleUpdatePerson = (jmbg) => {
    history.push(`/edit/${jmbg}`);
  };

  const handleDeletePerson = (id) => {
    const confirmDelete = window.confirm("Da li ste sigurni?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:8080/api/v2/tps/person/id/${id}`)
      .then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id)
        );
      })
      .catch((error) =>
        console.error("There was an error deleting the person!", error)
      );
  };

  const handleAddPerson = () => {
    history.push("/add");
  };

  return (
    <div className='container mt-4'>
      <h1 className='text-center mb-4'>Podaci o poznanicima</h1>
      <table className='table table-striped table-hover'>
        <thead className='thead-dark'>
          <tr>
            <th>JMBG</th>
            <th>Ime i prezime</th>
            <th>Datum rodjenja</th>
            <th>Starost u mesecima</th>
            <th>Visina [cm]</th>
            <th>Mesto rodjenja</th>
            <th>Prebivaliste</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>{person.jmbg}</td>
              <td>
                {person.name} {person.surname}
              </td>
              <td>{person.birthdate}</td>
              <td>{person.ageInMonths}</td>
              <td>{person.heightInCm}</td>
              <td>{person.cityOfBirth.name}</td>
              <td>{person.residence.name}</td>
              <td>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() => handleUpdatePerson(person.jmbg)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => handleDeletePerson(person.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='text-center'>
        <button className='btn btn-primary' onClick={handleAddPerson}>
          Add New Person
        </button>
      </div>
    </div>
  );
};

export default PersonList;
