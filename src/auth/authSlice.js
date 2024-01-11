import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userApi from '../api/authApi';

const initialState = {
  user:  localStorage.getItem('user_quanlydoanvien') || null,
  id_user: localStorage.getItem('id_user_quanlydoanvien') || null,
  roles_quanlydoanvien:  localStorage.getItem('roles_quanlydoanvien') || null,
};


export const loginAccount = createAsyncThunk(
  'user/login', // tên action khi dispatch
  async(payload) => {    
          let {data} = await userApi.login(payload);
          //save accessToken vào localstorerage
              localStorage.setItem('accessToken_quanlydoanvien', data.accessToken)
              localStorage.setItem('user_quanlydoanvien', data.tentaikhoan)         
              localStorage.setItem('id_user_quanlydoanvien', data._id)         
              localStorage.setItem('roles_quanlydoanvien', data.roles)         
          return data

  }
);

export const logoutAccount = createAsyncThunk(
  'user/logout',
  async() => {
      await userApi.logout();  
      localStorage.removeItem('user_quanlydoanvien');
      localStorage.removeItem('id_user_quanlydoanvien');   
      localStorage.removeItem('accessToken_quanlydoanvien');   
      localStorage.removeItem('roles_quanlydoanvien');   
  }
)



export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refreshToken: (state, action) => {
      localStorage.setItem('accessToken_quanlydoanvien', action.payload)
  },
    changeRole: (state, action) => {
      state.roles_quanlydoanvien = action.payload;
      localStorage.setItem('roles_quanlydoanvien', action.payload)         
    },
    logout: (state, action) => {
      state.user = null;
      state.id_user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAccount.fulfilled, (state, action) => {
        // action is inferred correctly here if using TS
                state.user = action.payload.tentaikhoan; // action.payload là cái return từ createAsyncThunk         
                state.id_user = action.payload._id; // action.payload là cái return từ createAsyncThunk         
                state.roles_quanlydoanvien = action.payload.roles
      })
    builder.addCase(loginAccount.rejected, (state, action) => {
        // action is inferred correctly here if using TS
                state.user = null; // action.payload là cái return từ createAsyncThunk         
                state.roles_quanlydoanvien = null
      })
      builder.addCase(logoutAccount.fulfilled, (state, action) => {
        // action is inferred correctly here if using TS
                state.user = null; // action.payload là cái return từ createAsyncThunk         
                state.id_user = null; // action.payload là cái return từ createAsyncThunk         
                state.roles_quanlydoanvien = null
      })
    builder.addCase(logoutAccount.rejected, (state, action) => {
        // action is inferred correctly here if using TS
                state.user = null; // action.payload là cái return từ createAsyncThunk         
                state.roles_quanlydoanvien = null
      })
  }
})

// Action creators are generated for each case reducer function
export const {changeRole, logout} = authSlice.actions

export default authSlice.reducer