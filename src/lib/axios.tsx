import axios from 'axios'
// Setting up base Url for fetching data
const Axios = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
export default Axios