import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isuserauthenticated = await isAuthenticated();
  return (
    <>
      <Navbar />
      <div className="flex-col min-h-screen flex-center gap-4">
        Create homepage for your app here latter...
        {isuserauthenticated && (
          <Link href={`/connections`}>
            <Button variant="link" className="hover:text-sky-500">
              Connections
            </Button>
          </Link>
        )}
      </div>
      <Footer />
    </>
  );
}
