import { BadgeCheck, Clock, Ban, Archive } from "lucide-react";
import clsx from "clsx";

type Status = "active" | "closed" | "archived";

type Props = {
  status: Status;
};

export default function StatusBadge({ status }: Props) {
  const statusConfig = {
    active: {
      label: "Dibuka",
      color: "bg-green-100 text-green-800",
      icon: <BadgeCheck className="w-4 h-4" />,
    },
    closed: {
      label: "Ditutup",
      color: "bg-red-100 text-red-800",
      icon: <Ban className="w-4 h-4" />,
    },
    archived: {
      label: "Draft",
      color: "bg-gray-100 text-gray-700",
      icon: <Archive className="w-4 h-4" />,
    },
  };

  const { label, color, icon } = statusConfig[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700",
    icon: <Clock className="w-4 h-4" />,
  };

  return (
    <span
      className={clsx("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize", color)}
    >
      {icon}
      {label}
    </span>
  );
}
