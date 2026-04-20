import { Container } from "#/shared/ui/container";
import * as m from "#/paraglide/messages";

export function Footer() {
  const parts = m.footer_built_on({ obyte: "[OBYTE]" }).split("[OBYTE]");

  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <Container>
        {parts.map((part, i) => (
          <span key={i}>
            {i > 0 && (
              <a
                href="https://obyte.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Obyte
              </a>
            )}
            {part}
          </span>
        ))}
      </Container>
    </footer>
  );
}
