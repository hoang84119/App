import {StackNavigator} from 'react-navigation'
import CTBaiBao from '../components/CTBaiBao'
import DSBaiBao from'../components/DSBaiBao'
const BaiVietNavigations=StackNavigator({
    main:{
        screen: DSBaiBao,
        navigationOptions:{
            headerTitle: 'Bài viết'
        },
    },
    ct:{
        screen: CTBaiBao,
    },
},
// {
//     headerMode: 'none'
// }
// {
//     headerMode: 'none',
// }
);

export default BaiVietNavigations