// threadService
import axios from 'axios'
const baseUrl = '/api/threads'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

const getById = () => {
    
}

const create = () => {
    
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  console.log(response)
  return response.data
}

const remove = () => {
    
}


export default { getAll, getById, create, update, remove, setToken }