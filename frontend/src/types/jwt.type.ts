export type JwtPayload = {
  sub: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  iat: number;
  exp: number;
};
