import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:9001";
//1) creating cities context by calling createContext() function comming from the react
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

// this handles all the logics and state transitions(reducers need to be pure function)[i,e we cannot do api requests inside the reducre function ]
function reducer(state, action) {
  // give the name of the case as relevent to events not as states(imp to follow in big project)
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    // case 'citiesLoading' (we can do this also but redux community follow this)
    case "cities/loading":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
        error: "",
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

//2) Now we need to create Provider component( it need to accept the childeren prop)
function CitiesProvider({ children }) {
  // const [state, dispatch] = useReducer(reducer, initialState)
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // we putting here all the state and state updating logic which earlier in the App.jsx
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loading", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      // use of this line is when click no some city in a city list for first time it will take time and load from the API and the details about that city but if you come back to city list and again click on the same city then it dosn't load from the API it immidetly open coz the id of opend city is stored in the currentCity so it is not necessary to load it again form the API.
      if (id === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading city...",
        });
      }
    },
    [currentCity.id]
  );

  // stander method to create post reqest to an API(Basiclly to send data to an API)
  // it will update/ mutate the server state(it will update the cities.json file the newAdded city)
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      // updating the UI state so that new object immidetly get reflected in our UI otherwise we manually refresh the page to update the new object to UI
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  // Deleting city on clicking the button
  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // updating the UI state so that new object immidetly get reflected in our UI otherwise we manually refresh the page to update the new object to UI
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  // here in value we are using another(two curly bracses) coz that is for object
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
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
