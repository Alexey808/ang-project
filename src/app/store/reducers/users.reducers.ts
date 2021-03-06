import * as userAction from '../actions/users.actions';
import { initialState, IState } from './index';
import { IUser } from '../../api/user/user.interface';

export const getUsers = (state: IState) => state.users;

export const getSelectUsers =
  (state: IState) =>
    state.selectUser;

export function userReducers(state: IState = initialState, action: userAction.Action) {

  switch (action.type) {

    case userAction.TypeUserActions.LOAD_USERS: {
      return {
        ...state,
      };
    }

    case userAction.TypeUserActions.LOAD_USERS_SUCCESS: {
      const users = action.payload;
      return {
        ...state,
        users: [...users]
      };
    }

    case userAction.TypeUserActions.ADD_USER: {
      const newUser = action.payload;
      return {
        ...state,
        users: [...state.users, newUser]
      };
    }

    case userAction.TypeUserActions.SELECT_USER: {
      const selectUser = action.payload;
      return {
        ...state,
        selectUser
      };
    }

    case userAction.TypeUserActions.UPDATE_USER: {
      const updateDataUser = action.payload;
      const users = state.users.map((user: IUser) => {
        if (user.id === updateDataUser.id) { user = updateDataUser; }
        return user;
      });

      return {
        ...state,
        users
      };
    }

    case userAction.TypeUserActions.UPDATE_USERS: {
      const updateDataUsers = action.payload;
      const users = state.users.map((user: IUser) => {
        for (const userUpdate of updateDataUsers) {
          if (user.id === userUpdate.id) { user = userUpdate; }
        }

        return user;
      });

      return {
        ...state,
        users
      };
    }

    case userAction.TypeUserActions.DELETE_USER: {
      const deleteUser = action.payload;
      const users = state.users.filter((user: IUser) => user.id !== deleteUser.id);

      return {
        ...state,
        users
      };
    }

    case userAction.TypeUserActions.DELETE_USERS: {
      return {
        ...state,
        users: []
      };
    }


    default:
      return state;
  }
}
