import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import type { User, Referrer } from '@wasp/entities';

// in a terminal window run `wasp db seed` to seed your dev database with this data

const referrerArr: Referrer[] = [
  {
    id: 1,
    name: 'product-hunt',
    count: 27,
  },
  {
    id: 2,
    name: 'twitter',
    count: 26,
  },
  {
    id: 3,
    name: 'linkedin',
    count: 25,
  },
];

let prevUserId = 0;
export function createRandomUser(): Partial<User> {
  const user: Partial<User> = {
    id: ++prevUserId,
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 12,
      prefix: 'Aa1!'
    }),
    createdAt: faker.date.between({ from: new Date('2023-01-01'), to: new Date() }),
    lastActiveTimestamp: faker.date.recent(),
    isAdmin: false,
    isEmailVerified: faker.helpers.arrayElement([true, false]),
    stripeId: `cus_${faker.string.uuid()}`,
    hasPaid: faker.helpers.arrayElement([true, false]),
    sendEmail: false,
    subscriptionStatus: faker.helpers.arrayElement(['active', 'canceled', 'past_due']),
    datePaid: faker.date.recent(),
    credits: faker.number.int({ min: 0, max: 3 }),
    referrerId: faker.number.int({ min: 1, max: 3 }),
  };
  return user;
}

const USERS: Partial<User>[] = faker.helpers.multiple(createRandomUser, {
  count: 50,
});

export async function devSeedUsers(prismaClient: PrismaClient) {
  try {
    await Promise.all(
      referrerArr.map(async (referrer) => {
        await prismaClient.referrer.create({
          data: referrer,
        });
      })
    );
    await Promise.all(
      USERS.map(async (user) => {
        await prismaClient.user.create({
          data: user,
        });
      })
    );
  } catch (error) {
    console.error(error);
  }
}