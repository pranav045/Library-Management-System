import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const getAllAuthors = async () => {
  const res = await axios.get(`${API_URL}/getAuthors`)
  return res.data
}

export const getAuthor = async (id) => {
  const res = await axios.get(`${API_URL}/getAuthor/${id}`)
  return res.data
}

export const createAuthor = async (author) => {
  const res = await axios.post(`${API_URL}/saveAuthor`, author)
  return res.data
}

export const deleteAuthor = async (id) => {
  const res = await axios.delete(`${API_URL}/deleteAuthor/${id}`)
  return res.data
}

