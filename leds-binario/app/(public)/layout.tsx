import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header brandName="Leds Binario" />
      <main>{children}</main>
      <Footer brandName="Leds Binario" />
      <WhatsAppFloat />
    </>
  );
}
