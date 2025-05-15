import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SalesDetail = () => {
  const [searchParams] = useSearchParams();
  const vendor = searchParams.get('vendor');
  const group = searchParams.get('group');
  const type = searchParams.get('type') || 'group_packet';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (vendor && group && token) {
        try {
          const params = {};
          if (type === 'group_packet') {
            params.group_packet = group;
          } else if (type === 'addon') {
            params.addon = group;
          }
          params.nama_vendor = vendor;

          const response = await axios.get('http://localhost:8000/filter', {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response.data);
          setError('');
        } catch (err) {
          setError('Gagal fetch filter data: ' + (err.response?.data?.message || err.message));
          setData([]);
        } finally {
          setLoading(false);
        }
      } else {
        if (!token) {
          setError('Token tidak ditemukan di localStorage.');
        } else if (!vendor || !group) {
          setError('Parameter vendor atau group tidak valid.');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [vendor, group, type]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8">
          Filtered Sales Data
        </h2>

        <div className="mb-8 text-black text-lg space-y-1">
          <p><span className="font-semibold">Vendor:</span> {vendor}</p>
          <p><span className="font-semibold">Group:</span> {group}</p>
          <p><span className="font-semibold">Type:</span> {type}</p>
        </div>

        {loading ? (
          <div className="text-blue-600 animate-pulse font-semibold text-xl">Loading data...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg font-medium">{error}</div>
        ) : data.length > 0 ? (
          <>
            <div className="mb-6 font-semibold text-green-800 text-xl">
              Total Data: <span className="text-2xl">{data.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border border-gray-300 px-6 py-3 text-left text-black font-semibold">Sales Name</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-black font-semibold">Group Packet</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-black font-semibold">Addon</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-black font-semibold">Vendor</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-black font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="border border-gray-300 px-6 py-4 text-black">{item.nama_sales || '-'}</td>
                      <td className="border border-gray-300 px-6 py-4 text-black">{item.group_packet || '-'}</td>
                      <td className="border border-gray-300 px-6 py-4 text-black">{item.addon || '-'}</td>
                      <td className="border border-gray-300 px-6 py-4 text-black">{item.nama_vendor || vendor}</td>
                      <td
                        className="border border-gray-300 px-6 py-4 italic text-black max-w-xl truncate"
                        title={item.description || ''}
                      >
                        {item.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg font-medium">Data tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default SalesDetail;
