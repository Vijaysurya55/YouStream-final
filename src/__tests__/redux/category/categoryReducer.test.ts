import { CATEGORY_SET } from "../../../redux/category/categoryTypes";

import categoryReducer from "../../../redux/category/categoryReducer";

describe('categoryReducer',()=>{
    const initialState ={
  selectedId: null,
  selectedTitle: null,
};

test('handles CATEGORY_SET',()=>{
    const action = {
        type:CATEGORY_SET,
            payload:{
                id:"1",
                title:"Sports"
            }
        
    }
    const state = categoryReducer(initialState,action)
    expect(state).toEqual({selectedId:"1",
                selectedTitle:"Sports"})
})

test('handles undefined state',()=>{
    const state = categoryReducer(undefined,"@@@INIT")
    expect(state).toEqual(initialState)
})

test('handles null values',()=>{
    const action = {
        type:CATEGORY_SET,
            payload:{
            }
        
    }
    const currentState = {
         selectedId: "1",
  selectedTitle: "Sports",
    }
    const state = categoryReducer(currentState,action)
    expect(state).toEqual({
        selectedId:null,
        selectedTitle:null
    })
})

test('handles default case',()=>{
    const action = {
        type:"No category match",
            payload:{
                id:"1",
                title:"Sports"
            }
        
    }
    const state = categoryReducer(initialState,action)
    expect(state).toEqual(initialState)
})
})