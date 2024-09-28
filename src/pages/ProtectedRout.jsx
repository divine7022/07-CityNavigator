import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRout({ children }) {
  const { isAutenticated } = useAuth();
  // console.log(isAuthenticated);
  const navigate = useNavigate();

  useEffect(
    function () {
      // console.log(isAuthenticated);
      if (!isAutenticated) navigate("/");
    },
    [isAutenticated, navigate]
  );

  return isAutenticated ? children : null;
}

export default ProtectedRout;
