import axios from "axios"
import config from "@/apis/config"
import JWTManager from "@/apis/jwt"
import Cookies from "js-cookie"

/**
 * Error caused by axios (or other api interaction)
 */
export class ApiError extends Error {
  constructor(originalError, message) {
    super(message)
    this.originalError = originalError
  }
}

export const refreshAxios = axios.create()

export const jwt = new JWTManager()
jwt.refreshErrorCallback = async refreshError => {
  if (refreshError.response?.status === 401) {
    Cookies.remove("access", { domain: config.cookieDomain })
    Cookies.remove("refresh", { domain: config.cookieDomain })
      if (refreshError.response.data.message) {
        return Promise.reject(
            new ApiError(
              refreshError,
              `${refreshError.response.status}: ${refreshError.response.data.message}`
            )
          )
      } else {
        return Promise.reject(
          new ApiError(refreshError, "会话已过期，请重新登录")
        )
      }
    }
}

const refresh = async () => {
    const response = await refreshAxios.post("/refresh")
    Cookies.set("access", response.data.access, {
      domain: config.cookieDomain,
      expires: 10
    })
    Cookies.set("refresh", response.data.refresh, {
      domain: config.cookieDomain,
      expires: 10
    })
    return camelizeKeys(response.data)
} 
jwt.refresh = async () => (await refresh()).access

const requestInterceptor = config => {
  const token = Cookies.get("access")
  if (token && config.headers) config.headers.Authorization = "Bearer " + token
  console.log(config)
  return config
}

const refreshRequestInterceptor = config => {
  const token = Cookies.get("refresh")
  if (token && config.headers) config.headers.Authorization = "Bearer " + token
  console.log(config)
  return config
}

axios.interceptors.response.use(
  response => response,
  jwt.responseErrorInterceptor
)

axios.defaults.baseURL = config.backendAPI
refreshAxios.defaults.baseURL = config.authUrl
axios.interceptors.request.use(requestInterceptor)
refreshAxios.interceptors.request.use(refreshRequestInterceptor)

axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        window.location.href = config.authBaseUrl + '/login?url=' + location.origin
      }
      return Promise.reject(error)
    }
  )

export default axios
