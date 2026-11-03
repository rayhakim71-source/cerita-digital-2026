/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

interface BarChartData {
  label: string;
  count: number;
}

interface BarChartProps {
  data: BarChartData[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="w-full bg-[#1A1A22] rounded-xl border border-[#34343F] p-4 sm:p-6">
      <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2">
        {data.map((item) => {
          const heightPercent = Math.max(Math.round((item.count / maxVal) * 100), 4);
          return (
            <div key={item.label} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-xs font-semibold text-[#E8B04A] mb-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
              <div className="w-full max-w-[48px] bg-[#24242E] rounded-t-md h-full flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#E8B04A] rounded-t-md transition-all duration-500 group-hover:brightness-110"
                />
              </div>
              <span className="text-xs font-medium text-[#F5F1E8] mt-2 tracking-wide">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
