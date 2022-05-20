import axios from "axios";
import {REST_SERVER_URL} from "../../settings";

const axiosClient = axios.create({
    baseURL: REST_SERVER_URL
});

export default  axiosClient
