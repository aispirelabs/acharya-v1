import { getCurrentUser } from "@/lib/actions/auth.action";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <MobileNav userName={user?.name || ""} userAvatar={user?.avatar || ""} />
      {children}
    </div>
  );
}