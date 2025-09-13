import { useState, useEffect } from 'react';
import LanguageChart from './LanguageChart';
import ContributionGraph from './ContributionGraph';

function App() {
  const [contributionData, setContributionData] = useState(null);
  const [data, setData] = useState(null);
  const [wakatimeData, setWakatimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GITHUB_USERNAME = "vedantmane41"; 

  useEffect(() => {
    // We can fetch both pieces of data at the same time
Promise.all([
  fetch(`http://localhost:4000/api/github/${GITHUB_USERNAME}`),
  fetch('http://localhost:4000/api/wakatime/stats'),
  fetch(`http://localhost:4000/api/github/${GITHUB_USERNAME}/contributions`) // <-- ADD THIS LINE
])
.then(async ([githubRes, wakatimeRes, contribRes]) => { // <-- ADD contribRes
  // ... (existing code)
  const githubData = await githubRes.json();
  const wakatimeJson = wakatimeRes.ok ? await wakatimeRes.json() : null;
  const contribJson = contribRes.ok ? await contribRes.json() : null; // <-- ADD THIS LINE

  setData(githubData);
  setWakatimeData(wakatimeJson ? wakatimeJson.data : null);
  setContributionData(contribJson); // <-- ADD THIS LINE
})
    .catch(error => {
      console.error("Error fetching data:", error);
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        {data && (
          <div className="flex items-center space-x-4 mb-8">
            <img src={data.user.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-700" />
            <div>
              <h1 className="text-3xl font-bold">{data.user.name}</h1>
              <a href={data.user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@{data.user.login}</a>
              <p className="text-gray-400 mt-1">{data.user.bio}</p>
            </div>
          </div>
        )}

        {/* GitHub Stats Section */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">{data.user.public_repos}</p>
              <p className="text-gray-400">Repositories</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">{data.user.followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">{data.user.following}</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
        )}

        {/* WakaTime Stats Section */}
{wakatimeData && (
  <div>
    <h2 className="text-2xl font-bold mt-8 mb-4">Coding Activity (Last 7 Days)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Stat Boxes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{wakatimeData.human_readable_daily_average}</p>
          <p className="text-gray-400">Daily Average</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{wakatimeData.human_readable_total}</p>
          <p className="text-gray-400">Total</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center col-span-2">
          <p className="text-2xl font-bold">{wakatimeData.languages[0]?.name || 'N/A'}</p>
          <p className="text-gray-400">Top Language</p>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-gray-800 p-4 rounded-lg h-64 flex justify-center items-center">
        {wakatimeData.languages && wakatimeData.languages.length > 0 ? (
          <LanguageChart wakatimeData={wakatimeData} />
        ) : (
          <p className="text-gray-400">Not enough data for chart.</p>
        )}
      </div>
    </div>
  </div>
)}

          {/* Contribution Graph Section */}
          {contributionData && (
            <div className="mt-8">
              <ContributionGraph contributionData={contributionData} />
            </div>
          )}

        {/* Repositories Section */}
        {data && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.repos.map(repo => (
                <div key={repo.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-blue-400 hover:underline">{repo.name}</a>
                  <p className="text-gray-400 mt-1 mb-2 h-10 overflow-hidden">{repo.description || 'No description provided.'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>{repo.language}</span>
                    <span>Updated: {new Date(repo.pushed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;