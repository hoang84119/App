import {StackNavigator} from 'react-navigation'
import DangNhap from '../components/DangNhap'
import DSBaiBao from'../components/DSBaiBao'
import PostToDetail from './PostToDetail'
const LogiToPost=StackNavigator({
    Login:{
        screen: DangNhap,
    },
    MainScreen:{
        screen: PostToDetail,
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