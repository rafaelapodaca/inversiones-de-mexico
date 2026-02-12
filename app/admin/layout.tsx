import HeaderAdmin from "../HeaderAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderAdmin />
      {children}
    </>
  );
}