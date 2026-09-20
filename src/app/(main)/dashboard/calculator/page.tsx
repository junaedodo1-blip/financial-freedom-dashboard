import { Metadata } from "next";
import { FreedomCalculatorHub } from "@/components/calculator/FreedomCalculatorHub";

export const metadata: Metadata = {
  title: "Freedom Gap Calculator | Kalo Systems",
  description:
    "Financial freedom gap calculator for high earners ($150k+). Calculates monthly freedom gap and matches prospects with local Canadian branch coaches.",
};

export default function CalculatorPage() {
  return <FreedomCalculatorHub />;
}
