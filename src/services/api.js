import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default (url) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const accessToken = cookies.get('starternode_accessToken');
  if (accessToken) {
    headers['access-token'] = accessToken;
  }
  return axios.create({
    baseURL: url,
    // withCredentials: false,
    headers
  });
};
