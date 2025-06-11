import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { User, Save, Info } from 'lucide-react';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(profile);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const lifestyleOptions = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'pregnant', label: 'Pregnant', description: 'Expecting mother' },
    { value: 'breastfeeding', label: 'Breastfeeding', description: 'Nursing mother' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h2>
        <p className="text-gray-600">Personalize your nutrition targets</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="text-green-800">Profile updated successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sex
              </label>
              <select
                value={profile.sex}
                onChange={(e) => setProfile({ ...profile, sex: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Measurements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Measurements (Optional)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={profile.weight || ''}
                onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your weight"
                min="20"
                max="300"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={profile.height || ''}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your height"
                min="100"
                max="250"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle & Activity</h3>
          
          <div className="space-y-3">
            {lifestyleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  profile.lifestyle === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="lifestyle"
                  value={option.value}
                  checked={profile.lifestyle === option.value}
                  onChange={(e) => setProfile({ ...profile, lifestyle: e.target.value as any })}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How we use your information:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Calculate personalized daily nutrition targets</li>
                <li>• Provide accurate deficiency assessments</li>
                <li>• Tailor meal recommendations to your needs</li>
                <li>• All data is stored locally on your device</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save size={20} />
          <span>Save Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;