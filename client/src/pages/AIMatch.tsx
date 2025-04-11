import React, { useState } from 'react';
import axios from 'axios';

const AIMatch: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!file || !jobId) {
        setError('Please select a file and enter a Job ID.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('cv', file);
      formData.append('jobId', jobId);

      const res = await axios.post('http://localhost:5001/api/cover-letter/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCoverLetter(res.data.coverLetter);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎯 AI Match – Get Your Cover Letter</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Upload Your CV (PDF)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Job ID</label>
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Enter Job ID (24 characters)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Please enter a valid MongoDB ObjectId (24 characters)</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {coverLetter && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-700">📝 Generated Cover Letter</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{coverLetter}</pre>
        </div>
      )}
    </div>
  );
};

export default AIMatch;
