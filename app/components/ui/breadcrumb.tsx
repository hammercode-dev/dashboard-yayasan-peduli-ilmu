import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

export const Breadcrumb = ({ children }: { children: React.ReactNode }) => (
  <nav aria-label="breadcrumb">{children}</nav>
);

export const BreadcrumbList = ({ children }: { children: React.ReactNode }) => (
  <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-600 sm:gap-2.5">{children}</ol>
);

export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => (
  <li className="inline-flex items-center gap-1.5">{children}</li>
);

export const BreadcrumbLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link to={href} className="transition-colors hover:text-gray-900">
    {children}
  </Link>
);

export const BreadcrumbSeparator = ({ children }: { children?: React.ReactNode }) => (
  <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
    {children || <ChevronRight />}
  </li>
);

export const BreadcrumbPage = ({ children }: { children: React.ReactNode }) => (
  <span role="link" aria-disabled="true" aria-current="page" className="font-normal text-gray-900">
    {children}
  </span>
);
