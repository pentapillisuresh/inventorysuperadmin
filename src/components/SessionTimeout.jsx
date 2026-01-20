import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const SessionTimeout = ({ onExtend, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const loginTime = localStorage.getItem('superAdminLoginTime');
    if (loginTime) {
      const checkSession = () => {
        const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
        const hoursRemaining = 24 - hoursSinceLogin;
        
        // Show warning when less than 5 minutes remain
        if (hoursRemaining * 60 * 60 < 300) {
          setShowWarning(true);
          setTimeLeft(Math.floor(hoursRemaining * 60 * 60));
        }
      };

      checkSession();
      const interval = setInterval(checkSession, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (showWarning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showWarning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtend = () => {
    localStorage.setItem('superAdminLoginTime', new Date().toISOString());
    setShowWarning(false);
    if (onExtend) onExtend();
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Session Timeout Warning</h3>
              <p className="text-sm text-gray-600">Your session is about to expire</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-lg font-bold text-amber-800">
                {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-center text-sm text-amber-700">
              Your session will expire in {formatTime(timeLeft)} minutes
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              For security reasons, your session will expire soon. Please extend your session or save your work.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Logout Now
            </button>
            <button
              onClick={handleExtend}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;