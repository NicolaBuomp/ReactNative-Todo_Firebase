import { useContext, useState } from 'react';
import { Button, Divider, Drawer, IconButton, MD3DarkTheme, Menu } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { LoadingContext } from '../../context/LoadingContext';
import { getAuth } from 'firebase/auth'
import { Alert } from 'react-native';


const MyMenu = () => {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false)


    const { theme, toggleTheme } = useTheme()

    const darkMode = theme === MD3DarkTheme;
    const authCtx = useContext(AuthContext)
    const loadingCtx = useContext(LoadingContext)

    function logout() {
        loadingCtx.enableLoading()
        getAuth().signOut().then(() => {
            authCtx.logout()
        }).catch((error) => {
            Alert.alert(error.code, '')
        }).finally(() => {
            loadingCtx.disableLoading()
            closeMenu()
        })
    }

    function changeTheme() {
        toggleTheme()
        closeMenu()
    }

    const RenderButtonMenu = () => <IconButton
        icon="menu"
        size={20}
        onPress={openMenu}
    />


    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<RenderButtonMenu />}>
            <Menu.Item onPress={logout} title="Logout" />
            <Divider />
            <Menu.Item onPress={changeTheme} title={`Tema ${darkMode ? 'chiaro' : 'scuro'}`} />
        </Menu>
    );
};

export default MyMenu;