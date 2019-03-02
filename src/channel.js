import React, { Component } from 'react';
import { Card, CardItem, Text, Thumbnail } from 'native-base';
import Flag from 'react-native-flags-kit';
import { Dimensions } from 'react-native';

class Channel extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            name: '',
            subcount: '',
            pic: '',
            country: 'IL'
        }
    }

    componentDidMount() {
        this.unsubscribe = setInterval(this.updateSubs, 1000);
        this.updateDetail();
    }
    
    componentWillUnmount() {
        // this.unsubscribe();
    }
    
    updateSubs = () => {
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${this.props.id}&key=${this.props.Key}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({
                subcount: res.items[0].statistics.subscriberCount,
                // pic: res.items[0].snippet.thumbnail.default.url
            });
        })
    }
    
    updateDetail = () => {
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${this.props.id}&key=${this.props.Key}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({
                pic: res.items[0].snippet.thumbnails.default.url,
                name: res.items[0].snippet.title,
                country: res.items[0].snippet.country
            });
        })
    }

    render() {
        return (
            <Card style={{ flex: 0.5 }}>
                <CardItem>
                    <Thumbnail large source={{ uri: this.state.pic }}/>
                </CardItem>
                <CardItem header>
                    <Text>{this.state.name}</Text>
                </CardItem>
                <CardItem>
                    <Text>{this.state.subcount}</Text>
                </CardItem>
                <CardItem>
                    <Flag 
                        code={this.state.country}
                        size={32}/>
                </CardItem>
            </Card>
        )
    }
}

export default Channel;