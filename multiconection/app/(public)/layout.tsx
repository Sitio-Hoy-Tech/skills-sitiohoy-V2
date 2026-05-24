import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const waLink = buildWhatsAppLink({
    message: "Hola, quiero hacer una consulta sobre pantallas LED.",
  });

  return (
    <>
      <Header waLink={waLink} />
      <main>{children}</main>
      <Footer waLink={waLink} />
      <WhatsAppFloat waLink={waLink} />
    </>
  );
}
