import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom';
import API from "../API";

export default class MediaDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let headerRight = (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => params.onAdd()}
                >
                    {/* <Image
                        style={{ width: 32, height: 32 }}
                        source={require("../image/ic_post.png")}
                    /> */}
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => params.onLogout()}>
                    {/* <Image
                        style={{ width: 32, height: 32, marginLeft: 5, marginRight: 15 }}
                        source={require("../image/ic_logout.png")}
                    /> */}
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginRight: 10}}>Chọn hình</Text>
                </TouchableOpacity>
            </View>
        );
        return { headerRight };
    };


    constructor(props) {
        super(props);
        this.state = {
            hinhanh: '',
            chieurong: 0,
            chieudai:0
            //refreshing: true
        };
    }
    async loadData() {
        fetch(
            API.getURL() +
            "/thuctap/wp-json/wp/v2/media/" +
            this.props.navigation.getParam("id", "")
        )
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson == null) {
                    Alert.alert("Lỗi", "Không có nội dung");
                } else {
                    this.setState({ 
                        hinhanh: responseJson.guid.rendered,
                        chieudai: responseJson.media_details.height,
                        chieurong: responseJson.media_details.width
                     });
                }
            });
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        return (
            <View
                style={{ backgroundColor: 'black' }}>
                <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={this.state.chieurong}
                    imageHeight={this.state.chieudai}>
                    <Image
                        style={{ flex: 1 }}
                        source={{ uri: `${this.state.hinhanh.replace("http://localhost", API.getURL())}` }} />
                </ImageZoom>
            </View>
        );
    }
}