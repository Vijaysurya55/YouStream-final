import { AUTH_SET, AUTH_SIGN_OUT, AUTH_UPDATE_LOCAL_USER } from "../../../redux/auth/authTypes";
import authReducer from "../../../redux/auth/authReducer";

const initialState = {
    user: null,
    token: null,
    provider: null,
}

describe('authReducer', () => {
    test("should return the initial state", () => {
        expect(authReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState)
    })

    test('Handles AUTH_SET action correctly', () => {
        const action = {
            type: AUTH_SET,
            payload: {
                user: { id: "123", name: "Vijay" },
                token: "mock-token",
                provider: "google",
            },
        };
        const expectedState = {
            user: { id: "123", name: "Vijay" },
            token: "mock-token",
            provider: "google"
        }
        expect(authReducer(initialState, action)).toEqual(expectedState)
    })

    test('Handles AUTH_SET action for null values', () => {
        const action = {
            type: AUTH_SET,
            payload: {
                user: null,
                token: null,
                provider: null,
            },
        };
        expect(authReducer(initialState, action)).toEqual(initialState)

    })

    test('Handles AUTH_UPDATE_LOCAL_USER action correctly', () => {
        const initialState = {
            user: { id: "123" , name: "Vijay", email: "vijay@gmail.com" },
            token: "mock-token",
            provider: "google",
        }
        const updatedState = { id: "123", name: "Surya", email: "vijay@gmail.com" }

        const action = {
            type: AUTH_UPDATE_LOCAL_USER,
            payload: updatedState
        }
        const expectedState = {
            user: updatedState,
            token: "mock-token",
            provider: "google"
        }

        expect(authReducer(initialState, action)).toEqual(expectedState)
    })

    test('Handles AUTH_SIGN_OUT action correctly', () => {
        const currentState = {
            user: { id: "123", name: "Vijay", email: "vijay@gmail.com" },
            token: "mock-token",
            provider: "google",
        }
        const action = {
            type: AUTH_SIGN_OUT,
        };
        expect(authReducer(currentState, action)).toEqual(initialState)
    })

    test('return current state by default', () => {
        const currentState = {
            user: { id: "123", name: "Vijay", email: "vijay@gmail.com" },
            token: "mock-token",
            provider: "google",
        }
        expect(authReducer(currentState, {})).toEqual(currentState)
    })
})