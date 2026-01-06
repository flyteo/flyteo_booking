import slugify from "slugify";
import prisma from "../prisma.js";

export default async function generateUniqueSlug(name) {
  const base = slugify(name, { lower: true });

  // Fetch all slugs that start with base
  const docs = await prisma.hotel.findMany({
    where: {
      slug: {
        startsWith: base
      }
    },
    select: {
      slug: true
    }
  });

  // If no conflicts, return base
  if (docs.length === 0) return base;

  const used = new Set();

  docs.forEach(({ slug }) => {
    if (slug === base) {
      used.add(0);
    } else {
      const match = slug.match(new RegExp(`^${base}-(\\d+)$`));
      if (match) used.add(Number(match[1]));
    }
  });

  let i = 1;
  while (used.has(i)) i++;

  return `${base}-${i}`;
}
