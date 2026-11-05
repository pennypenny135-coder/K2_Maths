import type { Metadata } from "next";
import { Suspense } from "react";
import QuizGame from "@/components/QuizGame";

export const metadata: Metadata = { title: "答題 Quiz | 開心數學樂園" };

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizGame />
    </Suspense>
  );
}
