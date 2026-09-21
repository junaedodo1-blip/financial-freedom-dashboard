import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ "not-found": ["404"] }];
}

export default function DashboardNotFound() {
  notFound();
}
