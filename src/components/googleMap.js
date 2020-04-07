import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './map-components/mapMarker.jsx';
import { GetNewPosition } from '../services/google-location-svc.js';

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  static defaultProps = {
    center: {
      lat: 47.81579,
      lng: -122.307017,
    },
    zoom: 12,
  };

  async componentDidMount() {
    const result = await GetNewPosition(this.props.center.lat, this.props.center.lng, 100);
    this.setState({ result: result.data.records });
  }

  async onMarkerDragEnd(evt) {
    const result = await GetNewPosition(evt.center.lat(), evt.center.lng(), 100);
    this.setState({ result: result.data.records });
  }

  render() {
    const { result } = this.state;
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAPB7ER1lGxDSZICjq9lmqgxvnlSJCIuYw' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onDragEnd={(evt) => this.onMarkerDragEnd(evt)}
        >
          {result.map((data, index) => (
            <MapMarker
              key={index}
              lat={data.latitude} lng={data.longitude} text={index + 1} />
          ))}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
