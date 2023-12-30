import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    user?: any
}

const initialState: IState = {
    user: undefined
}

export const SignupSlice = createSlice({
    name: 'signup-reducer',
    initialState: initialState,
    reducers: {
        setUser: (state: IState, action: PayloadAction<any>) => {
            state.user = action.payload
        }
    }
})

export const { setUser } = SignupSlice.actions

interface TState {
    'signup-reducer': IState
}

export const getUser = (state: TState) => state?.["signup-reducer"].user

