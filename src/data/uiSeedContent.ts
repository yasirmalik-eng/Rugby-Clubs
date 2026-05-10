type FixtureSeed = {
  key: string;
  opponent: string;
  match_date: string;
  kick_off_time: string;
  venue: string;
  is_home: boolean;
  competition: string;
  tickets_available: boolean;
};

type TicketTemplateSeed = {
  key: string;
  label: string;
  type: "adult" | "junior" | "season_pass";
  price_gbp: number;
  availability: number;
  max_per_order: number;
  description: string;
  feature_bullets: string[];
};

type SponsorSeed = {
  key: string;
  name: string;
  tier: string;
  sort_order: number;
};

type SponsorshipPackageSeed = {
  key: string;
  title: string;
  price_label: string;
  billing_period: string;
  benefits: string[];
  featured?: boolean;
  contact_email: string;
  sort_order: number;
};

type BlogPostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  published_at: string;
  content: string;
};

export const fixtureSeedData: FixtureSeed[] = [
  { key: "batley", opponent: "Batley Bulldogs", match_date: "2026-05-24", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: false, competition: "Betfred Championship", tickets_available: false },
  { key: "salford1", opponent: "Salford RLFC", match_date: "2026-05-31", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "london", opponent: "London Broncos", match_date: "2026-06-07", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "whitehaven", opponent: "Whitehaven", match_date: "2026-06-14", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: false, competition: "Betfred Championship", tickets_available: false },
  { key: "halifax", opponent: "Halifax Panthers", match_date: "2026-06-21", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "salford2", opponent: "Salford RLFC", match_date: "2026-07-05", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: false, competition: "Betfred Championship", tickets_available: false },
  { key: "widnes", opponent: "Widnes Vikings", match_date: "2026-07-12", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "newcastle", opponent: "Newcastle Thunder", match_date: "2026-07-19", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "goole", opponent: "Goole Vikings", match_date: "2026-08-02", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "swinton", opponent: "Swinton Lions", match_date: "2026-08-16", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: false, competition: "Betfred Championship", tickets_available: false },
  { key: "keighley", opponent: "Keighley Cougars", match_date: "2026-08-23", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: true, competition: "Betfred Championship", tickets_available: true },
  { key: "midlands", opponent: "Midlands Hurricanes", match_date: "2026-08-30", kick_off_time: "15:00", venue: "Eirias Stadium, Colwyn Bay", is_home: false, competition: "Betfred Championship", tickets_available: false },
];

export const matchTicketTemplates: TicketTemplateSeed[] = [
  { key: "hospitality", label: "Hospitality", type: "adult", price_gbp: 3500, availability: 80, max_per_order: 4, description: "Premium matchday access for the selected home fixture.", feature_bullets: ["Premium seating", "Meal included", "VIP lounge"] },
  { key: "adult", label: "Adult", type: "adult", price_gbp: 2000, availability: 400, max_per_order: 6, description: "Standard adult access for the selected home fixture.", feature_bullets: ["Standard seating", "Match access"] },
  { key: "child", label: "Child", type: "junior", price_gbp: 500, availability: 250, max_per_order: 6, description: "Junior ticket for the selected home fixture.", feature_bullets: ["Kids access", "Family area"] },
];

export const seasonTicketSeedData: TicketTemplateSeed[] = [
  { key: "season-adult", label: "Adult Season Ticket", type: "season_pass", price_gbp: 9900, availability: 250, max_per_order: 1, description: "Full-season access for one adult supporter.", feature_bullets: ["Full 2026 access", "Priority entry", "Club benefits"] },
  { key: "season-family", label: "Family Season Ticket", type: "season_pass", price_gbp: 15000, availability: 100, max_per_order: 1, description: "Season access for two adults and two children.", feature_bullets: ["2 adults plus 2 kids", "Family seating", "Season access"] },
  { key: "season-kids", label: "Kids Season Ticket", type: "season_pass", price_gbp: 2000, availability: 150, max_per_order: 1, description: "Full-season access for one junior supporter.", feature_bullets: ["Kids entry", "Season access"] },
];

export const sponsorSeedData: SponsorSeed[] = [
  { key: "principal-1", name: "COMING SOON", tier: "Principal Partner", sort_order: 1 },
  { key: "principal-2", name: "COMING SOON", tier: "Principal Partner", sort_order: 2 },
  { key: "premium-1", name: "COMING SOON", tier: "Premium Partners", sort_order: 1 },
  { key: "premium-2", name: "COMING SOON", tier: "Premium Partners", sort_order: 2 },
  { key: "premium-3", name: "COMING SOON", tier: "Premium Partners", sort_order: 3 },
  { key: "official-1", name: "COMING SOON", tier: "Official Partners", sort_order: 1 },
  { key: "official-2", name: "COMING SOON", tier: "Official Partners", sort_order: 2 },
  { key: "official-3", name: "COMING SOON", tier: "Official Partners", sort_order: 3 },
  { key: "official-4", name: "COMING SOON", tier: "Official Partners", sort_order: 4 },
];

export const sponsorshipPackageSeedData: SponsorshipPackageSeed[] = [
  { key: "match-day-sponsor", title: "Match Day Sponsor", price_label: "GBP 2,500", billing_period: "per season", benefits: ["Logo on matchday materials", "Social media recognition", "10 complimentary tickets", "Pitch-side advertising board"], contact_email: "admin@northwalesrugby.com", sort_order: 1 },
  { key: "season-partner", title: "Season Partner", price_label: "GBP 10,000", billing_period: "per season", benefits: ["Logo on team kit", "Stadium advertising", "25 season tickets", "Hospitality suite access", "Meet the team events"], featured: true, contact_email: "admin@northwalesrugby.com", sort_order: 2 },
  { key: "principal-partner", title: "Principal Partner", price_label: "GBP 25,000+", billing_period: "per season", benefits: ["Prime kit placement", "Stadium naming rights", "50 premium season tickets", "Executive box access", "Brand integration across club", "Exclusive partnership benefits"], contact_email: "admin@northwalesrugby.com", sort_order: 3 },
];

export const starterBlogPosts: BlogPostSeed[] = [
  {
    title: "Victory Against Cardiff Blues",
    slug: "victory-against-cardiff-blues",
    excerpt: "Dominant performance secures crucial win in front of home crowd.",
    featured_image_url: "https://images.unsplash.com/photo-1557161283-c995e88037d4?w=800",
    published_at: "2026-05-05T09:00:00.000Z",
    content: "<p>North Wales Crusaders delivered a composed and physical display to secure a statement result in front of the home support.</p><p>The squad controlled territory early, defended with discipline, and turned pressure into points during the decisive stages of the match.</p><p>Supporters can expect a full match report and player reaction as the season momentum continues to build.</p>",
  },
  {
    title: "Season Tickets Now Available",
    slug: "season-tickets-now-available",
    excerpt: "Secure your place at Eirias Stadium for the entire season.",
    featured_image_url: "https://images.unsplash.com/photo-1774916927099-5b0c72f2a683?w=800",
    published_at: "2026-05-03T09:00:00.000Z",
    content: "<p>Season tickets for the 2026 campaign are now available, giving supporters the best-value way to back the club all year long.</p><p>Packages include adult, family, and junior options, with priority entry and club benefits included in selected tiers.</p><p>Fans are encouraged to secure their places early ahead of the biggest home fixtures on the calendar.</p>",
  },
  {
    title: "Youth Academy Success",
    slug: "youth-academy-success",
    excerpt: "Three academy players selected for the regional squad.",
    featured_image_url: "https://images.unsplash.com/photo-1760163506380-2be2a2f8bf0a?w=800",
    published_at: "2026-05-01T09:00:00.000Z",
    content: "<p>Another strong step for the development pathway as three academy players earn selection for the regional setup.</p><p>The recognition reflects the club's focus on coaching, progression, and building a sustainable future through local talent.</p><p>Further academy updates and player profiles will be shared across the club channels in the coming weeks.</p>",
  },
];
