import AdminBlogForm, { type AdminBlogFormProps } from "@/features/admin/components/AdminBlogForm";

export type CandidateBlogFormProps = AdminBlogFormProps;

export default function CandidateBlogForm(props: AdminBlogFormProps) {
  return <AdminBlogForm {...props} mode={props.mode ?? "candidate"} />;
}
