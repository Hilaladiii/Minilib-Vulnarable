"use server";

import { IResponseError, IResponseSuccess } from "@/types/response.type";
import { FetchApp } from "@/utils/fetch";
import { cookies } from "next/headers";

export async function getUsersService() {
  const cookie = await cookies();
  const res = await fetch(`${process.env.BASE_API_URL_VULNARABLE}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.get("token")?.value}`,
    },
  });

  const response: IResponseSuccess & IResponseError = await res.json();
  return response;
}

export async function blockUserService(id: string) {
  const res = await FetchApp({
    path: `user/block/${id}`,
    option: {
      method: "PUT",
    },
  });
  return res;
}

export async function unBlockUserService(id: string) {
  const res = await FetchApp({
    path: `user/unblock/${id}`,
    option: {
      method: "PUT",
    },
  });
  return res;
}
