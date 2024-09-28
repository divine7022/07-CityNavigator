import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAutenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAutenticated: true };
    case "logout":
      return { ...state, user: null, isAutenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

// Fake user which we created( but in real world we are getting this data from API)
// when ever we creat password we shoud create a strong password coz the browser can downlode everything what ever we write here then the hacker can get our password from the source password
const FAKE_USER = {
  name: "Akash",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

// context provider function
function AuthProvider({ children }) {
  const [{ user, isAutenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER }); // payload: FAKE_USER (this is gona be our login user)
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAutenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  // when we can get the error of the undefined? when we are trying to access the the context in the component if we didn't wraped in the <AuthProvider>< /AuthProvider>

  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
