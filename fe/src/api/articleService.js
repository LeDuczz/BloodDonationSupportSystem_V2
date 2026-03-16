import axios from "../config/axios";

const API_URL = "/admin";


export const getAllArticles = () => axios.get(`${API_URL}/articles`);
export const getArticleById = (id) => axios.get(`${API_URL}/${id}`);

export const createArticle = (article) => axios.post(`${API_URL}/article/create`, article);



export const updateArticle = (id, article) => {
  return axios.put(`${API_URL}/article/${id}`, article);
};

export const deleteArticle = (id) => axios.delete(`${API_URL}/article/${id}`);

