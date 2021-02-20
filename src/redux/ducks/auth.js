import Cookies from 'universal-cookie';

export const LOGIN = 'starter-app/auth/LOGIN';
export const LOGOUT = 'starter-app/auth/LOGOUT';

const initialState = () => {
  const cookies = new Cookies();
  const user = cookies.get('starternode_user') || {};
  return {
    isLoggedIn: cookies.get('starternode_isLoggedIn') || false,
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    fullname: user.fullname || '',
    roles: user.roles || '',
    imagePath: user.imagePath || '',
  };
};

export default (state = initialState(), action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isLoggedIn: true,
        username: action.username,
        email: action.email,
        phoneNumber: action.phoneNumber,
        fullname: action.fullname,
        roles: action.roles,
        imagePath: action.imagePath,
      };
    }
    case LOGOUT: {
      return {
        isLoggedIn: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const fetchLogin = (userData) => {
  const user = {
    username: userData.username,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    fullname: userData.fullname,
    roles: userData.roles,
    imagePath: userData.image_path,
  };
  const cookies = new Cookies();
  cookies.set('starternode_accessToken', userData.access_token, { path: '/' });
  cookies.set('starternode_refreshToken', userData.refresh_token, { path: '/' });
  cookies.set('starternode_isLoggedIn', 'true', { path: '/' });
  cookies.set('starternode_user', JSON.stringify(user), { path: '/' });
  return {
    type: LOGIN,
    ...user,
  };
};

export const fetchLogout = () => {
  const cookies = new Cookies();
  cookies.remove('starternode_accessToken', { path: '/' });
  cookies.remove('starternode_refreshToken', { path: '/' });
  cookies.remove('starternode_isLoggedIn', { path: '/' });
  cookies.remove('starternode_user', { path: '/' });
  return { type: LOGOUT };
};
