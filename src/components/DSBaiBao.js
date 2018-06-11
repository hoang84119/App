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
import HTMLView from 'react-native-htmlview';
import API from '../API'
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
    async loadData() {
        this.setState({ refeshing: true });
        fetch(API.getURL()+'/thuctap/wp-json/wp/v2/posts').then((response) => response.json()).then(responeJson => {
            if (responeJson == null) {
                Alert.alert("Lỗi", "Không có nội dung");
            } else {
                this.setState({ noidung: responeJson, refeshing: false });
            }
        })
    }

    componentDidMount() {
        this.loadData();
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)
    }

    xem(i, t) {
        this.props.navigation.navigate("chitiet", { id: i});
    }
    xoa(i, t) {
        Alert.alert("Thông báo", "Bạn có thật sự muốn xóa ''" + t + "'' không?",
            [{
                text: 'Xóa', onPress: () => {
                    fetch(API.getURL()+'/thuctap/wp-json/wp/v2/posts/' + i, {
                        "method":"DELETE",
                        "headers":{
                            "Accept":"application/json",
                            "Content-Type":"application/json",
                            "X-App-Token":"blablatoken",
                            "Authorization":"JWT blablasuperlongtoken"
                    }}).then(response => response.json());
                    this.setState({ refeshing: true });
                    Alert.alert("Thông báo", "Xóa thành công!(chưa xóa được)");

                }
            },
            { text: 'Hủy', style: 'cancel' }],
            { cancelable: false });
        return true;
    }
    chinhsua(i) {
        this.props.navigation.navigate("chinhsua", { id: i });
    }
    render() {
        const { navigate } = this.props.navigation;
        const kieu = {
            tagsStyles: { div: { textAlign: 'center', fontStyle: 'italic', color: 'grey' } },
            classesStyles: { 'last-paragraph': { textAlign: 'right', color: 'teal', fontWeight: '800' } }
        }

        return (
            <FlatList
                refreshing={this.state.refeshing}
                onRefresh={() => this.refesh()}
                data={this.state.noidung}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) =>
                    <View style={myStyle.baibao}>
                        <TouchableOpacity onPress={() => this.xem(item.id, item.title.rendered)}>
                            <View >
                                <HTMLView
                                    value={"<span>" + item.title.rendered + "</span>"}
                                    stylesheet={htmlTitleStyle}
                                />
                            </View>
                            <View style={myStyle.excerpt} >
                                <HTMLView
                                    value={item.excerpt.rendered}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={myStyle.edit}>
                            <TouchableOpacity onPress={() => this.xem(item.id, item.title.rendered)} style={myStyle.textEdit}>
                                <Text style={myStyle.textEdit}>Xem</Text>
                            </TouchableOpacity>
                            <Text>|</Text>
                            <TouchableOpacity onPress={() => this.xoa(item.id, item.title.rendered)} style={myStyle.textEdit}>
                                <Text style={myStyle.textEdit}>Xóa</Text>
                            </TouchableOpacity>
                            <Text>|</Text>
                            <TouchableOpacity onPress={() => this.chinhsua(item.id)} style={myStyle.textEdit}>
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
const htmlTitleStyle = StyleSheet.create({
    span: {
        color: '#088A4B',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginBottom: 0,
        fontSize: 18
    },
})
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