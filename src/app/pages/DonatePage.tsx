import { useState } from "react";
import { motion } from "motion/react";
import { X, Heart, CreditCard } from "lucide-react";

export function DonatePage() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">

      {/* MAIN CARD */}
      <div className="text-center max-w-md w-full">

        <h1 className="text-5xl font-black text-red-500 mb-4">
          DONATE
        </h1>

        <p className="text-gray-400 mb-8">
          Support North Wales Crusaders 💙
        </p>

        {/* AMOUNT BOX */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">

          <p className="text-sm text-gray-400 mb-3">
            Select Amount
          </p>

          <div className="flex justify-center gap-3 flex-wrap">

            {[5, 10, 20, 50].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`px-5 py-2 rounded-full font-bold border ${
                  amount === val
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-white/10"
                }`}
              >
                £{val}
              </button>
            ))}

          </div>

          <div className="mt-5">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-black border border-white/10 text-white text-center"
              placeholder="Custom amount"
            />
          </div>

        </div>

        {/* PAY BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="w-full py-4 bg-red-700 hover:bg-red-600 rounded-full font-black flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          PAY £{amount}
        </button>

      </div>

      {/* MODAL POPUP */}
      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 relative"
          >

            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            <h2 className="text-2xl font-black text-center mb-6">
              Donation Checkout
            </h2>

            {/* FORM */}
            <div className="space-y-4">

              <input
                className="w-full p-3 rounded-xl bg-black border border-white/10"
                placeholder="Full Name"
              />

              <input
                className="w-full p-3 rounded-xl bg-black border border-white/10"
                placeholder="Email Address"
              />

              <input
                className="w-full p-3 rounded-xl bg-black border border-white/10"
                placeholder="Card Number"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  className="p-3 rounded-xl bg-black border border-white/10"
                  placeholder="MM/YY"
                />

                <input
                  className="p-3 rounded-xl bg-black border border-white/10"
                  placeholder="CVV"
                />

              </div>

            </div>

            {/* PAY BUTTON */}
            <button className="w-full mt-6 py-4 bg-red-700 hover:bg-red-600 rounded-xl font-black flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              CONFIRM PAYMENT £{amount}
            </button>

          </motion.div>

        </div>
      )}

    </div>
  );
}