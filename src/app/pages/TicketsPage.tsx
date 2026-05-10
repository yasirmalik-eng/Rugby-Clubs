<<<<<<< HEAD
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Ticket,
  CreditCard,
  Check,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useTickets } from "../../hooks/useTickets";
import { useSeasonPass } from "../../hooks/useSeasonPass";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
=======
import { motion } from "framer-motion";
import { Check, CreditCard, Calendar, MapPin, Shield } from "lucide-react";
import { useState } from "react";
>>>>>>> 99433d22f765664acbf281ec31f218095c6545ef

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function TicketsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fixtureId = searchParams.get("fixture");
  const { user } = useAuth();
  const { hasPass, loading: passLoading } = useSeasonPass();
  const [fixture, setFixture] = useState<{
    id: string;
    opponent: string;
    match_date: string;
    kick_off_time: string;
    venue: string;
    competition: string;
  } | null>(null);

  useEffect(() => {
    if (!fixtureId) {
      setFixture(null);
      return;
    }

<<<<<<< HEAD
    supabase
      .from("fixtures")
      .select("id, opponent, match_date, kick_off_time, venue, competition")
      .eq("id", fixtureId)
      .single()
      .then(({ data }) => setFixture(data));
  }, [fixtureId]);

  const { tickets, loading: ticketsLoading } = useTickets(fixtureId);
  const { tickets: seasonPasses, loading: passesLoading } = useTickets(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQty = (id: string, delta: number, max: number) =>
    setCart((prev) => ({
=======
  /* MATCH TICKETS */
  const matchTickets = [
    {
      id: "hospitality",
      title: "Hospitality",
      price: 35,
      features: ["Premium Seating", "Meal Included", "VIP Lounge"],
    },
    {
      id: "adult",
      title: "Adult",
      price: 20,
      features: ["Standard Seating", "Match Access"],
    },
    {
      id: "child",
      title: "Child",
      price: 5,
      features: ["Kids Access", "Family Area"],
    },
  ];

  /* SEASON TICKETS */
  const seasonTickets = [
    {
      id: "seasonAdult",
      title: "Adult Season Ticket",
      price: 99,
      features: ["Full 2026 Access", "Priority Entry", "Club Benefits"],
    },
    {
      id: "seasonFamily",
      title: "Family Season Ticket",
      price: 150,
      features: ["2 Adults + 2 Kids", "Family Seating", "Season Access"],
    },
    {
      id: "seasonKids",
      title: "Kids Season Ticket",
      price: 20,
      features: ["Kids Entry", "Season Access"],
    },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
>>>>>>> 99433d22f765664acbf281ec31f218095c6545ef
      ...prev,
      [id]: Math.min(max, Math.max(0, (prev[id] ?? 0) + delta)),
    }));

  const allTickets = [...tickets, ...seasonPasses];
  const totalPence = Object.entries(cart).reduce((sum, [id, qty]) => {
    const ticket = allTickets.find((item) => item.id === id);
    return ticket ? sum + ticket.price_gbp * qty : sum;
  }, 0);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartLineItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([ticketId, quantity]) => ({
      ticketId,
      quantity,
      ticket: allTickets.find((ticket) => ticket.id === ticketId),
    }))
    .filter(
      (item): item is { ticketId: string; quantity: number; ticket: (typeof allTickets)[number] } =>
        Boolean(item.ticket),
    );
  const containsSeasonPass = cartLineItems.some(({ ticket }) => ticket.type === "season_pass");

  const handleCheckout = async () => {
    if (totalItems === 0) return;

    if (containsSeasonPass && !user) {
      navigate("/auth/login");
      return;
    }

    for (const item of cartLineItems) {
      const available = item.ticket.availability - item.ticket.sold_count;

      if (item.quantity > item.ticket.max_per_order) {
        setError(`${item.ticket.label} exceeds the maximum allowed per order.`);
        return;
      }

      if (item.quantity > available) {
        setError(`Only ${available} ${item.ticket.label} ticket(s) remain.`);
        return;
      }
    }

    setCheckingOut(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          lineItems: cartLineItems.map(({ ticketId, quantity }) => ({ ticketId, quantity })),
          fixtureId: fixtureId ?? null,
          userId: user?.id ?? null,
          successUrl: `${window.location.origin}/tickets/success`,
          cancelUrl: fixtureId
            ? `${window.location.origin}/tickets?fixture=${fixtureId}`
            : `${window.location.origin}/tickets`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL was not returned.");
      }
    } catch (checkoutError: unknown) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

<<<<<<< HEAD
  const loading = ticketsLoading || passesLoading || passLoading;
  const showSeasonPasses = seasonPasses.length > 0 && !hasPass;
=======
  const allTickets = [...matchTickets, ...seasonTickets];

  const totalCost = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const ticket = allTickets.find((t) => t.id === id);
    return ticket ? sum + ticket.price * qty : sum;
  }, 0);

  /* NO FIXTURE */
  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-6">
        <div className="bg-red-900/20 border border-red-700 p-8 rounded-2xl max-w-xl">

          <h2 className="text-white text-2xl font-black mb-3">
            No Fixture Selected
          </h2>

          <p className="text-gray-300 mb-4">
            Please select a match first to buy tickets.
          </p>

          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("navigate", {
                  detail: { page: "fixtures" },
                })
              )
            }
            className="bg-red-700 hover:bg-red-600 transition-all text-white px-6 py-3 rounded-full font-black"
          >
            Go to Fixtures
          </button>
        </div>
      </div>
    );
  }
>>>>>>> 99433d22f765664acbf281ec31f218095c6545ef

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-700 bg-red-900/30 px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">
              {fixtureId ? "OFFICIAL MATCH TICKETS" : "OFFICIAL CLUB TICKETS"}
            </span>
          </div>

<<<<<<< HEAD
          <h1 className="text-4xl font-black text-white sm:text-6xl">
            {fixtureId ? "MATCH TICKETS" : "BUY TICKETS"}
          </h1>

          <p className="mt-3 text-gray-400">
=======
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 rounded-full mb-5">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold text-sm">
              OFFICIAL MATCH TICKETS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white">
            MATCH TICKETS
          </h1>

          <p className="text-gray-400 mt-3">
>>>>>>> 99433d22f765664acbf281ec31f218095c6545ef
            Buy official North Wales Crusaders tickets securely
          </p>
        </motion.div>

<<<<<<< HEAD
        {fixture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 rounded-3xl border border-red-700 bg-gradient-to-r from-red-900/40 to-black p-6"
          >
            <h2 className="mb-4 text-2xl font-black text-white sm:text-4xl">
              NORTH WALES CRUSADERS vs {fixture.opponent.toUpperCase()}
            </h2>

            <div className="flex flex-col gap-4 text-gray-300 sm:flex-row sm:flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                {format(new Date(fixture.match_date), "d MMMM yyyy")}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                {fixture.kick_off_time.slice(0, 5)}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                {fixture.venue}
              </div>
            </div>
          </motion.div>
        )}

        {!fixtureId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 rounded-3xl border border-red-700 bg-red-900/20 p-8 text-center"
          >
            <h2 className="mb-3 text-2xl font-black text-white">No Fixture Selected</h2>
            <p className="mb-5 text-gray-300">
              Select a home match first to buy match tickets. Season passes are still available below.
            </p>
            <button
              onClick={() => navigate("/fixtures")}
              className="rounded-full bg-red-700 px-6 py-3 font-black text-white transition-all hover:bg-red-600"
            >
              Go to Fixtures
            </button>
          </motion.div>
        )}

        {!fixtureId && hasPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 flex items-center gap-4 rounded-2xl border border-green-600 bg-green-900/30 p-5"
          >
            <ShieldCheck className="h-8 w-8 flex-shrink-0 text-green-400" />
            <div>
              <div className="text-lg font-black text-green-400">Season Pass Active</div>
              <p className="text-sm text-gray-400">You have access to all home fixtures this season.</p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6" />
            ))}
          </div>
        ) : (
          <>
            {fixtureId && tickets.length > 0 && (
              <>
                <h2 className="mb-8 text-center text-3xl font-black text-white">Match Tickets</h2>

                <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tickets.map((ticket) => {
                    const qty = cart[ticket.id] ?? 0;
                    const available = ticket.availability - ticket.sold_count;

                    return (
                      <motion.div
                        key={ticket.id}
                        whileHover={{ scale: 1.03 }}
                        className={`rounded-3xl border p-6 transition-all ${
                          qty > 0
                            ? "border-red-500 bg-gradient-to-br from-red-900/25 to-black shadow-lg shadow-red-900/30"
                            : "border-red-800 bg-gradient-to-br from-red-900/20 to-black"
                        }`}
                      >
                        <h3 className="text-2xl font-black text-white">{ticket.label}</h3>
                        {ticket.description && <p className="mt-2 text-sm text-gray-400">{ticket.description}</p>}

                        <div className="my-5 text-5xl font-black text-red-400">
                          {gbpFormatter.format(ticket.price_gbp / 100)}
                        </div>

                        <ul className="mb-6 space-y-3">
                          {(ticket.feature_bullets ?? []).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                              <Check className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mb-5 text-xs">
                          {available > 0 ? (
                            <span className="text-green-500">{available} available</span>
                          ) : (
                            <span className="text-red-500">Sold out</span>
                          )}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-4">
                          <button
                            onClick={() => updateQty(ticket.id, -1, ticket.max_per_order)}
                            disabled={qty === 0}
                            className="h-11 w-11 rounded-full bg-red-700 text-xl font-black text-white transition-all hover:bg-red-600 disabled:opacity-30"
                          >
                            -
                          </button>

                          <span className="w-8 text-center text-2xl font-black text-white">{qty}</span>

                          <button
                            onClick={() => updateQty(ticket.id, 1, ticket.max_per_order)}
                            disabled={available === 0 || qty >= ticket.max_per_order}
                            className="h-11 w-11 rounded-full bg-red-700 text-xl font-black text-white transition-all hover:bg-red-600 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {showSeasonPasses && (
              <>
                <h2 className="mb-8 text-center text-3xl font-black text-white">Season Tickets</h2>
                {!user && (
                  <p className="mb-4 text-sm text-amber-400">
                    Sign in before buying a season pass so it can be attached to your account.
                  </p>
                )}

                <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {seasonPasses.map((pass) => {
                    const qty = cart[pass.id] ?? 0;

                    return (
                      <motion.div
                        key={pass.id}
                        whileHover={{ scale: 1.03 }}
                        className={`rounded-3xl border p-6 transition-all ${
                          qty > 0
                            ? "border-green-500 bg-gradient-to-br from-green-900/25 to-black"
                            : "border-green-800 bg-gradient-to-br from-green-900/20 to-black"
                        }`}
                      >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-700/20 px-3 py-1">
                          <Star className="h-3 w-3 text-green-400" />
                          <span className="text-xs font-bold text-green-400">BEST VALUE</span>
                        </div>

                        <h3 className="text-xl font-black text-white">{pass.label}</h3>
                        {pass.description && <p className="mt-2 text-sm text-gray-400">{pass.description}</p>}

                        <div className="my-5 text-5xl font-black text-green-400">
                          {gbpFormatter.format(pass.price_gbp / 100)}
                        </div>

                        <ul className="mb-6 space-y-3">
                          {(pass.feature_bullets ?? []).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                              <Check className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-center gap-5">
                          <button
                            onClick={() => updateQty(pass.id, -1, 1)}
                            disabled={qty === 0}
                            className="h-11 w-11 rounded-full bg-green-700 text-xl font-black text-white transition-all hover:bg-green-600 disabled:opacity-30"
                          >
                            -
                          </button>

                          <span className="w-8 text-center text-2xl font-black text-white">{qty}</span>

                          <button
                            onClick={() => updateQty(pass.id, 1, 1)}
                            disabled={qty >= 1}
                            className="h-11 w-11 rounded-full bg-green-700 text-xl font-black text-white transition-all hover:bg-green-600 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {tickets.length === 0 && seasonPasses.length === 0 && (
              <div className="py-20 text-center">
                <Ticket className="mx-auto mb-4 h-12 w-12 text-gray-700" />
                <p className="text-lg text-gray-500">
                  {fixtureId ? "No tickets available for this fixture yet." : "No tickets available right now."}
                </p>
                {fixtureId && (
                  <button
                    onClick={() => navigate("/fixtures")}
                    className="mt-6 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Back to Fixtures
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-3 rounded-xl border border-red-700 bg-red-900/30 p-4"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 p-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-400">
                {totalItems} ticket{totalItems !== 1 ? "s" : ""} selected
              </div>
              <div className="text-3xl font-black text-white">
                {gbpFormatter.format(totalPence / 100)}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              disabled={checkingOut}
              className="flex items-center gap-3 rounded-xl border border-red-600 bg-gradient-to-r from-red-700 to-red-800 px-8 py-4 font-black text-white transition-all hover:shadow-xl hover:shadow-red-900/50 disabled:opacity-60"
            >
              {checkingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
              {checkingOut ? "Redirecting to Stripe..." : "Checkout Securely"}
            </motion.button>
=======
        {/* FIXTURE BOX */}
        <div className="max-w-5xl mx-auto mb-12 bg-gradient-to-r from-red-900/40 to-black border border-red-700 rounded-3xl p-6">

          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            NORTH WALES CRUSADERS vs {selectedMatch.match.toUpperCase()}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 text-gray-300">

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              {selectedMatch.date}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              {selectedMatch.venue}
            </div>

          </div>
        </div>

        {/* MATCH TICKETS */}
        <div className="mb-16">

          <h2 className="text-white text-3xl font-black mb-8 text-center">
            Match Tickets
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {matchTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-red-900/20 to-black border border-red-800 rounded-3xl p-6"
              >

                <h3 className="text-white font-black text-2xl">
                  {ticket.title}
                </h3>

                <div className="text-red-400 text-5xl font-black my-5">
                  £{ticket.price}
                </div>

                <ul className="space-y-3 mb-6">
                  {ticket.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-center gap-4 mt-6">

                  <button
                    onClick={() => updateQuantity(ticket.id, -1)}
                    className="w-11 h-11 rounded-full bg-red-700 hover:bg-red-600 transition-all text-white text-xl font-black"
                  >
                    -
                  </button>

                  <span className="text-white font-black text-2xl min-w-[30px] text-center">
                    {quantities[ticket.id] || 0}
                  </span>

                  <button
                    onClick={() => updateQuantity(ticket.id, 1)}
                    className="w-11 h-11 rounded-full bg-red-700 hover:bg-red-600 transition-all text-white text-xl font-black"
                  >
                    +
                  </button>

                </div>

              </motion.div>
            ))}

          </div>
        </div>

        {/* SEASON TICKETS */}
        <div>

          <h2 className="text-white text-3xl font-black mb-8 text-center">
            Season Tickets
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {seasonTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-green-900/20 to-black border border-green-800 rounded-3xl p-6"
              >

                <h3 className="text-white font-black text-2xl">
                  {ticket.title}
                </h3>

                <div className="text-green-400 text-5xl font-black my-5">
                  £{ticket.price}
                </div>

                <ul className="space-y-3 mb-6">
                  {ticket.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-center gap-4 mt-6">

                  <button
                    onClick={() => updateQuantity(ticket.id, -1)}
                    className="w-11 h-11 rounded-full bg-green-700 hover:bg-green-600 transition-all text-white text-xl font-black"
                  >
                    -
                  </button>

                  <span className="text-white font-black text-2xl min-w-[30px] text-center">
                    {quantities[ticket.id] || 0}
                  </span>

                  <button
                    onClick={() => updateQuantity(ticket.id, 1)}
                    className="w-11 h-11 rounded-full bg-green-700 hover:bg-green-600 transition-all text-white text-xl font-black"
                  >
                    +
                  </button>

                </div>

              </motion.div>
            ))}

          </div>
        </div>

        {/* CHECKOUT */}
        {totalCost > 0 && (
          <div className="sticky bottom-6 mt-12 max-w-5xl mx-auto z-40">

            <div className="bg-gradient-to-r from-red-800 to-red-700 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-5 shadow-2xl">

              <div>
                <p className="text-red-100 text-sm uppercase tracking-widest">
                  Total Price
                </p>

                <h3 className="text-white text-4xl font-black">
                  £{totalCost.toFixed(2)}
                </h3>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="bg-white hover:bg-zinc-200 transition-all text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 text-lg"
              >
                <CreditCard className="w-5 h-5" />
                Checkout
              </button>

            </div>

          </div>
        )}

      </div>

      {/* CHECKOUT MODAL */}
   {showCheckout && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden">

    <div
      className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >

      {/* hide scrollbar (Chrome/Safari) */}
      <style>
        {`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <div className="hide-scroll">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-3xl font-black">
              Secure Checkout
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Powered by Stripe
            </p>
          </div>

          <div className="bg-red-700 px-3 py-1 rounded-full text-white text-xs font-bold">
            SSL SECURE
>>>>>>> 99433d22f765664acbf281ec31f218095c6545ef
          </div>
        </div>

        {/* MATCH INFO */}
        <div className="bg-black/50 border border-zinc-800 rounded-2xl p-4 mb-6">

          <div className="text-gray-400 text-sm mb-1">
            Match
          </div>

          <div className="text-white font-bold text-lg">
            North Wales Crusaders vs {selectedMatch.match}
          </div>

          <div className="text-gray-400 text-sm mt-2">
            {selectedMatch.date}
          </div>

        </div>

        {/* CUSTOMER DETAILS */}
        <div className="space-y-4 mb-6">

          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Full Name
            </label>

            <input
              className="w-full p-4 bg-black border border-zinc-700 text-white rounded-xl focus:outline-none focus:border-red-600"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              className="w-full p-4 bg-black border border-zinc-700 text-white rounded-xl focus:outline-none focus:border-red-600"
              placeholder="john@email.com"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Card Information
            </label>

            <input
              className="w-full p-4 bg-black border border-zinc-700 text-white rounded-xl focus:outline-none focus:border-red-600"
              placeholder="1234 1234 1234 1234"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Expiry Date
              </label>

              <input
                className="w-full p-4 bg-black border border-zinc-700 text-white rounded-xl focus:outline-none focus:border-red-600"
                placeholder="MM / YY"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                CVC
              </label>

              <input
                className="w-full p-4 bg-black border border-zinc-700 text-white rounded-xl focus:outline-none focus:border-red-600"
                placeholder="123"
              />
            </div>

          </div>

        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center bg-black/50 border border-zinc-800 rounded-2xl p-4 mb-6">

          <span className="text-gray-300 font-medium">
            Total Amount
          </span>

          <span className="text-white text-3xl font-black">
            £{totalCost.toFixed(2)}
          </span>

        </div>

        {/* BUTTONS */}
        <button className="w-full bg-red-700 hover:bg-red-600 transition-all text-white py-4 rounded-xl font-black text-lg shadow-lg">
          Pay Securely
        </button>

        <button
          onClick={() => setShowCheckout(false)}
          className="w-full mt-4 text-gray-400 hover:text-white transition-all"
        >
          Cancel
        </button>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 mt-6">
          Your payment is encrypted and securely processed.
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}
