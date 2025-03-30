import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect if not authenticated
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
    
        const [campaignsResponse, donorsResponse] = await Promise.all([
          axiosInstance.get('/api/campaigns', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/donors', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
    
        setCampaigns(campaignsResponse.data);
        setDonors(donorsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.response || error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchDashboardData();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Charity Dashboard</h1>

      {loading && <p className="text-center">Loading dashboard...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <>
          {/* Manage Campaigns Section */}
          <section className="mb-8 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Ongoing Campaigns</h2>
            {campaigns.length > 0 ? (
              <ul>
                {campaigns.map((campaign) => (
                  <li key={campaign.id} className="p-2 border-b">
                    <strong>{campaign.title}</strong> - {campaign.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active campaigns. Start one today!</p>
            )}
            <button
              onClick={() => navigate('/campaigns')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Manage Campaigns
            </button>
          </section>

          {/* Manage Donors Section */}
          <section className="mb-8 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Donors</h2>
            {donors.length > 0 ? (
              <ul>
                {donors.map((donor) => (
                  <li key={donor.id} className="p-2 border-b">
                    <strong>{donor.name}</strong> - {donor.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No registered donors yet.</p>
            )}
            <button
              onClick={() => navigate('/manage-donors')}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Manage Donors
            </button>
          </section>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => navigate('/donate')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Make a Donation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
