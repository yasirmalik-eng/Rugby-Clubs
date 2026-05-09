import { motion } from "motion/react";
import { Ticket, Star, Check, CreditCard } from "lucide-react";
import { useState } from "react";

export function TicketsPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);

  const matchTickets = [
    { id: "hospitality", title: "Hospitality", price: 35, features: ["Premium seating", "Meal", "Drinks", "VIP lounge"] },
    { id: "adult", title: "Adult", price: 20, features: ["Standard seating", "Program", "Fan zone"] },
    { id: "child", title: "Child", price: 5, features: ["Standard seating", "Program", "Kids pack"] },
  ];

  const seasonTickets = [
    { id: "season-adult", title: "Adult Season Ticket", price: 99, subtitle: "Save 40%", features: ["All home matches", "Priority seating"] },
    { id: "season-family", title: "Family Season Ticket", price: 150, subtitle: "2+2", features: ["All matches", "Family seating"] },
    { id: "season-kids", title: "Kids Season Ticket", price: 20, subtitle: "Best value", features: ["All matches", "Kids zone"] },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const allTickets = [...matchTickets, ...seasonTickets];

  const totalCost = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const ticket = allTickets.find(t => t.id === id);
    return sum + (ticket?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">

      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-white">TICKETS</h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-lg">
            Experience Welsh Rugby Live
          </p>
        </motion.div>

        {/* MATCH TICKETS */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 flex gap-2 items-center">
            <Ticket className="text-red-500" /> Match Tickets
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {matchTickets.map(ticket => (
              <div key={ticket.id} className="bg-red-900/20 p-5 rounded-2xl border border-red-800/50">

                <h3 className="text-white font-bold text-xl sm:text-2xl">{ticket.title}</h3>
                <div className="text-red-400 text-2xl sm:text-3xl font-black my-2">
                  £{ticket.price}
                </div>

                <ul className="text-gray-300 text-sm space-y-1 mb-4">
                  {ticket.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => updateQuantity(ticket.id, -1)} className="w-9 h-9 bg-red-800 text-white rounded">-</button>
                  <span className="text-white font-bold">{quantities[ticket.id] || 0}</span>
                  <button onClick={() => updateQuantity(ticket.id, 1)} className="w-9 h-9 bg-red-800 text-white rounded">+</button>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* SEASON TICKETS */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 flex gap-2 items-center">
            <Star className="text-green-500" /> Season Tickets
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {seasonTickets.map(ticket => (
              <div key={ticket.id} className="bg-green-900/20 p-5 rounded-2xl border border-green-800/50">

                <h3 className="text-white font-bold text-xl sm:text-2xl">{ticket.title}</h3>
                <p className="text-green-400 text-sm">{ticket.subtitle}</p>

                <div className="text-green-400 text-2xl sm:text-3xl font-black my-2">
                  £{ticket.price}
                </div>

                <ul className="text-gray-300 text-sm space-y-1 mb-4">
                  {ticket.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => updateQuantity(ticket.id, -1)} className="w-9 h-9 bg-green-800 text-white rounded">-</button>
                  <span className="text-white font-bold">{quantities[ticket.id] || 0}</span>
                  <button onClick={() => updateQuantity(ticket.id, 1)} className="w-9 h-9 bg-green-800 text-white rounded">+</button>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* CHECKOUT BAR */}
        {totalCost > 0 && (
          <div className="sticky bottom-6 bg-gradient-to-r from-red-900 to-green-900 border border-white/20 rounded-2xl p-6">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <div>
                <p className="text-gray-300 text-sm">Total Amount</p>
                <h3 className="text-3xl font-black text-white">
                  £{totalCost.toFixed(2)}
                </h3>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="px-10 py-4 bg-white text-black font-black rounded-lg flex items-center gap-2"
              >
                <CreditCard />
                CHECKOUT
              </button>

            </div>

          </div>
        )}

      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-zinc-900 rounded-3xl p-6 sm:p-8 relative"
          >

            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-3 right-3 text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 text-center">
              Payment Details
            </h2>

            {/* ORDER SUMMARY */}
            <div className="mb-4 text-gray-300 text-sm space-y-1">
              {Object.entries(quantities).map(([id, qty]) => {
                if (qty === 0) return null;

                const ticket = allTickets.find(t => t.id === id);

                return (
                  <div key={id} className="flex justify-between">
                    <span>{ticket?.title} × {qty}</span>
                    <span>£{((ticket?.price || 0) * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* FORM */}
            <div className="grid sm:grid-cols-2 gap-3">

              <input className="p-3 bg-black border text-white rounded" placeholder="First Name" />
              <input className="p-3 bg-black border text-white rounded" placeholder="Last Name" />
              <input className="sm:col-span-2 p-3 bg-black border text-white rounded" placeholder="Email" />
              <input className="sm:col-span-2 p-3 bg-black border text-white rounded" placeholder="Card Number" />
              <input className="p-3 bg-black border text-white rounded" placeholder="MM/YY" />
              <input className="p-3 bg-black border text-white rounded" placeholder="CVV" />

            </div>

            <button className="w-full mt-6 bg-red-700 text-white py-4 rounded-xl font-black">
              PAY NOW
            </button>

          </motion.div>

        </div>
      )}

    </div>
  );
}