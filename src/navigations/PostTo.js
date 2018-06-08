import { StackNavigator } from 'react-navigation'
import CTBaiBao from '../components/CTBaiBao'
import ChinhSuaBaiViet from '../components/ChinhSuaBaiViet'
import DSBaiBao from '../components/DSBaiBao'
const PostTo = StackNavigator({
    main: {
        screen: DSBaiBao,
        navigationOptions: {
            headerTitle: 'Bài viết',
        },
    },
    chitiet: {
        screen: CTBaiBao,
    },
    chinhsua:{
        screen: ChinhSuaBaiViet,
        navigationOptions:{
            headerTitle: 'Chỉnh sửa',
        },
    },
},
);

export default PostTo