import { motion } from "motion/react";
import {
  Ticket,
  Check,
  CreditCard,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState } from "react";

interface TicketsPageProps {
  selectedMatch?: {
    match: string;
    date: string;
    venue: string;
    competition: string;
  };
}

export function TicketsPage({ selectedMatch }: TicketsPageProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);

  /* ONLY MATCH TICKETS (UPDATED) */
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
      price: 15,
      features: ["Standard Seating", "Match Access"],
    },
    {
      id: "child",
      title: "Child",
      price: 2.5,
      features: ["Kids Access", "Family Area"],
    },
  ];

  const allTickets = [...matchTickets];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const totalCost = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const ticket = allTickets.find((t) => t.id === id);

    if (ticket) {
      return sum + ticket.price * qty;
    }

    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            MATCH TICKETS
          </h1>

          <p className="text-gray-400 mt-3 text-sm sm:text-lg">
            Buy tickets for North Wales Crusaders
          </p>
        </motion.div>

        {/* SELECTED MATCH */}
        {selectedMatch && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-red-900/40 to-black border border-red-700 rounded-3xl p-6">

              <h2 className="text-3xl font-black text-white mb-4">
                NORTH WALES CRUSADERS vs {selectedMatch.match.toUpperCase()}
              </h2>

              <div className="flex gap-4 text-gray-300">
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
          </div>
        )}

        {/* MATCH TICKETS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-red-900/20 to-black border border-red-800/50 rounded-3xl p-6"
            >
              <h3 className="text-white font-black text-2xl">
                {ticket.title}
              </h3>

              <div className="text-red-400 text-4xl font-black my-4">
                £{ticket.price}
              </div>

              <ul className="space-y-2 mb-6">
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

              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => updateQuantity(ticket.id, -1)}
                  className="w-10 h-10 rounded-full bg-red-700 text-white text-xl"
                >
                  -
                </button>

                <span className="text-white font-black text-xl">
                  {quantities[ticket.id] || 0}
                </span>

                <button
                  onClick={() => updateQuantity(ticket.id, 1)}
                  className="w-10 h-10 rounded-full bg-red-700 text-white text-xl"
                >
                  +
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHECKOUT */}
        {totalCost > 0 && (
          <div className="sticky bottom-6 mt-10 max-w-4xl mx-auto">
            <div className="bg-red-900 p-6 rounded-3xl flex justify-between items-center">

              <h3 className="text-white text-3xl font-black">
                £{totalCost.toFixed(2)}
              </h3>

              <button
                onClick={() => setShowCheckout(true)}
                className="bg-white text-black px-8 py-3 rounded-full font-black"
              >
                Checkout
              </button>

            </div>
          </div>
        )}

      </div>

      {/* SIMPLE CHECKOUT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-xl">

            <h2 className="text-white text-2xl font-black mb-4">
              Checkout
            </h2>

            <input className="w-full p-3 mb-3 bg-black text-white rounded" placeholder="Name" />
            <input className="w-full p-3 mb-3 bg-black text-white rounded" placeholder="Email" />

            <button className="w-full bg-red-700 text-white py-3 rounded font-black">
              Pay Now
            </button>

            <button
              onClick={() => setShowCheckout(false)}
              className="w-full mt-3 text-gray-400"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}