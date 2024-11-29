export default function ProgressBar({ spentPercentage, remainingPercentage }) {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <span className="text-sm font-semibold text-[#ae2029]">spent</span>
        <span className="text-sm font-semibold text-green-500">remaining</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden relative">
        {/* Spent Progress Bar (red part) */}
        <div
          style={{
            width: `${spentPercentage}%`,
            backgroundColor: "#ae2029",
            height: "10px",
            borderRadius: "full",
          }}
        ></div>
        {/* Remaining Progress Bar (green part) */}
        <div
          style={{
            width: `${remainingPercentage}%`,
            backgroundColor: "green",
            height: "10px",
            borderRadius: "full",
            position: "absolute",
            top: 0,
            left: `${spentPercentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
