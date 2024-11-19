"use server";

import { IResponseError, IResponseSuccess } from "@/types/response.type";
import { FetchApp } from "@/utils/fetch";
import { cookies } from "next/headers";

export async function borrowBook(id: string) {
  const cookie = await cookies();
  const res = await fetch(
    `${process.env.BASE_API_URL_VULNARABLE}/borrow/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")?.value}`,
      },
    }
  );
  const response: IResponseError & IResponseSuccess = await res.json();
  return response;
}

export async function returnBookService(id: string) {
  const res = await FetchApp({
    path: `borrow/return/${id}`,
    option: {
      method: "PUT",
    },
  });

  return res;
}

export async function getBorrowUserService() {
  const cookie = await cookies();
  const res = await fetch(
    `${process.env.BASE_API_URL_VULNARABLE}/borrow/user`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")?.value}`,
      },
    }
  );

  const response: IResponseError & IResponseSuccess = await res.json();
  return response;
}

export async function getAllBorrowUserService(query?: string) {
  const res = await FetchApp({
    path: `borrow?type=${query || "RETURNED"}`,
    option: {
      method: "GET",
    },
  });

  return res;
}
