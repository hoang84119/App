import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Header
} from 'react-native';
import HTML from 'react-native-render-html'
import {title} from 'react-navigation'

class CTBaiBao extends Component{
    constructor(props) {
        super(props);
        this.state = {
            noidung: [],
            refeshing: true
        }
        const { navigation } = this.props;
    }
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
         headerTitleStyle : {fontSize:15,textAlign: 'center',alignSelf:'center'},
            headerStyle:{
                backgroundColor:'white',
            },
    });
    loadData() {
        fetch('http://192.168.1.103/thuctap/wp-json/wp/v2/posts/' + this.props.navigation.getParam("id",""))
        .then((response) => response.json())
        .then(responeJson => {
            if (responeJson == null) {
                Alert.alert("Lỗi", "Không có nội dung");
            } else {
                this.setState({ noidung: responeJson, refeshing: false });
            }
        })
        //this.LoadData();
    }

    componentDidMount() {
        this.loadData();
    }

    render(){
        return(
            <View>
                <Text>{this.props.navigation.getParam("id","")}</Text>
            </View>
        );
    }
}
const myStyle = StyleSheet.create({
    title: {
        color: '#088A4B',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginBottom: 0,
        fontSize: 18
    },
    excerpt: {
        color: '#088A4B',
        paddingLeft: 10,
    },
    edit: {
        padding: 7,
        backgroundColor: 'rgba(0,100,0,0.1)',
        flexDirection: 'row',
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8
    },
    textEdit: {
        flex: 1,
        color: '#FFFFFF',
        alignItems: 'center'
    },
    baibao: {
        borderRadius: 8,
        margin: 5,
        backgroundColor: 'rgba(0,80,0,0.1)',
    }
});
export default CTBaiBao