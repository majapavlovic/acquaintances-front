import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";

const PersonForm = () => {
  const [editing, setEditing] = useState(false);
  const { jmbg } = useParams();
  const [error, setError] = useState("");
  const [personData, setPersonData] = useState({
    jmbg: "",
    name: "",
    surname: "",
    birthdate: "",
    ageInMonths: 0,
    heightInCm: 0,
    cityOfBirth: 0,
    residence: 0,
  });
  const [cities, setCities] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/tps/city")
      .then((response) => setCities(response.data))
      .catch((error) =>
        console.error("There was an error fetching cities!", error)
      );
  }, []);

  useEffect(() => {
    if (jmbg) {
      setEditing(true);
      axios
        .get(`http://localhost:8080/api/v2/tps/person/jmbg/${jmbg}`)
        .then((response) => {
          handlePersonData(response.data);
        })
        .catch((error) =>
          console.error("There was an error fetching the person!", error)
        );
    }
  }, [jmbg]);

  const handlePersonData = (data) => {
    setPersonData({
      id: data.id,
      jmbg: data.jmbg,
      name: data.name,
      surname: data.surname,
      birthdate: data.birthdate,
      ageInMonths: data.ageInMonths,
      heightInCm: data.heightInCm,
      cityOfBirth: data.cityOfBirth.id,
      residence: data.residence.id,
    });
  };

  const handleChange = (name, value) => {
    setError("");
    const updatedData = { ...personData, [name]: value };
    setPersonData(updatedData);
  };

  const handleSubmit = (e) => {
    const { message, valid } = isValidInput();
    if (valid) {
      const url = editing
        ? `http://localhost:8080/api/v2/tps/person/id/${personData.id}`
        : `http://localhost:8080/api/v2/tps/person`;
      const method = editing ? "put" : "post";

      axios({
        method,
        url,
        data: personData,
      })
        .then(() => {
          history.push("/");
        })
        .catch((error) => {
          const { code, message } = error.response.data;
          setError(`Doslo je do greske: ${code}, ${message}`);
        });
    } else {
      setError(`Nevalidan unos: ${message}`);
    }
  };

  const isValidInput = () => {
    const {
      jmbg,
      name,
      surname,
      birthdate,
      ageInMonths,
      heightInCm,
      cityOfBirth,
      residence,
    } = personData;

    let ret = { message: "", valid: true };

    if (
      jmbg === "" ||
      name === "" ||
      surname === "" ||
      birthdate === "" ||
      ageInMonths === 0 ||
      heightInCm === 0 ||
      cityOfBirth === 0 ||
      residence === 0
    ) {
      ret.message += "Svi podaci moraju biti popunjeni.";
      ret.valid = false;
    }

    if (heightInCm < 70 || heightInCm > 230) {
      ret.message += "Minimalna visina je 70cm, a maksimalna 230cm.";
      ret.valid = false;
    }

    if (ageInMonths < 0) {
      ret.message += "Starost u mesecima mora biti pozitivna vrednost";
      ret.valid = false;
    }

    return ret;
  };

  return (
    <div className='container mt-4'>
      <h1 className='text-center mb-4'>
        {editing ? "Edit Person" : "Add Person"}
      </h1>

      {error && <Alert variant='danger'>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <table className='table table-striped table-hover'>
          <tbody>
            <tr>
              <td>
                <label htmlFor='jmbg'>JMBG:</label>
              </td>
              <td>
                <input
                  type='text'
                  id='jmbg'
                  name='jmbg'
                  value={personData.jmbg}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='name'>Ime:</label>
              </td>
              <td>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={personData.name}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='surname'>Prezime:</label>
              </td>
              <td>
                <input
                  type='text'
                  id='surname'
                  name='surname'
                  value={personData.surname}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='birthdate'>Datum rodjenja:</label>
              </td>
              <td>
                <input
                  type='date'
                  id='birthdate'
                  name='birthdate'
                  value={personData.birthdate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='ageInMonths'>Starost u mesecima:</label>
              </td>
              <td>
                <input
                  type='number'
                  id='ageInMonths'
                  name='ageInMonths'
                  value={personData.ageInMonths}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='heightInCm'>Visina:</label>
              </td>
              <td>
                <input
                  type='number'
                  id='heightInCm'
                  name='heightInCm'
                  value={personData.heightInCm}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='cityOfBirth'>Mesto rodjenja:</label>
              </td>
              <td>
                <select
                  id='cityOfBirth'
                  name='cityOfBirth'
                  value={personData.cityOfBirth}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                >
                  <option value={0}>Odaberi grad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='residence'>Prebivaliste:</label>
              </td>
              <td>
                <select
                  id='residence'
                  name='residence'
                  value={personData.residence}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                >
                  <option value={0}>Odaberi grad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className='text-center'>
        <button
          className='btn btn-primary'
          type='submit'
          onClick={handleSubmit}
        >
          {editing ? "Update" : "Add"} Person
        </button>
      </div>
    </div>
  );
};

export default PersonForm;
