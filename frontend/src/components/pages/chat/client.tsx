import axios from "axios";
axios.defaults.withCredentials = true;

export const getConversation = async () => {
    const response = await axios.get(`/api/chatbot`);
    return response.data;
};

export const postMessage = async (message : any) => {
    const response = await axios.post(`/api/chatbot`,
        message);
    return response.data;
};
