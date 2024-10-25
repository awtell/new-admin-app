import instance from '../axios';

const authenticate = (user: { UserName: string; Password: string }) => {
    return instance.post(`/Admin/Auth/Login`, user);
};

const emailCheck = (Email: string) => {
    return instance.post(`/Admin/Auth/SendVerificationEmail`, { "Email": Email });
}

const verifyCode = (Email: string, Code: string) => {
    return instance.post(`/Admin/Auth/VerifyEmail`, { "Email": Email, "VerificationCode": Code });
}

const resetPassword = (Password: string) => {
    return instance.post(`/Admin/Auth/ResetPassword`, { "Password": Password });
}
const AuthService = {
    authenticate,
    emailCheck,
    verifyCode,
    resetPassword
};

export default AuthService;
