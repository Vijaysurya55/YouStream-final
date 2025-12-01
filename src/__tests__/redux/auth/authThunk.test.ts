import { revokeToken } from "../../../api/googleAuth";
import configureStore from 'redux-mock-store'
import { thunk } from 'redux-thunk';
import { loginLocal, signupLocal, loginGoogle, signOutAll, updateLocalUserLikes, toggleLocalSubscription } from '../../../redux/auth/authThunk';
import { setAuth, signOut } from '../../../redux/auth/authActions';
import { AUTH_SET, AUTH_SIGN_OUT, AUTH_UPDATE_LOCAL_USER } from '../../../redux/auth/authTypes';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter'

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const mockAxios = new MockAdapter(axios)

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = String(value);
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock("../../../api/googleAuth", () => ({
    revokeToken: jest.fn(() => Promise.resolve({ status: 200 }))
}))

describe('authThunk', () => {
    let store;
    beforeEach(() => {
        store = mockStore({});
        localStorageMock.clear()
        localStorageMock.setItem.mockClear()
        localStorageMock.getItem.mockClear()
        mockAxios.reset()
        revokeToken.mockClear()
    })

    test('signupLocal creates new user in local storage and dispatches setAuth', async () => {
        const email = 'vijay@gmail.com'
        const password = "123456"
        const expectedUser = { email, name: "vijay", likes: {}, subs: [], watchlater: [] }

        const expectedActions = [
            { type: AUTH_SET, payload: { user: expectedUser, token: null, provider: "local" } }
        ]
        const expectedCurrentAuth = {
            user: expectedUser,
            token: null,
            provider: "local"
        };

        await store.dispatch(signupLocal(email, password))

        expect(store.getActions()).toEqual(expectedActions)
        expect(localStorageMock.setItem).toHaveBeenCalledWith("youstream_local_user:" + email, JSON.stringify(expectedUser));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('youstream_current_auth', JSON.stringify(expectedCurrentAuth))
    })

    test('loginLocal retrieves from local storage and checks', async () => {
        const email = "vijay@gmail.com";
        const password = "123456";
        const user = {
            email,
            name: "vijay"
        }
        const expectedCurrentAuth = {
            user: user,
            token: null,
            provider: "local"
        };

        localStorageMock.setItem(`youstream_local_user:${email}`, JSON.stringify(user))

        const expectedAction = [
            { type: AUTH_SET, payload: { user, token: null, provider: "local" } }
        ]

        await store.dispatch(loginLocal(email, password))

        expect(store.getActions()).toEqual(expectedAction)
        expect(localStorageMock.getItem).toHaveBeenCalledWith(`youstream_local_user:${email}`)
        expect(localStorageMock.setItem).toHaveBeenCalledWith("youstream_current_auth", JSON.stringify(expectedCurrentAuth))
        await store.dispatch(loginLocal("surya@gmail.com", password))

    })

    test('loginGoogle saves current auth and updates store', async () => {
        const email = "vijay@gmail.com"
        const name = "vijay"
        const idToken = "idToken"
        const accessToken = "accessToken"
        const user = {
            email,
            name: name || email.split("@")[0],
            likes: {},
            subs: [],
            watchlater: [],
        };

        const expectedActions = [
            { type: AUTH_SET, payload: { user: user, token: accessToken, provider: "google" } }
        ]

        await store.dispatch(loginGoogle({ email, name, idToken, accessToken }))

        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorageMock.setItem).toHaveBeenCalledWith("youstream_current_auth", JSON.stringify({ user, token: accessToken, provider: "google" }))

        await store.dispatch(loginGoogle({ email, idToken, accessToken }))

    })

    test('signOut all revokes token and removes current auth from local storage', async () => {
        store = mockStore({
            auth: { token: 'mock-token', user: {}, provider: 'google' }
        });
        localStorageMock.setItem("youstream_current_auth", "currently authenticated user");

        const expectedActions = [
            { type: AUTH_SIGN_OUT }
        ];

        await store.dispatch(signOutAll());

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken).toHaveBeenCalledWith('mock-token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('youstream_current_auth');
        expect(store.getActions()).toEqual(expectedActions);


    })

    test('updateLocalUserLikes updates likes, localStorage, and dispatches update action', async () => {
        const initialState = {
            auth: {
                user: { email: 'vijay@gmail.com', likes: { 'video1': 'like' }, subs: [], watchlater: [] },
                provider: 'local',
                token: null,
            }
        };
        store = mockStore(initialState);

        await store.dispatch(updateLocalUserLikes('video2', 'dislike'));

        const expectedUser = {
            email: 'vijay@gmail.com',
            likes: { 'video1': 'like', 'video2': 'dislike' },
            subs: [],
            watchlater: []
        };

        const expectedActions = [
            { type: AUTH_UPDATE_LOCAL_USER, payload: expectedUser }
        ];

        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'youstream_local_user:vijay@gmail.com', JSON.stringify(expectedUser)
        );
        const expectedCurrentAuth = {
            user: expectedUser,
            token: null,
            provider: "local"

        }
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'youstream_current_auth', JSON.stringify(expectedCurrentAuth)
        );
        await store.dispatch(updateLocalUserLikes('video2', 'none'));

    });

    test('updateLocalUserLikes return immediately if no user or provider is not local', async () => {
        const initialState = {
            auth: {
                user: { email: 'vijay@gmail.com', likes: { 'video1': 'like' }, subs: [], watchlater: [] },
                provider: 'google',
                token: null,
            }
        };
        store = mockStore(initialState);

        await store.dispatch(updateLocalUserLikes('video2', 'dislike'));

        expect(store.getActions).toHaveLength(0)
        expect(localStorageMock.setItem).not.toHaveBeenCalled();

    });

    test('toggleLocalSubscription updates redux and stores in local storage', async () => {
        const initialState = {
            auth: {
                user: { email: 'vijay@gmail.com', likes: { 'video1': 'like' }, subs: [], watchlater: [] },
                provider: 'local',
                token: null,
            }
        };
        store = mockStore(initialState);

        await store.dispatch(toggleLocalSubscription("ABC"))

        const expectedUser = {
            email: 'vijay@gmail.com',
            likes: { 'video1': 'like' },
            subs: ["ABC"],
            watchlater: []
        };
        const expectedActions = [
            { type: AUTH_UPDATE_LOCAL_USER, payload: expectedUser }
        ];

        expect(store.getActions()).toEqual(expectedActions)
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'youstream_local_user:vijay@gmail.com', JSON.stringify(expectedUser)
        );
        const expectedCurrentAuth = {
            user: expectedUser,
            token: null,
            provider: "local"

        }
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'youstream_current_auth', JSON.stringify(expectedCurrentAuth)
        );
        // await store.dispatch(toggleLocalSubscription('ABC'));


    })

    test('toggleLocalSubscription should return early and dispatch no actions if the provider is not local', async () => {
        const initialState = {
            auth: {
                user: { email: 'user@google.com' },
                provider: 'google',
                token: 'accessToken'
            }
        };
        store = mockStore(initialState);

        await store.dispatch(toggleLocalSubscription('ABC'));

        expect(store.getActions()).toHaveLength(0);
        expect(localStorageMock.setItem).not.toHaveBeenCalled();

    });
})