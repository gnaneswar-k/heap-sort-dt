import axios from 'axios'

const client = axios.create({
  baseURL: "https://swxpzolzma.execute-api.ap-south-2.amazonaws.com/Prod"
})

export default client
