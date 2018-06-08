import {StackNavigator} from 'react-navigation'
import DangNhap from '../components/DangNhap'
import DSBaiBao from'../components/DSBaiBao'
import PostTo from './PostTo'
const LogiToPost=StackNavigator({
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

export default LogiToPost