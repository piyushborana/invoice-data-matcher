'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [mon, setMon] = useState(1);
    const [fy, setFy] = useState('2024-25');
    const [data, setData] = useState({ entriesInBoth: [], onlyIn2Entries: [], onlyInPurchaseEntries: [] });
    const [filter, setFilter] = useState('entriesInBoth');
    const [exactMatch, setExactMatch] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/match', { params: { mon, fy } });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data[filter].filter(item => {
        if (filter === 'entriesInBoth' && exactMatch !== 'all') {
            return item.exactMatch === (exactMatch === 'true');
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-blue-100 text-gray-800 p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center">Invoice Data</h1>

            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
                <div className="flex flex-col md:flex-row md:gap-4 items-center">
                    <select
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setMon(Number(e.target.value))}
                        value={mon}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>

                    {/* Financial Year input */}
                    <input
                        type="text"
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 md:mt-0"
                        onChange={(e) => setFy(e.target.value)}
                        value={fy}
                        placeholder="Enter FY"
                    />

                    {/* Filter selection dropdown */}
                    <select
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 md:mt-0"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="entriesInBoth">Entries in Both</option>
                        <option value="onlyIn2Entries">Only in GSTR2</option>
                        <option value="onlyInPurchaseEntries">Only in Purchases</option>
                    </select>

                    {/* Exact match filter for "Entries in Both" */}
                    {filter === 'entriesInBoth' && (
                        <select
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 md:mt-0"
                            onChange={(e) => setExactMatch(e.target.value)}
                            value={exactMatch}
                        >
                            <option value="all">All</option>
                            <option value="true">Exact Match</option>
                            <option value="false">Does not Match</option>
                        </select>
                    )}
                </div>

                {/* Button to fetch data */}
                <button
                    className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={fetchData}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch Data'}
                </button>
            </div>

            <div className="space-y-4">
                {filteredData.length === 0 ? (
                    <p className="text-center text-gray-500">No data available for the selected filters.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-3 border-r border-gray-300">#</th>
                                    <th className="p-3 border-r border-gray-300">Date</th>
                                    <th className="p-3 border-r border-gray-300">Inum</th>
                                    <th className="p-3 border-r border-gray-300">Ctin</th>
                                    <th className="p-3 border-r border-gray-300">Rt</th>
                                    <th className="p-3 border-r border-gray-300">GstAmount</th>
                                    <th className="p-3">InvoiceValue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} className={`${item.exactMatch ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <td className="p-3 border-r border-gray-300">{index + 1}</td>
                                        <td className="p-3 border-r border-gray-300">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="p-3 border-r border-gray-300">{item.inum}</td>
                                        <td className="p-3 border-r border-gray-300">{item.ctin}</td>
                                        <td className="p-3 border-r border-gray-300">{item.rt}</td>
                                        <td className="p-3 border-r border-gray-300">{item.gstAmount}</td>
                                        <td className="p-3">{item.invoiceValue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}