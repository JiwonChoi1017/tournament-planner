import { createClient } from "@/utils/supabase/server";

export default async function TournamentList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("aaa").select();

  if (error) {
    console.error(error);
  }

  return (
    <>
      <span>Tournament List</span>
    </>
  );
}
