import { mutate } from "swr";

export default function Mutate(url: string) {
  return mutate((key: string) => {
    if (typeof key === "string") {
      return key?.startsWith(url);
    }
    return false;
  });
}
