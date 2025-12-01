import {
    FETCH_TRENDING_VIDEOS_REQUEST,
    FETCH_TRENDING_VIDEOS_FAILURE,
    FETCH_TRENDING_VIDEOS_SUCCESS,
    FETCH_VIDEOS_BY_CATEGORIES_REQUEST,
    FETCH_VIDEOS_BY_CATEGORIES_FAILURE,
    FETCH_VIDEOS_BY_CATEGORIES_SUCCESS,
    FETCH_VIDEO_CATEGORIES_REQUEST,
    FETCH_VIDEO_CATEGORIES_SUCCESS,
    FETCH_VIDEO_CATEGORIES_FAILURE
} from "../../../redux/videos/video.types";
describe("Videos Types Constants", () => {

    test("FETCH_TRENDING_VIDEOS_REQUEST should be defined", () => {
        expect(FETCH_TRENDING_VIDEOS_REQUEST).toBeDefined();
    });
    test("FETCH_TRENDING_VIDEOS_FAILURE should be defined", () => {
        expect(FETCH_TRENDING_VIDEOS_FAILURE).toBeDefined();
    });
    test("FETCH_TRENDING_VIDEOS_SUCCESS should be defined", () => {
        expect(FETCH_TRENDING_VIDEOS_SUCCESS).toBeDefined();
    });
    test("FETCH_VIDEOS_BY_CATEGORIES_REQUEST should be defined", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_REQUEST).toBeDefined();
    });
    test("FETCH_VIDEOS_BY_CATEGORIES_FAILURE should be defined", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_FAILURE).toBeDefined();
    });
    test("FETCH_VIDEOS_BY_CATEGORIES_SUCCESS should be defined", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_SUCCESS).toBeDefined();
    });
    test("FETCH_VIDEO_CATEGORIES_REQUEST should be defined", () => {
        expect(FETCH_VIDEO_CATEGORIES_REQUEST).toBeDefined();
    });
    test("FETCH_VIDEO_CATEGORIES_SUCCESS should be defined", () => {
        expect(FETCH_VIDEO_CATEGORIES_SUCCESS).toBeDefined();
    });
    test("FETCH_VIDEO_CATEGORIES_FAILURE should be defined", () => {
        expect(FETCH_VIDEO_CATEGORIES_FAILURE).toBeDefined();
    });


    test("FETCH_TRENDING_VIDEOS_REQUEST should have the correct string value", () => {
        expect(FETCH_TRENDING_VIDEOS_REQUEST).toBe("FETCH_TRENDING_VIDEOS_REQUEST");
    });

    test("FETCH_TRENDING_VIDEOS_FAILURE should have the correct string value", () => {
        expect(FETCH_TRENDING_VIDEOS_FAILURE).toBe("FETCH_TRENDING_VIDEOS_FAILURE");
    });

    test("FETCH_TRENDING_VIDEOS_SUCCESS should have the correct string value", () => {
        expect(FETCH_TRENDING_VIDEOS_SUCCESS).toBe("FETCH_TRENDING_VIDEOS_SUCCESS");
    });

    test("FETCH_VIDEOS_BY_CATEGORIES_REQUEST should have the correct string value", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_REQUEST).toBe("FETCH_VIDEOS_BY_CATEGORIES_REQUEST");
    });

    test("FETCH_VIDEOS_BY_CATEGORIES_FAILURE should have the correct string value", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_FAILURE).toBe("FETCH_VIDEOS_BY_CATEGORIES_FAILURE");
    });

    test("FETCH_VIDEOS_BY_CATEGORIES_SUCCESS should have the correct string value", () => {
        expect(FETCH_VIDEOS_BY_CATEGORIES_SUCCESS).toBe("FETCH_VIDEOS_BY_CATEGORIES_SUCCESS");
    });

    test("FETCH_VIDEO_CATEGORIES_REQUEST should have the correct string value", () => {
        expect(FETCH_VIDEO_CATEGORIES_REQUEST).toBe("FETCH_VIDEO_CATEGORIES_REQUEST");
    });

    test("FETCH_VIDEO_CATEGORIES_SUCCESS should have the correct string value", () => {
        expect(FETCH_VIDEO_CATEGORIES_SUCCESS).toBe("FETCH_VIDEO_CATEGORIES_SUCCESS");
    });

    test("FETCH_VIDEO_CATEGORIES_FAILURE should have the correct string value", () => {
        expect(FETCH_VIDEO_CATEGORIES_FAILURE).toBe("FETCH_VIDEO_CATEGORIES_FAILURE");
    });

});
