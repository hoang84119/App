import {StackNavigator} from 'react-navigation'
import DangNhap from '../components/User/DangNhap'
import PostTo from './PostTo'
import Tab from './TabNavigator'
const LoginToPost=StackNavigator({
    Login:{
        screen: DangNhap,
    },
    MainScreen:{
        screen: Tab,
        navigationOptions:{
            headerTitle: 'Danh sach',
            gesturesEnabled: false,
        },
    },
},
// {
//     headerMode: 'none'
// }
{
    headerMode: 'none',
}
);

export default LoginToPost