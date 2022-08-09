import React from 'react'
import { Circle, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
const geolib = require('geolib');
const containerStyle = {
  width: '800px',
  height: '800px'
};


function Map() {
  const [lat, setLat]=React.useState(19.0296441);
  const [lng, setLng]=React.useState(73.0166434);
  const [curLat,setCurLat]=React.useState(null);
  const[curLng,setCurLng]=React.useState(null);
  const [radius,setRadius]=React.useState(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBoZFGXOCwer9dv34IPMOhFqlApLBQtprs"
  })

  function submitRadius(){
    var x=document.getElementById('rad').value;
    console.log(x);
    setRadius(parseInt(x));
  }
  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {

    const bounds = new window.google.maps.LatLngBounds({lat,lng});
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getLocation=(e)=>{
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
    
  }

  function calcDistance(){
    var x=geolib.getDistance({ latitude: lat, longitude: lng }, { latitude: curLat, longitude: curLng, }, 0.5) - radius
    if(x>=0){
      alert("You are outside the permitted range by "+x+" meters");
    }
    else if (x<0) {
      alert("You are within the permitted range, the attendence will be marked.")
    }
    else{
      alert("Invalid Input.")
    }
  }

  return isLoaded ? (
    <>
    <h1>Attendance Range Checker Demo</h1>
    <h2>Admin Part</h2>
      <GoogleMap
          onClick={getLocation}
          mapContainerStyle={containerStyle}
          center={{lat,lng}}
          zoom={20}
          onLoad={onLoad}
          onUnmount={onUnmount}
      >
          <Marker
            position={{lat,lng}}>
          </Marker>

          <Circle
            center={{lat,lng}}
            radius={radius}>
          </Circle>

          <Marker
          position={{lat:curLat,lng:curLng}}>

          </Marker>
      </GoogleMap>
      <input id='rad' type='text' placeholder='Enter the Event Radius'></input>
      <button type='submit' onClick={submitRadius}>Submit</button>
      <h2>Student Part</h2>
      <div style={{paddingTop:'50px'}}>
        <button onClick={
          navigator.geolocation.getCurrentPosition(function(position) {
            setCurLat(position.coords.latitude);
            setCurLng(position.coords.longitude);
          })
        }>Get Current Location</button>
      </div>

      <div style={{paddingTop:'50px'}}>
        <button onClick={calcDistance}>Mark Attendance</button>
      </div>
      </>
  ) : <></>
}

export default React.memo(Map)