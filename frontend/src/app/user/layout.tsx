import Navbar from "@/components/fragments/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />

      <div className="h-32 w-full dark:bg-dark2" />
      <div className="mx-auto w-full px-5 md:max-w-[68em] md:px-0">
        {children}
      </div>
    </div>
  );
}
