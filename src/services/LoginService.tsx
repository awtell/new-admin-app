import axios from '../axios';

// Make sure the payload contains the correct fields, "UserName" and "Password"
const authenticate = (user: { UserName: string; Password: string }) => {
    return axios.post(`/Admin/Auth/Login`, user);
};

const LoginService = {
    authenticate
};

export default LoginService;
