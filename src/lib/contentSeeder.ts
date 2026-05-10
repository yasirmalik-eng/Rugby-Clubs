import { supabase } from "./supabase";
import type { Database } from "./database.types";
import {
  fixtureSeedData,
  matchTicketTemplates,
  seasonTicketSeedData,
  sponsorSeedData,
  sponsorshipPackageSeedData,
  starterBlogPosts,
} from "../data/uiSeedContent";

type FixtureInsert = Database["public"]["Tables"]["fixtures"]["Insert"];
type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
type SponsorInsert = Database["public"]["Tables"]["sponsors"]["Insert"];
type SponsorshipPackageInsert = Database["public"]["Tables"]["sponsorship_packages"]["Insert"];
type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

function seedUuid(seed: string) {
  const source = seed.toLowerCase();
  let hash = 2166136261;
  const words: number[] = [];

  for (let pass = 0; pass < 4; pass += 1) {
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index) + pass * 131;
      hash = Math.imul(hash, 16777619);
    }

    words.push(hash >>> 0);
    hash = Math.imul(hash ^ source.length ^ (pass + 1), 2246822507);
  }

  const normalized = words.map((word) => word.toString(16).padStart(8, "0")).join("").slice(0, 32);

  return [
    normalized.slice(0, 8),
    normalized.slice(8, 12),
    `4${normalized.slice(13, 16)}`,
    `a${normalized.slice(17, 20)}`,
    normalized.slice(20, 32),
  ].join("-");
}

export async function seedDynamicUiContent(authorId: string) {
  const fixturesResponse = await supabase.from("fixtures").select("id, opponent, match_date");

  if (fixturesResponse.error) {
    throw new Error(fixturesResponse.error.message);
  }

  const existingFixtures = new Map(
    (fixturesResponse.data ?? []).map((fixture) => [`${fixture.opponent}__${fixture.match_date}`, fixture.id]),
  );

  const fixturesPayload: FixtureInsert[] = fixtureSeedData.map((fixture) => ({
    id: existingFixtures.get(`${fixture.opponent}__${fixture.match_date}`) ?? seedUuid(`fixture-${fixture.key}`),
    opponent: fixture.opponent,
    match_date: fixture.match_date,
    kick_off_time: fixture.kick_off_time,
    venue: fixture.venue,
    is_home: fixture.is_home,
    competition: fixture.competition,
    tickets_available: fixture.tickets_available,
    updated_at: new Date().toISOString(),
  }));

  const fixturesUpsert = await supabase.from("fixtures").upsert(fixturesPayload);

  if (fixturesUpsert.error) {
    throw new Error(fixturesUpsert.error.message);
  }

  const fixtureIdByKey = new Map(
    fixtureSeedData.map((fixture, index) => [fixture.key, fixturesPayload[index].id as string]),
  );

  const homeFixtureIds = fixtureSeedData
    .filter((fixture) => fixture.is_home)
    .map((fixture) => fixtureIdByKey.get(fixture.key))
    .filter((value): value is string => Boolean(value));

  const [matchTicketsResponse, seasonTicketsResponse] = await Promise.all([
    homeFixtureIds.length > 0
      ? supabase.from("tickets").select("id, fixture_id, label").in("fixture_id", homeFixtureIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("tickets").select("id, fixture_id, label").is("fixture_id", null),
  ]);

  if (matchTicketsResponse.error) {
    throw new Error(matchTicketsResponse.error.message);
  }

  if (seasonTicketsResponse.error) {
    throw new Error(seasonTicketsResponse.error.message);
  }

  const existingMatchTickets = new Map(
    (matchTicketsResponse.data ?? []).map((ticket) => [`${ticket.fixture_id}__${ticket.label}`, ticket.id]),
  );

  const existingSeasonTickets = new Map(
    (seasonTicketsResponse.data ?? []).map((ticket) => [ticket.label, ticket.id]),
  );

  const matchTicketPayload: TicketInsert[] = fixtureSeedData
    .filter((fixture) => fixture.is_home)
    .flatMap((fixture) => {
      const fixtureId = fixtureIdByKey.get(fixture.key);

      if (!fixtureId) {
        return [];
      }

      return matchTicketTemplates.map((template) => ({
        id: existingMatchTickets.get(`${fixtureId}__${template.label}`) ?? seedUuid(`ticket-${fixture.key}-${template.key}`),
        fixture_id: fixtureId,
        type: template.type,
        label: template.label,
        price_gbp: template.price_gbp,
        availability: template.availability,
        sold_count: 0,
        max_per_order: template.max_per_order,
        description: template.description,
        feature_bullets: template.feature_bullets,
      }));
    });

  const seasonTicketPayload: TicketInsert[] = seasonTicketSeedData.map((ticket) => ({
    id: existingSeasonTickets.get(ticket.label) ?? seedUuid(`ticket-${ticket.key}`),
    fixture_id: null,
    type: ticket.type,
    label: ticket.label,
    price_gbp: ticket.price_gbp,
    availability: ticket.availability,
    sold_count: 0,
    max_per_order: ticket.max_per_order,
    description: ticket.description,
    feature_bullets: ticket.feature_bullets,
  }));

  const ticketsUpsert = await supabase.from("tickets").upsert([...matchTicketPayload, ...seasonTicketPayload]);

  if (ticketsUpsert.error) {
    throw new Error(ticketsUpsert.error.message);
  }

  const [sponsorsResponse, packagesResponse, postsResponse] = await Promise.all([
    supabase.from("sponsors").select("id, name, tier, sort_order"),
    supabase.from("sponsorship_packages").select("id, title"),
    supabase.from("blog_posts").select("id, slug"),
  ]);

  if (sponsorsResponse.error) {
    throw new Error(sponsorsResponse.error.message);
  }

  if (packagesResponse.error) {
    throw new Error(packagesResponse.error.message);
  }

  if (postsResponse.error) {
    throw new Error(postsResponse.error.message);
  }

  const existingSponsors = new Map(
    (sponsorsResponse.data ?? []).map((sponsor) => [
      `${sponsor.tier}__${sponsor.name}__${sponsor.sort_order}`,
      sponsor.id,
    ]),
  );
  const existingPackages = new Map((packagesResponse.data ?? []).map((pkg) => [pkg.title, pkg.id]));
  const existingPosts = new Map((postsResponse.data ?? []).map((post) => [post.slug, post.id]));

  const sponsorsPayload: SponsorInsert[] = sponsorSeedData.map((sponsor) => ({
    id:
      existingSponsors.get(`${sponsor.tier}__${sponsor.name}__${sponsor.sort_order}`) ??
      seedUuid(`sponsor-${sponsor.key}`),
    name: sponsor.name,
    tier: sponsor.tier,
    sort_order: sponsor.sort_order,
    is_active: true,
    updated_at: new Date().toISOString(),
  }));

  const packagesPayload: SponsorshipPackageInsert[] = sponsorshipPackageSeedData.map((pkg) => ({
    id: existingPackages.get(pkg.title) ?? seedUuid(`package-${pkg.key}`),
    title: pkg.title,
    price_label: pkg.price_label,
    billing_period: pkg.billing_period,
    benefits: pkg.benefits,
    featured: pkg.featured ?? false,
    contact_email: pkg.contact_email,
    is_active: true,
    sort_order: pkg.sort_order,
    updated_at: new Date().toISOString(),
  }));

  const postsPayload: BlogPostInsert[] = starterBlogPosts.map((post) => ({
    id: existingPosts.get(post.slug) ?? seedUuid(`post-${post.slug}`),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image_url: post.featured_image_url,
    author_id: authorId,
    is_published: true,
    published_at: post.published_at,
    updated_at: new Date().toISOString(),
  }));

  const [sponsorsUpsert, packagesUpsert, postsUpsert] = await Promise.all([
    supabase.from("sponsors").upsert(sponsorsPayload),
    supabase.from("sponsorship_packages").upsert(packagesPayload),
    supabase.from("blog_posts").upsert(postsPayload),
  ]);

  if (sponsorsUpsert.error) {
    throw new Error(sponsorsUpsert.error.message);
  }

  if (packagesUpsert.error) {
    throw new Error(packagesUpsert.error.message);
  }

  if (postsUpsert.error) {
    throw new Error(postsUpsert.error.message);
  }

  return {
    fixtures: fixturesPayload.length,
    tickets: matchTicketPayload.length + seasonTicketPayload.length,
    sponsors: sponsorsPayload.length,
    packages: packagesPayload.length,
    posts: postsPayload.length,
  };
}
