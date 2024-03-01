import axios from 'axios'

// Replace 'YOUR_API_BASE_URL' with your actual API base URL or use an environment variable
const axiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simulate a delay of 2 seconds in every request
axiosInstance.interceptors.response.use(
  (response) =>
    new Promise(
      (resolve) => setTimeout(() => resolve(response), 2000) // Adjust 2000 to however many milliseconds you want the delay to be
    )
)
export default axiosInstance
