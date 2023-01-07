import { createContext, useReducer, useContext } from "react"
import { Buffer } from "buffer"

const STORAGE_KEY = "platby-jwt"

export const SET_JWT = "SET_JWT"
export const LOG_OUT = "LOG_OUT"

const isTokenExpired = (token) =>
	Date.now() >=
	JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp * 1000
const getJwt = () => {
	const jwt = localStorage.getItem(STORAGE_KEY)
	//console.log(JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString()).exp * 1000)
	//console.log(Date.now())
	if (jwt) {
		if (isTokenExpired(jwt)) {
			console.log("jwt expired")
			return null
		} else {
			console.log("jwt exist")
			return jwt
		}
	} else {
		console.log("jwt not found")
		return null
	}
}

// INITIAL STATE DEBUG:
const initialState = {
	jwt: getJwt(),
}

const dataReducer = (state, action) => {
	switch (action.type) {
		case SET_JWT: {
			localStorage.setItem(STORAGE_KEY, action.payload.jwt)
			return { ...state, jwt: action.payload.jwt }
		}
		case LOG_OUT: {
			localStorage.removeItem(STORAGE_KEY)
			return { ...state, jwt: null }
		}
		default: {
			return state
		}
	}
}

//const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

export const Context = createContext()
export const AuthProvider = ({ children, ...rest }) => {
	const [store, dispatch] = useReducer(dataReducer, initialState) // storedData || initialState

	return <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
}

export const useAuthContext = () => useContext(Context)
