import { Header } from "#/widgets/header";
import { Footer } from "#/widgets/footer";
import { Container } from "#/shared/ui/container";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 pb-8 pt-8">{children}</Container>
      <Footer />
    </div>
  );
}
