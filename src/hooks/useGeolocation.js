import { useState } from "react";
// with this we can then use to getPosition function on any button to retrive the curret position of our user.
export function useGeolocation(defaultPostition = null) {
  // this mean that if we didn't get Position then the value of position(that empty object will set to null)[which will default to null if it not set]
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPostition); // which will default to null if it not set.
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
