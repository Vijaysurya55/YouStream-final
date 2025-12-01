import { CATEGORY_SET } from "../../../redux/category/categoryTypes";

describe('Category types constant',()=>{
    test('CATEGORY_SET should be define',()=>{
        expect(CATEGORY_SET).toBeDefined()
        expect(CATEGORY_SET).toBe("CATEGORY_SET")
    })
})