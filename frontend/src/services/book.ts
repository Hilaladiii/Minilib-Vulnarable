"use server";

import { IResponseError, IResponseSuccess } from "@/types/response.type";
import { cookies } from "next/headers";

export async function addBookService(data: {
  title: string;
  file?: File | undefined; // Change file type to `File | undefined` to allow `undefined`
  author_name: string;
  publisher_name: string;
  year_published: number;
  quantity: number;
}) {
  const cookie = await cookies();
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.file) {
    formData.append("file", data.file);
  }
  formData.append("author_name", data.author_name);
  formData.append("publisher_name", data.publisher_name);
  formData.append("year_published", data.year_published.toString());
  formData.append("quantity", data.quantity.toString());

  const res = await fetch(`${process.env.BASE_API_URL}/book/create`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${cookie.get("token")?.value}`,
    },
  });

  const response: IResponseSuccess & IResponseError = await res.json();
  return response;
}

export async function getBooksService() {
  const cookie = await cookies();
  const res = await fetch(`${process.env.BASE_API_URL}/book`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.get("token")?.value}`,
    },
    cache: "reload",
  });
  const response: IResponseSuccess & IResponseError = await res.json();
  return response;
}

export async function updateBookService(
  id: string,
  data: {
    title: string;
    file?: File;
    author_name: string;
    publisher_name: string;
    year_published: number;
    quantity: number;
  }
) {
  const cookie = await cookies();
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.file) {
    formData.append("file", data.file);
  }
  formData.append("author_name", data.author_name);
  formData.append("publisher_name", data.publisher_name);
  formData.append("year_published", data.year_published.toString());
  formData.append("quantity", data.quantity.toString());

  const res = await fetch(`${process.env.BASE_API_URL}/book/update/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${cookie.get("token")?.value}`,
    },
  });

  const response: IResponseSuccess & IResponseError = await res.json();
  return response;
}

export async function deleteBookService(id: string) {
  const cookie = await cookies();
  const res = await fetch(`${process.env.BASE_API_URL}/book/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${cookie.get("token")?.value}`,
    },
  });
  if (!res.ok) {
    throw new Error();
  }
  const response: IResponseSuccess & IResponseError = await res.json();
  return response;
}
