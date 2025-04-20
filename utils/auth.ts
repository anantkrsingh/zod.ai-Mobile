import AuthService from "@/services/AuthService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


export async function loginGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const response = await AuthService.googleLogin(userInfo.data?.idToken!)
        return response;
    } catch (error) {
        throw error;
    }
}

export async function checkSession() {
    try {
        const token = await AuthService.getToken();
        if (token) {
            return token;
        }
        return false;
    } catch (error) {
        return false;
    }
}


