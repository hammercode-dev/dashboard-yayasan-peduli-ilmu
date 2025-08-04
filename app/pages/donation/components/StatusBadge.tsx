import { BadgeCheck, Clock, Ban, Archive } from "lucide-react";
import type { Status } from "~/pages/donation/types";
import Badge from "~/components/ui/badge";

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
    <Badge className={color}>
      {icon} {label}
    </Badge>
  );
}
