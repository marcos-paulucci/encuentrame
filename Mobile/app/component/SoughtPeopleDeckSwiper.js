import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  Container,
  Header,
  View,
  DeckSwiper,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon,
  Button
} from 'native-base';
import {showToast} from "react-native-notifyer";


export default class SoughtPeopleDeckSwiper extends Component {

  static defaultProps = {
    soughtPeople: [],
    navigation: {},
    onIveSeenHimSubmit: () => console.log("Submitting IveSeenHim"),
    onIveNotSeenHim: () => console.log("Submitting IveNotSeenHim")
  };

  _deckSwiper;

  onIveSeenHim = personCard => {
    console.debug("[SoughtPeopleDeckSwiper] Swiped right: ", personCard);
    this.props.navigation.navigate("SupplyInfo", {
      soughtPersonId: personCard.soughtPersonId,
      onSubmit: (suppliedInfo) => {
        console.log("[SoughtPeopleDeckSwiper] SupplyInfo.onSubmit() called. Supplying info to server.", suppliedInfo);
        this.props.onIveSeenHimSubmit(personCard.soughtPersonId, suppliedInfo);
      },
      onClose: () => {
        // TODO put card back, here...
        console.log("[SoughtPeopleDeckSwiper] SupplyInfo.onClose() called. Doing nothing.");
      }
    });
  };


  onIveNotSeenHim = personCard => {
    console.debug("[SoughtPeopleDeckSwiper] Swiped left: ", personCard);
    this.props.onIveNotSeenHim(personCard.soughtPersonId);
    // TODO send card to end of list; if second time then remove? Or simply remove?
  };

  _renderDeckSwiper = () => (
    <View>
      <DeckSwiper
        ref={(c) => this._deckSwiper = c}
        dataSource={this.props.soughtPeople}
        renderEmpty={() =>
          <View style={{alignSelf: "center"}}>
            <Text>Ya no queda nadie por buscar. ¡Gracias por tu aporte!</Text>
          </View>
        }
        renderItem={item =>
          <Card style={{elevation: 3}}>
            <CardItem>
              <Left>
                <Thumbnail source={item.image}/>
                <Body>
                <Text>{item.name}</Text>
                <Text note>{item.username}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image style={{height: 250, flex: 1}} source={item.image}/>
            </CardItem>
            <CardItem>
              <Icon name="heart" style={{color: '#ED4A6A'}}/>
              <Text>{item.lastSeen}</Text>
            </CardItem>
          </Card>
        }
        onSwipeRight={this.onIveSeenHim}
        onSwipeLeft={this.onIveNotSeenHim}
      />
    </View>
  );
  _renderSwipeButtons = () => (
    <View style={{
      flexDirection: "row",
      flex: 1,
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      justifyContent: 'space-between',
      padding: 15
    }}>
      <Button iconLeft onPress={() => {
        this._deckSwiper._root.swipeLeft();
        let personCard = this._deckSwiper._root.state.selectedItem;
        this.onIveNotSeenHim(personCard);
      }}>
        <Icon name="arrow-back"/>
        <Text>No lo he visto :(</Text>
      </Button>
      <Button iconRight onPress={() => {
        this._deckSwiper._root.swipeRight();
        let personCard = this._deckSwiper._root.state.selectedItem;
        this.onIveSeenHim(personCard);
      }}>
        <Text>¡Lo he visto!</Text>
        <Icon name="arrow-forward"/>
      </Button>
    </View>
  );

  render() {
    return (
      <Container>
        {/*<Header />*/}
        {this._renderDeckSwiper()}
        {this._renderSwipeButtons()}
      </Container>
    )
  }
}
