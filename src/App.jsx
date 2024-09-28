import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRout from "./pages/ProtectedRout";

// these componnets should be before the dymaic import of pages.
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// these are pur six pages(we will Lazy loade this)
// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFond from "./pages/PageNotFond";

const Homepage = lazy(() => import("./pages/Homepage/"));
const Product = lazy(() => import("./pages/Product/"));
const Pricing = lazy(() => import("./pages/Pricing/"));
const Login = lazy(() => import("./pages/Login/"));
const AppLayout = lazy(() => import("./pages/AppLayout/"));
const PageNotFond = lazy(() => import("./pages/PageNotFond/"));

// dist/assets/index-2467670d.css   29.97 kB │ gzip:   5.08 kB
// dist/assets/index-5238a9ac.js   509.83 kB │ gzip: 148.86 kB

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  // why we wraped <ProtectedRout> to <AppLayout> ? coz to if we want to go citiyList then we should go from the AppLayout without AppLayout we can't go to cities or citylist or form etc(/app/cities).
                  // here we are checking wheather isAutentation is true or false based on that we display the UI/render the component
                  <ProtectedRout>
                    <AppLayout />
                  </ProtectedRout>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                {/*meanas When ever the url takes this shape then it will render City componet which matches with this path*/}
                <Route path="contries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFond />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
