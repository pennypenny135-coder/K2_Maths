import type { Metadata } from "next";
import TopicSelect from "@/components/TopicSelect";

export const metadata: Metadata = { title: "K2 主題 Topics | 開心數學樂園" };

export default function K2Page() {
  return <TopicSelect level="K2" />;
}
