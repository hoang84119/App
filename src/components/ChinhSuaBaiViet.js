import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Header,
    ScrollView,
    Image,
    TextInput
} from 'react-native';
import {Config} from '../Config'
import HTMLView from 'react-native-htmlview'
import { title } from 'react-navigation'
import { NavigationActions } from 'react-navigation'

class CTBaiBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noidung: [],
            loaded: false
        }
        //const { navigation } = this.props;
    }
    async loadData() {
        fetch('http://192.168.1.192/thuctap/wp-json/wp/v2/posts/' + this.props.navigation.getParam("id", ""))
            .then((response) => response.json())
            .then(responeJson => {
                if (responeJson == null) {
                    Alert.alert("Lỗi", "Không có nội dung");
                } else {
                    this.setState({ noidung: responeJson, loaded: true });
                }
            })
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <View style={{ flex: 1, padding: 5 }}>
                {
                    this.state.loaded === false &&
                    <View style={myStyle.loadingContainer}>
                        <Image style={{ width: 32, height: 32 }} source={require('../image/loading.gif')} />
                        <Text >Đang tải</Text>
                    </View>
                }

                <ScrollView style={myStyle.container}>
                    <View>
                    <TextInput
                        placeholderTextColor='white'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={myStyle.ctmInput}
                        onChangeText={(u) => { this.setState({ user: u }) }}
                        value=" hayak;asn" />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const htmlTitleStyle = StyleSheet.create({
    span: {
        borderRadius: 8,
        color: '#088A4B',
        fontSize: 18
    },
    p: {
        fontSize: 16
    },
    img:{
        width:800,
        height:400,
    }
})
const myStyle = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: (Platform.OS === 'ios') ? 60 : 50,
        borderWidth: 1,
        borderColor: '#dfdfdf',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    content: {
        padding: 10,
        borderColor: 8,
        flex: 1,
    },
    header: {
        padding: 5
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        margin: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
export default CTBaiBao