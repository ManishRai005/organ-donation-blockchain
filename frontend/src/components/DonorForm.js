// Enhanced DonorForm.js
import React, { useState } from 'react';
import { useCanister } from '@dfinity/react';

const DonorForm = () => {
  const [organDonation] = useCanister('organ_donation');
  const [formData, setFormData] = useState({
    name: '',
    organ: 'heart' // Default value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const donorId = await organDonation.registerDonor(formData.name, formData.organ);
      alert(`Registered successfully! Donor ID: ${donorId}`);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Full Name"
        required
      />
      <select
        value={formData.organ}
        onChange={(e) => setFormData({...formData, organ: e.target.value})}
      >
        <option value="heart">Heart</option>
        <option value="kidney">Kidney</option>
        <option value="liver">Liver</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};