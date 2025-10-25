/* eslint-disable @typescript-eslint/no-explicit-any */
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const key = new TextEncoder().encode(JWT_SECRET);
import { jwtVerify } from "jose";

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });

  return payload;
}
