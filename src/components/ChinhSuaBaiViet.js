import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Header,
    ScrollView,
    Image,
    TextInput,
    Button
} from 'react-native';
import { Config } from '../Config'
import HTMLView from 'react-native-htmlview'
import { title } from 'react-navigation'
import { NavigationActions } from 'react-navigation'

class CTBaiBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noidung: [],
            loaded: false,

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
                {
                    this.state.loaded === true &&
                    
                        <View style={myStyle.container}>
                            <Text style={{margin:10, fontSize:16}}>Tiêu đề bài viết:</Text>
                            <View style={myStyle.content1}>
                            <TextInput
                                style={myStyle.input}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value= {this.state.noidung.title.rendered}
                                onChangeText={(u) => { this.setState({ user: u }) }}
                            />
                            </View>
                            <Text style={{margin:10, fontSize:16}}>Nội dung bài viết:</Text>
                            <ScrollView style={myStyle.content}>
                            <TextInput
                                style={myStyle.input}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                multiline={true}
                                value= {this.state.noidung.content.rendered}
                                onChangeText={(u) => { this.setState({ user: u }) }}
                            />
                            </ScrollView>
                            <Button title="Chỉnh sửa"/>
                        </View>
                }
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
    img: {
        width: 800,
        height: 400,
    }
})
const myStyle = StyleSheet.create({
    input:{
        borderRadius: 15,
		fontSize: 18,
		paddingTop: 10,
		paddingLeft: 20,
		paddingBottom: 10,
		paddingRight: 20,
		backgroundColor:"rgba(0,0,0,0)",
		textAlign: 'center',
    },
    container: {
        flex: 1,
        //marginTop: (Platform.OS === 'ios') ? 60 : 50,
    },
    content1: {
        backgroundColor:"#fff",
        borderRadius: 15,
        borderColor: 8,
        marginBottom: 5
    },
    content: {
        padding: 5,
        backgroundColor:"#fff",
        borderRadius: 15,
        borderColor: 8,
        flex: 1,
        marginBottom: 5
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
export default CTBaiBao