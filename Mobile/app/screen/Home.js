import React, {Component} from 'react'
import {Text, View, Alert, ScrollView} from 'react-native'
import SessionService from '../service/SessionService';
import NewsListContainer from "../component/NewsListContainer";
import {text} from '../style';

import {showToast} from 'react-native-notifyer';
import PositionTrackingService from '../service/PositionTrackingService';

import {Icon} from 'react-native-elements';
import ActionButton from "react-native-action-button";

export default class Home extends Component {

  state = {
    trackingEnabled: false
  };

  constructor(props) {
    super(props);
    this.onPressTitle = this.onPressTitle.bind(this);
  }

  async componentWillMount() {
    let sessionAlive = await SessionService.isSessionAlive();
    if (!sessionAlive) {
      showToast("La sesión ha caducado. Por favor, vuelva a iniciar sesión.");
      this.props.navigation.navigate('Logout');
    }
  }

  componentDidMount = async () => {
    let trackingEnabled = await PositionTrackingService.checkEnabled();
    if (trackingEnabled){
      PositionTrackingService.startPositionTracking();
      trackingEnabled = PositionTrackingService.checkEnabled()
    }
    this.setState({trackingEnabled});
  };


  onPressTitle() {
    const {navigate} = this.props.navigation;
    navigate('AreYouOk');
  }

  onPressTrackToggle = async () => {
    let trackingEnabled = await PositionTrackingService.checkEnabled();
    let alertMsg;
    if(trackingEnabled) {
      await PositionTrackingService.stopPositionTracking();
      alertMsg = "Segumiento desactivado. \nRecuerda activarlo cuando quieras que te podamos cuidar!";
    } else {
      await PositionTrackingService.startPositionTracking();
      alertMsg = "Seguimiento activado \uD83D\uDE00";
    }
    trackingEnabled = await PositionTrackingService.checkEnabled();
    this.setState({trackingEnabled});
    Alert.alert("Seguime", alertMsg);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1.8}}>
          <Text style={text.p} onPress={this.onPressTitle}>
            Home
          </Text>
          <NewsListContainer/>
        </ScrollView>
        <ActionButton style={{flex: 0.2}}
                      buttonColor={this.state.trackingEnabled ? 'rgba(231,76,60,1)' : 'rgba(76,231,60,1)'}
                      onPress={this.onPressTrackToggle}
                      icon={(<Icon name="person-pin-circle" color="white" size={26}/>)}
        />
      </View>
    )
  }
}
