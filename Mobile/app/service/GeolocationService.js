import {bsasBoundaryPoints} from '../config/locationProperties'
import {Permissions, Location} from 'expo';
import {Alert} from "react-native";

class GeolocationService {

  /**
   * Get region object from an array of points of a square.
   *
   * @param points array [minX, maxX, minY, maxY]; each point :: {{latitude:number, longitude: float}}
   * @returns {{latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number}}
   */
  regionContainingPoints(points) {
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    let midX = (minX + maxX) / 2;
    let midY = (minY + maxY) / 2;
    let midPoint = [midX, midY];

    let deltaX = (maxX - minX);
    let deltaY = (maxY - minY);

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  }

  /**
   * Get BsAs City region.
   *
   * @returns {{latitude, longitude, latitudeDelta, longitudeDelta}|*}
   */
  getBsAsRegion() {
    return this.regionContainingPoints(bsasBoundaryPoints);
  }

  /**
   * Persistently request Location permission to user.
   *
   * If not accepted, will display an Alert (react-native) error message
   * and try to request again, indefinitely.
   *
   * @returns {Promise.<void>}
   */
  requireLocationPermission = async () => {

    let response = await Permissions.askAsync(Permissions.LOCATION);

    if (response.status !== 'granted') {
      Alert.alert(
        "Ocurrió un problema.",
        "El permiso de ubicación es necesario para el uso de esta app!"
      );
      await this._sleep(3000);
      await this.requireLocationPermission();
    }
  };

  /**
   * Get current device location.
   *
   * @param options: enableHighAccuracy
   * @returns {Promise.<{latitude, longitude, accuracy: (*|number|Number), heading, speed, timestamp}>}
   */
  getDeviceLocation = async (options) => {

    let location = await Location.getCurrentPositionAsync(options);
    let coords = location.coords;

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      heading: coords.heading,
      speed: coords.speed,
      timestamp: location.timestamp
    };
  };


  /**
   * Auxiliar function to have a delay in ms, compatible with async/await.
   *
   * @param time
   * @returns {Promise}
   * @private
   */
  _sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

}

let geolocationService = new GeolocationService();
export default geolocationService;