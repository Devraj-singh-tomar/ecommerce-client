import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

type ResType =
  | {
      data: MessageResponse;
      //   error?: undefined;
    }
  | {
      //   data?: undefined;
      error: FetchBaseQueryError | SerializedError;
    };

export const responsetoast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);

    if (navigate) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;

    const messageResponse = error.data as MessageResponse;

    toast.error(messageResponse.message);
  }
};
