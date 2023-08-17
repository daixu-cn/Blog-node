interface Params {
  code?: number;
  data?: any;
  message?: string;
}

interface Response {
  code: number;
  data: any;
  message: string;
}

export default function response(params: Params): Response {
  return {
    code: params.code ?? 0,
    data: params.data ?? null,
    message: params.message ?? "操作成功"
  };
}
