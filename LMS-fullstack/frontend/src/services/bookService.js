import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const getAllBooks = async () => {
  const res = await axios.get(`${API_URL}/getAllBooks`)
  return res.data
}

export const getBook = async (id) => {
  const res = await axios.get(`${API_URL}/getBook/${id}`)
  return res.data
}

export const createBook = async (book) => {
  const res = await axios.post(`${API_URL}/saveBook`, book)
  return res.data
}

export const deleteBook = async (id) => {
  const res = await axios.delete(`${API_URL}/deleteBook/${id}`)
  return res.data
}

