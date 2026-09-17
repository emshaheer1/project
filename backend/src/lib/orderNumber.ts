import { prisma } from "./prisma";

const ORDER_PREFIX = "AP-";
const START_NUMBER = 1201;

function parseSequence(orderNumber: string) {
  const parsed = Number.parseInt(orderNumber.slice(ORDER_PREFIX.length), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function highestSequence() {
  const last = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: ORDER_PREFIX } },
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });
  if (!last?.orderNumber) return START_NUMBER - 1;
  return parseSequence(last.orderNumber) ?? START_NUMBER - 1;
}

/** Assign AP-#### to any orders that are missing a proper public number. */
export async function backfillOrderNumbers() {
  const legacy = await prisma.order.findMany({
    where: { NOT: { orderNumber: { startsWith: ORDER_PREFIX } } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!legacy.length) return 0;

  let next = (await highestSequence()) + 1;
  for (const order of legacy) {
    await prisma.order.update({
      where: { id: order.id },
      data: { orderNumber: `${ORDER_PREFIX}${next}` },
    });
    next += 1;
  }
  return legacy.length;
}

/** Next public order number, e.g. AP-1201, AP-1202, … */
export async function nextOrderNumber(): Promise<string> {
  const next = (await highestSequence()) + 1;
  return `${ORDER_PREFIX}${next}`;
}
