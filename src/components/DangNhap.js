import React, { Component } from 'react'
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Alert
} from 'react-native'
//import {Config} from '../Config'
import { NavigationActions } from 'react-navigation'

export default class App extends Component {
	state = {
		user: '',
		pass: '',
		data: []
	}

	async LoadData() {
		try {
			const response = await fetch
				//("http://192.168.1.103/thuctap/wp-json/custom-plugin/login?username="+this.state.user+"&password="+this.state.pass);
				( 'http://192.168.1.192/thuctap/wp-json/custom-plugin/login?username=admin&password=123456789');
			const responseJson = await response.json();
			//Alert.alert(responseJson.data.user_email);
			// this.setState({data:responseJson.data});
			//  axios.get('http://192.168.1.103/thuctap/wp-json/custom-plugin/login?username=admin&password=123456789').then(res => {
			// 	const d = res.data;
			// 	this.setState({ data: d });
			//   });
			this.setState({ data: responseJson.data.user_email });
		}
		catch (error) {
			Alert.alert(error);
		}
	}

	loginNow() {
		if (this.state.user == "") Alert.alert("Lỗi", "Tên đăng nhập không được rỗng");
		else if (this.state.pass == "") Alert.alert("Lỗi", "Mật khẩu không được rỗng");
		else {
			fetch('http://192.168.1.192/thuctap/wp-json/custom-plugin/login?username=' + this.state.user + '&password=' + this.state.pass, )
				.then((response) => response.json())
				.then(responeJson => {
					// console.log(responseJson.data);
					// this.setState({
					//   kq:responseJson["message"]
					// });
					//Alert.alert(JsonRespone.data.user_email);
					if (responeJson.data == null) {
						Alert.alert("Lỗi", "Sai tên đăng nhập hoặc mật khẩu");
					}
					else {
						//Alert.alert("Thông báo","Đăng nhập thành công "+ responeJson.data.user_email);
						this.setState({ data: responeJson.data });
						this.props.navigation.navigate('MainScreen');
						// this.props.navigation.dispatch(NavigationActions.reset({
						// 	index:0,
						// 	actions:[NavigationActions.navigate({routeName:"MainScreen"})]
						// }))
					}
				})
			//this.LoadData();
		}

	}
	render() {
		return (
			<View style={myStyle.nen}>
				<View style={myStyle.khungDangNhap} >
				</View>
				<View style={{ height: 130, alignItems: 'center', }}>
					<Text style={myStyle.header}> Đăng nhập </Text>
					<TextInput placeholderTextColor='white' underlineColorAndroid='rgba(0,0,0,0)' style={myStyle.ctmInput} onChangeText={(u) => { this.setState({ user: u }) }} placeholder="Tên tài khoản" />
					<TextInput placeholderTextColor='white' underlineColorAndroid='rgba(0,0,0,0)' style={myStyle.ctmInput} onChangeText={(p) => { this.setState({ pass: p }) }} placeholder="Mật khẩu" secureTextEntry={true} />
				
				<View style={{ height: 50, alignItems: 'center' }}>
					<TouchableOpacity onPress={() => {
						this.loginNow()

					}}>
						<Text style={myStyle.ctmBottom}>Đăng nhập</Text>
					</TouchableOpacity>
				</View></View>
			</View>
		);
	}
}

const myStyle = StyleSheet.create({
	ctmBottom: {
		borderRadius: 40,
		fontSize: 20,
		color: '#36BC63',
		paddingTop: 10,
		paddingLeft: 20,
		paddingBottom: 10,
		paddingRight: 20,
		backgroundColor: 'white',
		textAlign: 'center',
		width: 230
	},
	ctmInput: {
		marginBottom: 15,
		backgroundColor: 'rgba(255,255,255,0.3)',
		fontSize: 20,
		height: 45,
		width: 230,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 40,
		color: 'white'
	},
	nen: {
		flex: 1,
		backgroundColor: '#36BC63'
	},
	header: {
		fontSize: 30,
		textAlign: 'center',
		color: 'white',
		marginBottom: 30
	},

	khungDangNhap: {
		flex: 0.4,
		height: 100,
		flexDirection: 'row',
		justifyContent: 'center'
	}
});
