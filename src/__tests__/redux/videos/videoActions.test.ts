import { fetchTrendingVideos } from "../../../redux/videos/videoActions";
import configureMockStore from "redux-mock-store";
import {thunk} from "redux-thunk";
import { getMostPopularVideos } from "../../../api/youtubeApi";
import * as types from '../../../redux/videos/video.types'

jest.mock("../../../api/youtubeApi", () => ({
  getMostPopularVideos: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchTrendingVideos',()=>{
let store;
beforeEach(() => {
    store = mockStore({});
    (getMostPopularVideos as jest.Mock).mockReset();
  });

  test('dispatches REQUEST and SUCCESS for the first page and no next pagetoken', async () =>{
    (getMostPopularVideos as jest.Mock).mockImplementation(async () =>({
        items:["video1","video2"],
        nextPageToken: "NEXT_TOKEN",
    }))
     await store.dispatch(fetchTrendingVideos());
     const actions = store.getActions();

     expect(actions[0]).toEqual({
      type: types.FETCH_TRENDING_VIDEOS_REQUEST,
    });

    expect(getMostPopularVideos).toHaveBeenCalledWith(undefined, 12);
 expect(actions[1]).toEqual({
      type: types.FETCH_TRENDING_VIDEOS_SUCCESS,
      payload: {
        items: ["video1", "video2"],
        nextPageToken: "NEXT_TOKEN",
        append: false, 
      },
    });
  })

  test('dispatches REQUEST and SUCESS for next page append is true', async()=>{
    (getMostPopularVideos as jest.Mock).mockImplementation(async () => ({
        items:["video1","video2"],
        nextPageToken: "NEXT_TOKEN",
    }))

    await store.dispatch(fetchTrendingVideos("PAGE2"))
    const actions = store.getActions();
    expect (actions[0]).toEqual({type:types.FETCH_TRENDING_VIDEOS_REQUEST})

    expect(actions[1]).toEqual({type:types.FETCH_TRENDING_VIDEOS_SUCCESS, payload:{
        items:["video1","video2"],
        nextPageToken: "NEXT_TOKEN",
        append:true
    }})
  })

  test('dispatches REQUEST and FAILURE when api fails',async()=>{
    (getMostPopularVideos as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await store.dispatch(fetchTrendingVideos())
    const actions= store.getActions()
    expect(actions[0]).toEqual({type:types.FETCH_TRENDING_VIDEOS_REQUEST})

    expect(actions[1]).toEqual({type:types.FETCH_TRENDING_VIDEOS_FAILURE, payload:"Network error"})

  })
})