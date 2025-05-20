import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const Routing = ({ points, color }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) {
            console.warn("Map is not defined");
            return;
        }

        if (!points || points.length < 2) {
            console.warn("Invalid points for routing:", points);
            return;
        }

        const routingControl = L.Routing.control({
            waypoints: points.map(p => L.latLng(p.lat, p.lon)),
            lineOptions: {
                styles: [{ color: color || "blue", weight: 5 }]
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: () => null
            
        }).addTo(map);

        return () => {
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [points, color, map]);

    return null;
};

export default Routing;