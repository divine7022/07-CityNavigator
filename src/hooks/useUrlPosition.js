import { useSearchParams } from "react-router-dom";

//as long as our logic has at least one react hook we need to create our own custom hook if we want to reuse that logic

// when ever we want the position form  the url then just call this function so that it provides a lat and lng from the url (the lat and lng will be added to the url when we click on the map)
export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat"); // searchParams are used to get the data of lat and lng that is in the url
  const lng = searchParams.get("lng");

  return [lat, lng];
}
