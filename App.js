import React, {Component} from 'react';
import { Container, Header, Text, Content, Item, Icon, Input, Button, List, ListItem, Thumbnail, Left, Body, Right, View, Card, CardItem } from 'native-base';
import { config } from './config';
import { Modal, Alert, Image } from 'react-native';
import Compare from './src/compare';
import * as firebase from 'firebase';
import 'firebase/firestore';

console.disableYellowBox = true;

firebase.initializeApp(config.firebase);

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('featured_comparisons');
    this.unsubscribe = null;
    this.state = {
      search: '',
      results: [],
      compare1: null,
      compare2: null,
      showModal: false,
      featured: []
    }
    this.drawer = null;
  }

  componentDidMount() {
    this.unsubscribe = this.ref.orderBy('place', 'asc').onSnapshot(this.updateFeatured);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateFeatured = (querySnaphot) => {
    const featured = [];
    querySnaphot.forEach((doc) => {
      const { id, id1, id2, name, name1, name2, image } = doc.data();
      featured.push({
        id,
        id1,
        id2,
        name,
        name1,
        name2,
        image
      });
    });
    this.setState({
      featured
    })
  }

  renderContent = () => {
    if (this.state.search === '') {
      return (
        <List
          dataArray={this.state.featured}
          renderRow={(props) => {
            return (
              <FeaturedComparison
                {...props}
                compare={() => {
                  this.setState({
                    compare1: { id: props.id1 },
                    compare2: { id: props.id2 },
                    showModal: true
                  })
                }} />
              )
            }}>
          </List>
      )
    } else {
      return (
        <List
          dataArray={this.state.results}
          renderRow={(props) => {
            return (
              <ListItem thumbnail>
                <Left>
                  <Thumbnail source={{ uri: props.snippet.thumbnails.default.url}}/>
                </Left>
                <Body>
                  <Text style={{ fontWeight: 'bold' }}>{props.snippet.title}</Text>
                  <Text style={{ fontWeight: 'normal' }} numberOfLines={1}>{props.snippet.description}</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.addToCompare({
                      image: props.snippet.thumbnails.default.url,
                      title: props.snippet.title,
                      id: props.id.channelId
                    })}>
                    <Icon name="add"/>
                  </Button>
                </Right>
              </ListItem>
            )
          }}>
        </List>
      )
    }
  }

  searchChannels = () => {
    fetch(`https://www.googleapis.com/youtube/v3/search?q=${this.state.search}&part=snippet&key=${config.key}&maxResults=10&type=channel`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.json();
    }).then((res) => {
      let results = [];
      res.items.forEach((channel) => {
        // alert(JSON.stringify(channel))
        results.push(channel);
      });
      this.setState({ results });
    })
  }

  addToCompare = (channel) => {
    if (this.state.compare1) {
      if (channel.id === this.state.compare1.id)
        Alert.alert('Can\'t add channel to compare', 'Channel already added')
      else 
        this.setState({ compare2: channel });
    } else {
      this.setState({ compare1: channel });
    }
  }

  renderCompareList = () => {
    if (this.state.compare1 != null && this.state.compare2 != null) {
      return (
        <List>
          <ListItem>
            <Left>
              <Thumbnail source={{ uri: this.state.compare1.image }} />
            </Left>
            <Body>
              <Text>{this.state.compare1.title}</Text>
            </Body>
            <Right>
              <Button transparent icon onPress={this.remove1}>
                <Icon name="remove"/>
              </Button>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Thumbnail source={{ uri: this.state.compare2.image }} />
            </Left>
            <Body>
              <Text>{this.state.compare2.title}</Text>
            </Body>
            <Right>
              <Button transparent icon onPress={this.remove2}>
                <Icon name="remove"/>
              </Button>
            </Right>
          </ListItem>
          <Button onPress={() => this.setState({ showModal: true })}>
            <Text>Compare</Text>
          </Button>
          <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5
              }}/>
        </List>
      )
    } else if (this.state.compare1 != null && !this.state.compare2) {
      return (
        <List>
          <ListItem>
            <Left>
              <Thumbnail source={{ uri: this.state.compare1.image }} />
            </Left>
            <Body>
              <Text>{this.state.compare1.title}</Text>
            </Body>
            <Right>
              <Button transparent icon onPress={this.remove1}>
                <Icon name="remove"/>
              </Button>
            </Right>
          </ListItem>
          <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5
              }}/>
        </List>
      )
    } else {
      return null;
    }
  }

  remove1 = () => {
    if (!this.state.compare2) {
      this.setState({ compare1: null });
    } else {
      this.setState({
        compare1: JSON.parse(JSON.stringify(this.state.compare2)),
        compare2: null,
      });
    }
  }

  remove2 = () => {
    this.setState({ compare2: null });
  }

  renderCompare = () => {
    if (this.state.compare1 && this.state.compare2)
      return <Compare id1={this.state.compare1.id} id2={this.state.compare2.id} goBack={() => this.setState({ showModal: false, compare1: null, compare2: null })} /> 
    else
      return null;
  }

  closeDrawer = () => {
    this.drawer._root.close()
  };

  openDrawer = () => {
    this.drawer._root.open()
  };

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'red' }} searchBar>
          <Item>
            <Input 
              placeholder="Search"
              value={this.state.search}
              onChangeText={(text) => this.setState({ search: text })}/>
            <Button icon transparent dark onPress={this.searchChannels}>
              <Icon name="ios-search" />
            </Button>
          </Item>
        </Header>
        <Content>
          {this.renderCompareList()}
          {this.renderContent()}
        </Content>
        <Modal visible={this.state.showModal} animationType="slide">
          {this.renderCompare()}
        </Modal>
      </Container>
    );
  }
}

class FeaturedComparison extends Component {
  render() {
    return (
      <Card>
        <CardItem header>
          <Text>{this.props.name}</Text>
        </CardItem>
        <CardItem body>
          <Image source={{uri: `${this.props.image}`}} style={{height: 200, width: null, flex: 1, resizeMode: 'contain'}}/>
        </CardItem>
        <CardItem>
          <Text>{this.props.name1} vs {this.props.name2}</Text>
        </CardItem>
        <CardItem button onPress={this.props.compare}>
          <Text style={{ color: 'blue', fontWeight: 'bold' }}>Compare</Text>
        </CardItem>
      </Card>
    )
  }
}

export default App;