import { createAction, handleActions } from 'redux-actions';

// 액션 타입을 정의해줍니다.
const SET_USERNAME = 'info/setUsername';
const SET_USERID = 'info/setUserid';
const SET_DPNAME = 'info/setDpname';
const SET_USERPIC = 'info/setUserpic';

// 액션 생성 함수를 만듭니다.
export const setUsername = createAction(SET_USERNAME);
export const setUserid = createAction(SET_USERID);
export const setDpname = createAction(SET_DPNAME);
export const setUserpic = createAction(SET_USERPIC);

const initialState = {
  username: '',
  userid:'',
  dpname:'',
  userpic:'',
}

export default handleActions({
  [SET_USERNAME]: (state, action) => {
    // console.log(GET_ACCOUNT, action);
    let newState = {
      ...state,
      username: action.payload.username,
    }
    return newState;
  },
  [SET_USERID]: (state, action) => {
    // console.log(GET_ACCOUNT, action);
    let newState = {
      ...state,
      userid: action.payload.userid,
    }
    return newState;
  },
  [SET_DPNAME]: (state, action) => {
    // console.log(GET_ACCOUNT, action);
    let newState = {
      ...state,
      dpname: action.payload.dpname,
    }
    return newState;
  },
  [SET_USERPIC]: (state, action) => {
    // console.log(GET_ACCOUNT, action);
    let newState = {
      ...state,
      userpic: action.payload.userpic,
    }
    return newState;
  }
}, initialState);