from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)


# Load your trained model and LabelEncoder
model = joblib.load('crop_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json

        # Extract features in the order your model expects
        features = [data['N'], data['P'], data['K'], data['temperature'], data['humidity'], data['ph'], data['rainfall']]
        
        # Convert features into numpy array and reshape for a single sample
        features_array = np.array(features).reshape(1, -1)

        # Predict encoded label
        prediction_encoded = model.predict(features_array)[0]

        # Convert encoded label to original label (crop name)
        prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]

        # Return prediction as JSON
        return jsonify({'recommended_crop': prediction_label})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
