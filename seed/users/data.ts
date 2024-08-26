import { UserWithoutId } from "@/types/definitions";

export const users: any[] = [];
for (let i = 1; i <= 51; i++) {
  users.push({
    name: `User${i}`,
    email: `user${i}@nextmail.com`,
    password: "123456",
    alias: `User${i}`,
  });
}
