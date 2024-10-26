import { Section } from "@/app/_components/Section";
import { TeacherCreatePageAboutForm } from "@/app/_features/teacher/teacher-create-page/TeacherCreatePageAboutForm";
import { TeacherCreatePageContactForm } from "@/app/_features/teacher/teacher-create-page/TeacherCreatePageContactForm";
import { httpResponseStatusCode } from "@/app/_utils/httpResponseStatusCode";
import { createSupabaseServerClient } from "@/app/_utils/supabase/createSupabaseServerClient";
import { createSupabaseServiceRoleClient } from "@/app/_utils/supabase/createSupabaseServiceRoleClient";
import { Typography } from "@mui/material";

export default async function Page() {
  const {
    data: { user },
    error: userError,
  } = await createSupabaseServerClient().auth.getUser();

  if (!user || userError) throw httpResponseStatusCode.Unauthorized;

  const { data: teacher } = await createSupabaseServiceRoleClient()
    .from("teacher")
    .select()
    .eq("userId", user.id)
    .single();

  return (
    <Section>
      <Typography variant="h5">About you</Typography>
      <TeacherCreatePageAboutForm teacher={teacher} />
    </Section>
  );
}
