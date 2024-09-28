import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="cities">Cities</NavLink>{" "}
          {/*again we specifying the same path that we written the App.jsx*/}
        </li>
        <li>
          <NavLink to="contries">Contries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
