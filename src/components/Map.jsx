import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  // const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams] = useSearchParams();
  //here destructring the values from the useGeolocation() which we exported in the useGeolocation.js and then here we are renaming it to make it more sence
  const {
    isLoading: isLoadingPosition,
    position: geolocationPositon,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPositon)
        setMapPosition([geolocationPositon.lat, geolocationPositon.lng]);
    },
    [geolocationPositon]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPositon && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loding..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap(); // this  hook is given by the leaflet
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate(); // it return a function called navigate, using that function we can navigate to specified component
  useMapEvents(
    {
      click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    } // here we created a querey string(i,e to display in url)
  ); // it a path of the Form component, which we given in the < Routs > in App.jsx
}

export default Map;
