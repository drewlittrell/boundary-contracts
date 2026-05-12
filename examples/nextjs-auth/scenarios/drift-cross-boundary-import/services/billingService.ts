export function createInvoice(userId: string): { userId: string; status: "draft" } {
  return { userId, status: "draft" };
}
