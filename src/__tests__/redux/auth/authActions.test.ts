import { AUTH_SET, AUTH_SIGN_OUT, AUTH_UPDATE_LOCAL_USER } from '../../../redux/auth/authTypes'
import { setAuth, signOut, updateLocalUser } from "../../../redux/auth/authActions"; // Make sure to use the correct file name here

describe('Auth Actions', () => {

    test('setAuth should create an action to set authentication details', () => {
        const mockPayload = {
            user: { id: '123', name: 'Test User' },
            token: 'mock-token-string',
            provider: "google",
        };
        const expectedAction = {
            type: AUTH_SET,
            payload: mockPayload,
        };

        expect(setAuth(mockPayload)).toEqual(expectedAction);
    });

    test('signOut should create an action to sign out a user', () => {
        const expectedAction = {
            type: AUTH_SIGN_OUT,
        };

        expect(signOut()).toEqual(expectedAction);
    });

    test('updateLocalUser should create an action to update local user details', () => {
        const mockUserUpdate = {
            name: 'Updated Name',
            email: 'updated@example.com',
        };
        const expectedAction = {
            type: AUTH_UPDATE_LOCAL_USER,
            payload: mockUserUpdate,
        };

        expect(updateLocalUser(mockUserUpdate)).toEqual(expectedAction);
    });
});
