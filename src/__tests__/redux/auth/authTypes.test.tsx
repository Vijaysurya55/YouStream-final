import {
  AUTH_SET,
  AUTH_SIGN_OUT,
  AUTH_UPDATE_LOCAL_USER,
} from "../../../redux/auth/authTypes"; 

describe("Auth Types Constants", () => {

  test("AUTH_SET should be defined", () => {
    expect(AUTH_SET).toBeDefined();
  });

  test("AUTH_SIGN_OUT should be defined", () => {
    expect(AUTH_SIGN_OUT).toBeDefined();
  });

  test("AUTH_UPDATE_LOCAL_USER should be defined", () => {
    expect(AUTH_UPDATE_LOCAL_USER).toBeDefined();
  });

  test("AUTH_SET should have the correct string value", () => {
    expect(AUTH_SET).toBe("AUTH_SET");
  });
  
  test("AUTH_SIGN_OUT should have the correct string value", () => {
    expect(AUTH_SIGN_OUT).toBe("AUTH_SIGN_OUT");
  });
  
  test("AUTH_UPDATE_LOCAL_USER should have the correct string value", () => {
    expect(AUTH_UPDATE_LOCAL_USER).toBe("AUTH_UPDATE_LOCAL_USER");
  });

});
