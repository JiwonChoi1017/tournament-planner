import Link from "next/link";
import { PAGES_URL } from "@/constants/commonConstant";

export default function Home() {
  return (
    <>
      <Link href={PAGES_URL.TOURNAMENT_INPUT}>トーナメント表を作成</Link>
    </>
  );
}
