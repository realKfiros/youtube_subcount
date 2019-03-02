import React, { Component } from 'react';
import { Container, Header, Title, Left, Body, Right, Content, Grid, Col, Button, Icon, Text } from 'native-base';
import Channel from './channel';
import { config } from '../config';

class Compare extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button icon transparent onPress={this.props.goBack}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body><Title>Compare</Title></Body>
                </Header>
                <Content>
                    <Grid>
                        <Col>
                            <Channel id={this.props.id1} Key={config.key} />
                        </Col>
                        <Col>
                            <Channel id={this.props.id2} Key={config.key} />
                        </Col>
                    </Grid>
                </Content>
            </Container>
        )
    }
}

export default Compare;