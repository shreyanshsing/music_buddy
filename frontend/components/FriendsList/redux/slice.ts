import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    friendsList?: any
}

const initialState: IState = {
    friendsList: undefined
}

export const FriendListSlice = createSlice({
    name: 'friendsList-reducer',
    initialState: initialState,
    reducers: {
        setFriendsList: (state: IState, action: PayloadAction<any>) => {
            state.friendsList = action.payload
        }
    }
})

export const { setFriendsList } = FriendListSlice.actions

interface TState {
    'friendsList-reducer': IState
}

export const getFriendsList = (state: TState) => state?.["friendsList-reducer"].friendsList

