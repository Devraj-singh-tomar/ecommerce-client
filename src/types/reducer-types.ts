import { User } from "./type";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}
