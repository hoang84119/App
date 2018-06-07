import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Header,
    ScrollView,
    Image
} from 'react-native';
import HTMLView from 'react-native-htmlview'
import {title} from 'react-navigation'
import {NavigationActions} from 'react-navigation'

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
                {
                    this.state.loaded&&
                    <HTMLView
                            value={"<span>"+this.state.noidung.title.rendered+"</span>"}
                            stylesheet={htmlTitleStyle}
                    />
                    // <HTML 
                    //     tagStyle={myStyle.title  }
                    //     html={this.state.noidung.title.rendered} />
                }
                <ScrollView style={myStyle.container}>
                    {
                        this.state.loaded &&
                        <HTMLView
                            value={this.state.noidung.content.rendered.replace("http://localhost","http://192.168.1.103")}
                            stylesheet={myStyle}
                        />
                        // <HTML 
                        // // tagStyle : {p: {fontStyle:'italic'}}
                        // html={this.state.noidung.content.rendered.replace("http://localhost","http://192.168.1.103")}/>
                    }
                </ScrollView>
            </View>
        );
    }
}
const htmlTitleStyle = StyleSheet.create({
    span:{
        color: '#088A4B',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginBottom: 0,
        fontSize: 18
    },
})
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