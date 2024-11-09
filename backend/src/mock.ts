import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function createNotes(count = 20) {
  const emoji = ["😊", "🚀", "🌟", "🔥", "💡"];
  for (let i = 0; i < count; i++) {
    const title =
      faker.lorem.words(faker.number.int({ min: 1, max: 10 })) +
      " " +
      emoji[faker.number.int({ min: 0, max: emoji.length - 1 })];
    const content = `
      <p>${faker.lorem.paragraphs(2)}</p>
      <p><a href="${faker.internet.url()}">Link</a></p>
      <p><img src="${faker.image.url()}" alt="Random Image"></p>
    `;

    await prisma.note.create({
      data: {
        title,
        content,
      },
    });
  }
}

createNotes()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  })
  .finally(() => {
    prisma.$disconnect();
  });
