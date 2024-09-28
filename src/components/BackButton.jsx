import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();
  return (
    //* -1 means navigate to the back history*/
    <Button
      type="back"
      onClick={(e) => {
        //it prevent the button from submiting the form (which we want to go back to previous history)
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
