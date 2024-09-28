import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES

  // this email and the email in the FAKE_USER should be same coz we will check in the FakeAuthContext.jsx
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAutenticated } = useAuth();

  //Programatic navigation
  const navigate = useNavigate();

  function handleSubmit(e) {
    // when ever you use onSubmit use preventDefault coz to prevent the page from reloding
    e.preventDefault();

    if (email && password) login(email, password);
  }

  // here no need of using useEffect coz as of now we have hard coded the user credientials(details) but in real project it should be fetch form the API. so here we are using useEffect
  useEffect(
    function () {
      if (isAutenticated) navigate("/app", { replace: true }); // this reapalce object coz once this navigation happens it will replace the login page in history stack with previous visited page(means after we login and go to ./app page if we go back then it will go back to the page where we were prevesly before the login page) [this is part is very important to make the browser work normally]
    },
    [isAutenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
