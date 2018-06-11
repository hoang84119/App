import {StackNavigator} from 'react-navigation'
import DangNhap from '../components/DangNhap'
import PostTo from './PostTo'
const LoginToPost=StackNavigator({
    Login:{
        screen: DangNhap,
    },
    MainScreen:{
        screen: PostTo,
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