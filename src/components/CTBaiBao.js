import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Header,
    ScrollView,
    Platform,
    Image
} from 'react-native';
import HTML from 'react-native-render-html'
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
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle: {
            fontSize: 16,
            //textAlign: 'center',alignSelf:'center'
        },
        headerStyle: {
            backgroundColor: 'white',
        },
    });
    async loadData() {
        fetch('http://192.168.1.103/thuctap/wp-json/wp/v2/posts/' + this.props.navigation.getParam("id", ""))
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
        //var h = this.state.noidung.content.toString();
        //var html= h.replace("http://localhost","http://192.168.1.103");
        return (
            <View style={myStyle.container}>
                {
                    this.state.loaded === false &&
                    <View style={myStyle.loadingContainer}>
                        <Image style={{ width: 32, height: 32 }} source={require('../image/loading.gif')} />
                        <Text>Đang tải</Text>
                    </View>
                }
                {/* Bố cục trang */}
                <ScrollView style={myStyle.content}>
                    <View style={myStyle.header}>
                        {
                            this.state.loaded &&
                            <HTML html={this.state.noidung.title.rendered} />
                        }
                        {
                            this.state.loaded &&
                            <HTML html={'Cập nhật ngày: '+ this.state.noidung.date.replace("T", "  ")} />
                        }
                    </View>
                    {
                        this.state.loaded &&
                        <HTML
                            html={this.state.noidung.content.rendered.replace("http://localhost", "http://192.168.1.103")} />
                    }
                </ScrollView>
            </View>
        );
    }
}
const myStyle = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: (Platform.OS === 'ios') ? 60 : 50,
        padding: 5
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header:{
        padding:5
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