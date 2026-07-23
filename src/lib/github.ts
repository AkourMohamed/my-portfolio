export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionDay[][];
}

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

// Fetched at BUILD TIME only (Astro static output) — the token never
// reaches the browser. Returns null on any failure (missing token,
// network error, rate limit) so a GitHub outage never breaks the build.
export async function fetchContributionCalendar(username: string): Promise<ContributionCalendar | null> {
  const token = import.meta.env.GITHUB_CONTRIB_TOKEN;
  if (!token) return null;

  try {
    const to = new Date();
    // Start of month, 6 months back (inclusive of the current month) —
    // e.g. today in July gives Feb 1, covering Feb-Jul.
    const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 5, 1));

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: username, from: from.toISOString(), to: to.toISOString() },
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week: { contributionDays: { date: string; contributionCount: number; color: string }[] }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
        })),
      ),
    };
  } catch {
    return null;
  }
}
