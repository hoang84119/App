import React, { Component } from 'react'
import {
    View, Text, StyleSheet, Alert,
    Image, ToastAndroid, TouchableOpacity, FlatList
}
    from 'react-native'
import API from "../API";
import HTMLView from "react-native-htmlview";
export default class Media extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     let headerRight = (
    //       <View style={{flexDirection: 'row'}}>
    //         <TouchableOpacity
    //           onPress={() => params.onAdd()}
    //         >
    //           <Image
    //             style={{ width: 32, height: 32 }}
    //             source={require("../image/ic_post.png")}
    //           />
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => params.onLogout()}>
    //         <Image
    //             style={{ width: 32, height: 32, marginLeft:5,marginRight:15 }}
    //             source={require("../image/ic_logout.png")}
    //           />
    //         </TouchableOpacity>
    //       </View>
    //     );
    //     return { headerRight };
    //   };

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
        fetch("http://192.168.1.135/thuctap/wp-json/wp/v2/media/")
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson == null) {
                    Alert.alert("Lỗi", "Không có nội dung");
                } else {
                    this.setState({ noidung: responseJson, refreshing: false });
                }
            });
    }
    showPic(a){
        this.props.navigation.navigate("scchitiet", { id: a });
        ToastAndroid.show(a+'', ToastAndroid.SHORT);
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
                        <TouchableOpacity onPress = {()=>this.showPic(item.id)}>
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
