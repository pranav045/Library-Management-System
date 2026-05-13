import axios from 'axios'

// In dev, Vite proxy forwards these requests to the backend.
// In prod (served by Spring Boot), same-origin requests work automatically.
const API_URL = import.meta.env.VITE_API_URL ?? ''

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/getAllUsers`)
  return res.data
}

export const getUser = async (id) => {
  const res = await axios.get(`${API_URL}/getUser/${id}`)
  return res.data
}

export const createUser = async (user) => {
  const res = await axios.post(`${API_URL}/saveUser`, user)
  return res.data
}

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/deleteUser/${id}`)
  return res.data
}

