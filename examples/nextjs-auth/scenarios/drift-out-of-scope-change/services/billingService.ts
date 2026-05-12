export function createInvoice(userId: string): { userId: string; status: "draft"; source: "manual" } {
  return { userId, status: "draft", source: "manual" };
}
