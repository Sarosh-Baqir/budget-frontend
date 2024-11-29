"use client";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaExchangeAlt, FaHandHoldingUsd } from "react-icons/fa";

export default function BudgetCards({
  plannedBudget,
  spentBudget,
  remainingBudget,
}) {
  return (
    <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Planned Budget Card */}
      <div className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 flex flex-col items-center shadow-md">
        <AiOutlineFileAdd className="text-purple-500 text-4xl mb-4" />
        <div>
          <h3 className="text-lg font-semibold">Planned Budget</h3>
          <p className="text-2xl font-bold">
            ${plannedBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Spent Budget Card */}
      <div className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 flex flex-col items-center shadow-md">
        <FaExchangeAlt className="text-[#ae2029] text-4xl mb-4" />
        <div>
          <h3 className="text-lg font-semibold">Spent So Far</h3>
          <p className="text-2xl font-bold">${spentBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Remaining Budget Card */}
      <div className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 flex flex-col items-center shadow-md">
        <FaHandHoldingUsd className="text-green-500 text-4xl mb-4" />
        <div>
          <h3 className="text-lg font-semibold">Remaining</h3>
          <p className="text-2xl font-bold">
            ${remainingBudget.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
