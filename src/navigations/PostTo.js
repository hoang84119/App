import { StackNavigator } from 'react-navigation'
import CTBaiBao from '../components/CTBaiBao'
import ChinhSuaBaiViet from '../components/ChinhSuaBaiViet'
import DSBaiBao from '../components/DSBaiBao'
import ThemBaiViet from '../components/ThemBaiViet'

const PostTo = StackNavigator({
    main: {
        screen: DSBaiBao,
        navigationOptions: {
            headerTitle: 'Bài viết',
        },
    },
    chitiet: {
        screen: CTBaiBao,
        navigationOptions: {
            headerTitle: 'Chi tiết bài viết',
        },   
    },
    chinhsua:{
        screen: ChinhSuaBaiViet,
        navigationOptions:{
            headerTitle: 'Chỉnh sửa',
        },
    },
    thembaiviet:{
        screen: ThemBaiViet,
        navigationOptions:{
            headerTitle: 'Thêm bài viết',
        },
    }
},
);

export default PostTo