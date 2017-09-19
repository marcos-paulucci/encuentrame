import React from 'react'

import {StackNavigator, TabNavigator} from 'react-navigation';
import Login from '../screen/Login';
import Register from '../screen/Register';
import {Icon} from 'react-native-elements';
import Home from "../screen/Home";
import AreYouOk from "../screen/AreYouOk";
import Find from "../screen/Find";
import FriendsAndFamily from "../screen/FriendsAndFamily";
import NewActivity from "../screen/NewActivity";
import { Button, Text } from "native-base";


export const Tabs = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => <Icon name="home" size={23} color={tintColor}/>
    },
  },
  Find: {
    screen: Find,
    navigationOptions: {
      tabBarLabel: 'Encuentra',
      tabBarIcon: ({tintColor}) => <Icon name="search" size={23} color={tintColor}/>
    }
  },
  FriendsAndFamily: {
    screen: FriendsAndFamily,
    navigationOptions: {
      tabBarLabel: 'Familia/Amigos',
      tabBarIcon: ({tintColor}) => <Icon name="account-circle" size={23} color={tintColor}/>
    },
  },
}, {
  tabBarOptions: {
    activeTintColor: '#2962FF',
    animationEnabled: true,
    showIcon: true,
  },
  tabBarPosition: 'bottom'
});

export const Root = StackNavigator({
  Login: {screen: Login, navigationOptions: {header: null}},
  Register: {screen: Register},
  PostLogin: {screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <Button
        transparent
        onPress={() => navigation.navigate('NewActivity')}>
        <Icon name="people" size={23}  />
        <Text style={{fontSize: 8}}>Nueva actividad</Text>
      </Button>,
      headerRight: <Button
        transparent
        onPress={() => navigation.navigate('NewActivity')}>
        <Icon name="menu" />
      </Button>
    })
  },
  AreYouOk: {screen: AreYouOk, navigationOptions: {header: null}},
  NewActivity: {screen: NewActivity, navigationOptions: {header: null}}
});
