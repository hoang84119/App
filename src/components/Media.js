import React, { Component } from 'react'
import {
    View, Text, StyleSheet, Alert,
    Image, ToastAndroid, TouchableOpacity, FlatList
}
    from 'react-native'
import API from "../API";
import HTMLView from "react-native-htmlview";
export default class Media extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            noidung: [],
            refreshing: true
        };
    }
    componentDidMount() {
        this.loadData();
    }
    async loadData() {
        this.setState({ refreshing: true });
        fetch(API.getURL() + "/thuctap/wp-json/wp/v2/media/")
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson == null) {
                    Alert.alert("Lỗi", "Không có nội dung");
                } else {
                    this.setState({ noidung: responseJson, refreshing: false });
                }
            });
    }
    showPic(i,x){
        this.props.navigation.navigate("scchitiet", { id: i });
        ToastAndroid.show(x+'', ToastAndroid.SHORT);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <FlatList
                numColumns = {3}
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
                data={this.state.noidung}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={{  flex:1, margin: 2 }}>
                        <TouchableOpacity onPress = {()=>this.showPic(item.id, item.title.rendered)}>
                        <Image source={{ uri: item.guid.rendered.replace("http://localhost", API.getURL()) }}
                            style={{ weight: 1, height: 200, resizeMode: 'cover' }}
                        />
                        <Text style={{padding: 2,height: 22,marginTop: -50, backgroundColor: 'rgba(255,255,255,0.3)'}}>{item.title.rendered}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    }
    refresh() {
        this.loadData();
    }
}
