import {StackNavigator} from 'react-navigation'
import DangNhap from '../components/DangNhap'
import DSBaiBao from'../components/DSBaiBao'
import BaiVietNavigations from './BaiVietNavigations'
const MainNaigations=StackNavigator({
    Login:{
        screen: DangNhap,
    },
    MainScreen:{
        screen: BaiVietNavigations,
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

export default BaiVietNavigations