import React, {Component} from 'react';
import {Alert, Button, Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default class EstasBien extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estoyBien: true,
      modalVisible: false
    };

    this._handleImOk = this._handleImOk.bind(this);
    this._handleINeedHelp = this._handleINeedHelp.bind(this);
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _handleImOk(inputValue) {
    Alert.alert(
      'Ok!',
      `Avisando a tus amigos`
    );
  }

  _handleINeedHelp(inputValue) {
    Alert.alert(
      'No te muevas!',
      `Vamos a buscar ayuda`
    );
  }
  componentDidMount() {
    this.setModalVisible(!this.state.modalVisible)
  }


render() {

    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {/*alert("Modal has been closed.")*/}}
        >
          <View style={styles.message}>
            <View>

              <Text>Estas bien?</Text>

            </View>
          </View>
          <View style={{flex: 1}} >
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Button
                title="Estoy bien!"
                color='#ff5c5c'
                onPress={this._handleImOk}
              />
              <Button
                title="Necesito ayuda"
                style={styles.needHelp}
                onPress={this._handleINeedHelp}
              />

            </View>
          </View>
        </Modal>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    flex: 5,
    height: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImOK: {
    color: 'red',
    backgroundColor: 'green'
  },
  needHelp: {
    color: 'red'
  }
});
