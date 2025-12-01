import { CATEGORY_SET } from "../../../redux/category/categoryTypes";

import { setSelectedCategory } from "../../../redux/category/categoryActions";

describe('Category actions', () => {
    test('setSelectedCategory should update redux store', () => {
        const mockedPayload = {
            id: "1",
            title: "Sports"
        }
        const expectedAction = {
            type: CATEGORY_SET,
            payload: mockedPayload
        }
        expect(setSelectedCategory("1", "Sports")).toEqual(expectedAction)
    })
})