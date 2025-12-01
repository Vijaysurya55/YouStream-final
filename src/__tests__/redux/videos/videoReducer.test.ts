import videoReducer from "../../../redux/videos/videoReducer";
import * as types from '../../../redux/videos/video.types'


describe('videoReducer',()=>{
    const initialState = {
     trending: [],
  loading: false,
  error: null,
  nextPageToken: null,   
    }

    test('handles fetch tredning videos request',()=>{
        const action = {type:types.FETCH_TRENDING_VIDEOS_REQUEST}

        const state = videoReducer(initialState,action)

        expect(state).toEqual({
            ...initialState,
            loading:true,
            error:null
        })
    })

    test('handles fetch trending videos success append is false',()=>{
        const action = {
            type:types.FETCH_TRENDING_VIDEOS_SUCCESS,
            payload:{
                items:['video1','video2'],
                nextPageToken: "Next Token",
                append:false
            }
        }

        const state=videoReducer(initialState,action)

        expect(state).toEqual({
            ...initialState,
            trending:['video1','video2'],
            nextPageToken: "Next Token",
                loading:false,
                error:null
        })
    })
    test('handles fetch trending videos success append is false and items is empty',()=>{
        const action = {
            type:types.FETCH_TRENDING_VIDEOS_SUCCESS,
            payload:{
                items:null,
                nextPageToken: "Next Token",
                append:false
            }
        }

        const state=videoReducer(initialState,action)

        expect(state).toEqual({
            ...initialState,
            trending:[],
            nextPageToken: "Next Token",
                loading:false,
                error:null
        })
    })

    test('handles fetch trending videos success append is true',()=>{
       const oldState = {
        trending : ['video1','video2'],
        loading:false,
        error:null,
        nextPageToken : null
       } 

        const action = {
            type:types.FETCH_TRENDING_VIDEOS_SUCCESS,
            payload:{
                items:['video3'],
                nextPageToken: "Next Token",
                append:true
            }
        }

        const state=videoReducer(oldState,action)

        expect(state).toEqual({
            ...initialState,
            trending:['video1','video2','video3'],
            nextPageToken: "Next Token",
                loading:false,
                error:null
        })
    })

    test('handles fetch trending videos success append is true adn items is empty',()=>{
       const oldState = {
        trending : ['video1','video2'],
        loading:false,
        error:null,
        nextPageToken : null
       } 

        const action = {
            type:types.FETCH_TRENDING_VIDEOS_SUCCESS,
            payload:{
                items:null,
                nextPageToken: null,
                append:true
            }
        }

        const state=videoReducer(oldState,action)

        expect(state).toEqual({
            ...initialState,
            trending:['video1','video2'],
            nextPageToken: null,
                loading:false,
                error:null
        })
    })

    test('handles fetch trendidng videos failure',()=>{
        const action= {
            type:types.FETCH_TRENDING_VIDEOS_FAILURE,
            payload: "Network error",
        }

        const state = videoReducer(initialState,action)

        expect(state).toEqual({
            ...initialState,
            loading:false,
            error:"Network error"
        })
    })
    test('handles fetch trendidng videos failure and action.payload is not provided',()=>{
        const action= {
            type:types.FETCH_TRENDING_VIDEOS_FAILURE,
        }

        const state = videoReducer(initialState,action)

        expect(state).toEqual({
            ...initialState,
            loading:false,
            error:"Unknown error"
        })
    })
    test('handles default case',()=>{
        const state = videoReducer(undefined,"@@@INIT")

        expect(state).toEqual(initialState)
    })
})