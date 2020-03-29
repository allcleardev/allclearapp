import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/styles";
<<<<<<< HEAD

import MapGL from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import location_data from '../data/locations'

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmF2ZWVkbiIsImEiOiJjazg4aWRkczMwNXQxM21rOWFrbGVvNWtpIn0.-k1i0cSw_C5_0aKPlFFtLA";

let location = location_data;
=======
import { Map, Marker, Popup, TileLayer, MapControl, withLeaflet } from "react-leaflet";
import './map.css'
import locations from '../hooks/airtable'
import GeoSearch from './map-components/geosearch';
import LocateControl from './map-components/userlocation';

function MapPoint(props) {
  return (
    <Marker position={[props.Latitude, props.Longitude]} key={props.idx}>
      <Popup>
        Name: {props.Name} <br />
        Address: {props.Address} <br />
        Appointment Needed: {props['Appointment Needed']} <br />
        Drive Through: {props['Drive Through']} <br />
        Website: {props['Main Website']} <br />
      </Popup>
    </Marker>
  )
}
>>>>>>> a5c144f... Adds current location to map

export default function MapComponent(props) {
    const useStyles = makeStyles(theme => ({
      frame: {
        marginTop: "2%"
      }
    }));
    
    const { children, value, index, ...other } = props;
    const styles = useStyles();
    const [viewport, setViewport] = useState({
      latitude: 40.71427,
      longitude: -74.00597,
      zoom: 14,
      bearing: 0,
      pitch: 0
    });
  
    return (
<<<<<<< HEAD
      <Container className={styles.frame} hidden={value !== index} id={`tabpanel-${index}`}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item>
            <MapGL
              {...viewport}
              width="80vw"
              height="70vh"
  
              className={styles.frame}
              mapStyle="mapbox://styles/mapbox/dark-v9"
              onViewportChange={setViewport}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
          </Grid>
        </Grid>
      </Container>
=======
      <Map center={[viewport.latitude, viewport.longitude]} zoom={viewport.zoom} id={`tabpanel-${index}`}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoSearch />
        <LocateControl/>

        {locations.getAll().map((x, idx) => MapPoint({...x, idx}))}
      </Map>
>>>>>>> a5c144f... Adds current location to map
    );
  }