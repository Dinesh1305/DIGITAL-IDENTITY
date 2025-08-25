"use client";

import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { innovationABI } from '../constants/abi';

export default function Home() {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
    telegramId: ''
  });

  const { write: submitProject } = useContractWrite({
    address: '0x9d2ade18cb6bea1a',
    abi: innovationABI,
    functionName: 'submitProject',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProject({
      args: [formData.name, formData.description, formData.githubUrl, formData.telegramId],
    });
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Open Innovation Submission</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-2">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">GitHub URL</label>
          <input
            type="text"
            value={formData.githubUrl}
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Telegram ID</label>
          <input
            type="text"
            value={formData.telegramId}
            onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!address}
        >
          Submit Project
        </button>
      </form>
    </main>
  );
}