import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import motion
import './CropForm.css';

function CropForm() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [prediction, setPrediction] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(res.data.recommended_crop);
    } catch (error) {
      console.error(error);
      setPrediction('Something went wrong!');
    }
  };

  const labels = {
    N: 'Nitrogen (N)',
    P: 'Phosphorus (P)',
    K: 'Potassium (K)',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    ph: 'pH Value',
    rainfall: 'Rainfall (mm)'
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.h2
        className="title"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        🌾 Crop Recommendation System 🌱
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {Object.keys(formData).map((key, index) => (
          <motion.div
            key={key}
            className="form-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <label>{labels[key]}:</label>
            <input
              type="number"
              step="0.1"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </motion.div>
        ))}

        <motion.button
          type="submit"
          className="btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔍 Predict
        </motion.button>
      </motion.form>

      {prediction && (
        <motion.h3
          className="result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          🌱 Recommended Crop: <span>{prediction}</span>
        </motion.h3>
      )}
    </motion.div>
  );
}

export default CropForm;
