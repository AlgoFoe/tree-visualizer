import Link from "next/link";
import React from "react";
import { FaDonate } from "react-icons/fa";

const DONATION_LINK = "https://payment-link.vercel.app";

const Donations = () => {
  const topDonors = [
    { name: "John Doe", message: "Donation message from john", amount: 1100 },
    { name: "Varun Singh", message: "Donation message from varun", amount: 3000 },
    { name: "Aditi Singh", message: "Donation message from aditi", amount: 2500 },
    { name: "Someone Singh", message: "Donation message from someone", amount: 3200 },
    { name: "Jane Doe", message: "Donation message from jane fsfetrew trg sdg sdggd gdf gpdpd ffd", amount: 2200 },
  ];
  topDonors.sort((a, b) => b.amount - a.amount);

  return (
    <>
      <div className="bg-gray-800 rounded-t-lg shadow-md p-3 mt-4 overflow-auto">
        <h2 className="text-lg font-bold text-emerald-400">Plant a Tree</h2>
        <p className="text-sm text-gray-400">Top donors</p>
        <div className="mt-2 max-h-[180px] overflow-y-auto space-y-1 scroll-shadow">
          {topDonors.map((donor, index) => (
            <div key={index} className="flex items-start">
              <div className="text-lg">{index + 1}.</div>
              <div className="flex flex-col w-full pl-2">
                <div className="text-lg font-bold">{donor.name}</div>
                <div className="text-slate-300 w-full">&ldquo;{donor.message}&rdquo;</div>
              </div>
              <div className="font-bold text-sky-300 pr-2.5">₹{donor.amount}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-800 rounded-b-lg shadow-md p-3">
        <Link
          href={DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mt-3 bg-teal-600 text-white py-1 px-3 rounded-lg w-full"
        >
          <FaDonate className="mr-2" /> Donate Now
        </Link>
      </div>
    </>
  );
};

export default Donations;
