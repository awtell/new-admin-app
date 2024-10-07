import axiosInstance from '../axios';

const authenticate = (user: { UserName: string; Password: string }) => {
    return axiosInstance.post(`/Admin/Auth/Login`, user);
};

const emailCheck = (Email: string) => {
    return axiosInstance.post(`/Admin/Auth/SendVerificationEmail`, { "Email": Email });
}

const verifyCode = (Email: string, Code: string) => {
    return axiosInstance.post(`/Admin/Auth/VerifyEmail`, { "Email": Email, "VerificationCode": Code });
}

const resetPassword = ( Password: string) => {
    return axiosInstance.post(`/Admin/Auth/ResetPassword`, { "Password": Password });
}
const AuthService = {
    authenticate,
    emailCheck,
    verifyCode,
    resetPassword
};

export default AuthService;
