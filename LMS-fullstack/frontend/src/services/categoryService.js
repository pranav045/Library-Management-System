import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const getAllCategories = async () => {
  const res = await axios.get(`${API_URL}/getAllCategories`)
  return res.data
}

export const getCategory = async (name) => {
  const res = await axios.get(`${API_URL}/getCategory/${name}`)
  return res.data
}

export const createCategory = async (category) => {
  const res = await axios.post(`${API_URL}/saveCategory`, category)
  return res.data
}

export const deleteCategory = async (name) => {
  const res = await axios.delete(`${API_URL}/deleteCategory/${name}`)
  return res.data
}
