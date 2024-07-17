import { UserWithoutId } from "../../lib/definitions";

export const users: UserWithoutId[] = [];
for (let i = 1; i <= 51; i++) {
  users.push({
    name: `User${i}`,
    email: `user${i}@nextmail.com`,
    password: "123456",
    alias: `User${i}`,
  });
}
