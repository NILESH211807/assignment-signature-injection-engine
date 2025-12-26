import axios from 'axios';

const useFetch = () => {
    // default base URL
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    const postFetch = async (url, data, config = {}) => {
        const result = await axios.post(url, data, config);
        return result.data;
    }

    return {
        postFetch
    }
}

export default useFetch;