import React, { Component } from 'react';
import {
    Alert,
    FlatList,
    BackHandler,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import HTML from 'react-native-render-html'
class DSBaiBao extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            color: '#088A4B'
        },
        headerStyle: {
            backgroundColor: '#fff',
            alignItems: 'center',
            textAlign: 'center',
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            noidung: '',
            refeshing: true
        }
    }

    loadData() {
        this.setState({ refeshing: true });
        fetch('http://192.168.1.103/thuctap/wp-json/wp/v2/posts').then((response) => response.json()).then(responeJson => {
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
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    xem(i, t) {
        //Alert.alert(t+"");
        this.props.navigation.navigate("ct", { id: i, title: t });
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <FlatList
                refreshing={this.state.refeshing}
                onRefresh={() => this.refesh()}
                data={this.state.noidung}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) =>
                    <View style={myStyle.baibao}>
                        <TouchableOpacity onPress={() => this.xem(item.id, item.title.rendered)}>
                            <Text style={myStyle.title}>{item.title.rendered}</Text>
                            <View style={myStyle.excerpt} >
                                <HTML html={item.excerpt.rendered} />
                            </View>
                        </TouchableOpacity>
                        <View style={myStyle.edit}>
                            <TouchableOpacity onPress={() => this.xem(item.id, item.title.rendered)} style={myStyle.textEdit}>
                                <Text style={myStyle.textEdit}>Xem</Text>
                            </TouchableOpacity>
                            <Text>|</Text>
                            <TouchableOpacity style={myStyle.textEdit}>
                                <Text style={myStyle.textEdit}>Xóa</Text>
                            </TouchableOpacity>
                            <Text>|</Text>
                            <TouchableOpacity style={myStyle.textEdit}>
                                <Text style={myStyle.textEdit}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                } />
        );
    }

    refesh() {
        this.loadData();
    }

    onBackButtonPress = () => {
        Alert.alert("Thoát", "Bạn muốn thoát không",
            [{ text: 'Đồng ý', onPress: () => BackHandler.exitApp() },
            { text: 'Hủy', style: 'cancel' }],
            { cancelable: false });
        return true;
    };
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
        borderTopWidth: 1,
        borderColor: '#efefef',
        padding: 7,
        backgroundColor: 'rgba(210,210,210,0.1)',
        flexDirection: 'row',
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8
    },
    textEdit: {
        fontWeight: 'bold',
        flex: 1,
        color: '#36BC63',
        alignItems: 'center'
    },
    baibao: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: '#fff',
    }
});
export default DSBaiBao;