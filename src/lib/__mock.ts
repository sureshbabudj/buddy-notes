import { faker } from "@faker-js/faker";
import { Note } from "@/types";

export function createNotes(count = 20) {
  const notes: Omit<Note, "id">[] = [];
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

    notes.push({
      title,
      content,
    });
  }

  return notes;
}
