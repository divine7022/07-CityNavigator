import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:9001";

//1) creating cities context by calling createContext() function comming from the react
const CitiesContext = createContext();

//2) Now we need to create Provider component( it need to accept the childeren prop)

function CitiesProvider({ children }) {
  // we putting here all the state and state updating logic which earlier in the App.jsx
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was an error loading data...");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  }

  // stander method to create post reqest to an API(Basiclly to send data to an API)
  // it will update/ mutate the server state(it will update the cities.json file the newAdded city)
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      // updating the UI state so that new object immidetly get reflected in our UI otherwise we manually refresh the page to update the new object to UI
      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was an error creating city...");
    } finally {
      setIsLoading(false);
    }
  }

  // Deleting city on clicking the button
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // updating the UI state so that new object immidetly get reflected in our UI otherwise we manually refresh the page to update the new object to UI
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deleting city...");
    } finally {
      setIsLoading(false);
    }
  }

  // here in value we are using another(two curly bracses) coz that is for object
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the Citiesprovider");
  return context;
}

export { CitiesProvider, useCities };
