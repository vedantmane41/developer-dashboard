// src/ContributionGraph.jsx

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

const ContributionGraph = ({ contributionData }) => {
  if (!contributionData || !contributionData.contributions) {
    return <p>Loading contribution data...</p>;
  }

  const today = new Date();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-white">Yearly Commit Activity</h3>
      <CalendarHeatmap
        startDate={new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())}
        endDate={today}
        values={contributionData.contributions}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-github-${value.level}`;
        }}
        tooltipDataAttrs={value => {
          if (!value || !value.date) {
            return null;
          }
          return {
            'data-tip': `${value.count} commits on ${value.date}`,
          };
        }}
      />
    </div>
  );
};

export default ContributionGraph;