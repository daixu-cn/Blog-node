import { Params, WSParams, Response } from "./types";

export default function response(params: Params): Response {
  return {
    code: params.code ?? 0,
    data: params.data ?? null,
    message: params.message ?? "操作成功"
  };
}

export function WSResponse(params: WSParams): string {
  return JSON.stringify({
    code: params.code ?? 0,
    data: params.data ?? null,
    message: params.message ?? "操作成功",
    tag: params.tag ?? ""
  });
}
