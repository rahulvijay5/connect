import { Footer } from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16 md:pl-64">
      {children}
      <Footer />
    </div>
  );
}
