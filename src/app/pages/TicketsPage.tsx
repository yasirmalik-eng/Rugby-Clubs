import { motion } from "framer-motion";
import { Check, CreditCard, Calendar, MapPin, Shield } from "lucide-react";
import { useState } from "react";

interface TicketsPageProps {
  selectedMatch?: {
    id: string;
    match: string;
    date: string;
    venue: string;
    competition?: string;
  };
}

export function TicketsPage({ selectedMatch }: TicketsPageProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);

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
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

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

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">

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
            Buy official North Wales Crusaders tickets securely
          </p>
        </motion.div>

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