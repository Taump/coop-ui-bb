import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({ component: Faq });

const faqs = [
  {
    q: "What is COOP?",
    a: "COOP is a token on Obyte designed to encourage cooperative community engagement. The initial supply is 0 — all COOP is created through daily emission and distributed among participants who lock their tokens and contribute to the community.",
  },
  {
    q: "What is the goal of COOP?",
    a: "The goal is to reinvigorate the Obyte community by anchoring positive emotions, rewarding contributions, making people return to the community, and encouraging organic activity.",
  },
  {
    q: "How do I start?",
    a: "Deposit COOP or GBYTE to the COOP Autonomous Agent. Your funds are locked for at least 1 year. You must be attested on Telegram or Discord (for bot notifications) and either real-name attested or deposit at least 500 COOP.",
  },
  {
    q: "How is new COOP created?",
    a: "Every day, 1% of the total locked balance is added to locked balances, and 0.1% is distributed as liquid COOP. This emission is split 50/50: half goes proportionally to votes received (benefits work contributors), half goes proportionally to votes multiplied by balance (benefits financial contributors).",
  },
  {
    q: "What are the types of contributions?",
    a: "There are three main types: (1) Work — development (tools, apps, improvements) and social (articles, tweets, videos); (2) Financial — buying and locking COOP/GBYTE in significant amounts; (3) Curation — recognizing contributors, encouraging votes, discovering underappreciated work, and supporting healthy discussions.",
  },
  {
    q: "How does voting work?",
    a: "Users cast votes for others who make useful contributions. Vote weight equals the square root of the voter's locked balance — a middle ground between democracy and plutocracy. Vote strength can be 1, 2, or 3 (use 0 to unvote). Votes expire after 3 months, so contributors must keep contributing to maintain their income.",
  },
  {
    q: "Who is eligible to vote and receive distributions?",
    a: "Your unlock date must be at least 1 year into the future. This ensures that participants have long-term commitment to the community.",
  },
  {
    q: "Can I lock GBYTE instead of COOP?",
    a: "Yes. The COOP price in GBYTE follows a formula that starts at 1 and doubles every year. If the market price of COOP grows faster than the formula, buy pressure redirects to GBYTE. You can also replace locked GBYTE for locked COOP (and vice versa) at the formula price, which creates arbitrage that stabilizes the COOP price.",
  },
  {
    q: "How do referrals work?",
    a: "When making your first deposit, you can indicate a referrer. Both get a fixed reward (capped by balances) to their locked accounts. The referrer also receives 1% of your lifetime deposits in liquid COOP. Referrers can waive this reward for family and friends.",
  },
  {
    q: "Is tit-for-tat voting allowed?",
    a: "It's not prohibited. However, it requires separate negotiation for each arrangement and doesn't scale as well as posting about genuine contributions and receiving many votes in response. It resembles the FRIEND token mechanics and encourages pairwise connections, which is useful too.",
  },
  {
    q: "How does governance work?",
    a: "Almost all parameters are changeable by governance vote. Only users with an unlock date more than 1 year into the future can vote. Governance uses quadratic voting (vote weight = square root of locked balance), reducing the power of whales.",
  },
  {
    q: "What happens when the community grows?",
    a: "As the number of contributors grows, voters raise their standards. The community stays relatively small, which keeps it more connected and manageable, where individual voices are heard and contributions are impactful. This creates an air of exclusivity that makes belonging even more attractive.",
  },
  {
    q: "Why participate?",
    a: "Motivations include: making money through emission rewards, belonging to a community of builders, having the power to recognize and reward others, being appreciated for your contributions, and acquiring a leadership role by influencing votes.",
  },
];

function Faq() {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">F.A.Q.</h2>
      <div className="flex max-w-3xl flex-col gap-6">
        {faqs.map((item, i) => (
          <div key={i}>
            <h3 className="mb-1 text-xl font-semibold">{item.q}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
