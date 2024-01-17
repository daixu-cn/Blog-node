export interface Params {
  code?: number;
  data?: any;
  message?: string;
}

export interface WSParams extends Params {
  tag: string;
}

export interface Response {
  code: number;
  data: any;
  message: string;
  tag?: string;
}
