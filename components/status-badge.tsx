import type { PaymentStatus } from "@/lib/data";

const labels: Record<PaymentStatus, string> = {
  approved: "Одобрен",
  pending: "Новый",
  review: "Проверка",
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`status ${status}`}>{labels[status]}</span>;
}
