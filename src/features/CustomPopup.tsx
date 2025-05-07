import { toast } from 'react-hot-toast';
import React, { useState } from 'react';
import { Eye, Send } from 'lucide-react';

const WebinarPreview = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [channel, setChannel] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateTemplate = () => {
    return `Hi ${name}, join ${title} on ${date} at ${time}.`;
  };

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!title.trim()) return 'Webinar title is required';
    if (!date) return 'Date is required';
    if (!time) return 'Time is required';
    if (!channel) return 'Notification channel is required';
    if (!contact.trim()) return 'Contact information is required';

    if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      return 'Please enter a valid email address';
    }

    if ((channel === 'sms' || channel === 'whatsapp') &&
      !/^\+?[1-9]\d{1,14}$/.test(contact)) {
      return 'Please enter a valid phone number with country code (e.g. +1234567890)';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const message = generateTemplate();

    try {
      const userResponse = await fetch('http://localhost:3001/api/user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name }),
      });

      const userResult = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userResult.error || 'Failed to fetch user');
      }

      const userId = userResult.userId;

      const payload = { channel, contact, message, userId };

      const response = await fetch('http://localhost:3001/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification');
      }

      toast.success(result.message || `Notification sent via ${channel}!`);
      setShowPopup(false);

      setName('');
      setTitle('');
      setDate('');
      setTime('');
      setChannel('');
      setContact('');
    } catch (error: any) {
      const errorMessage = error.message || 'Unexpected error occurred';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getContactPlaceholder = () => {
    switch (channel) {
      case 'email':
        return 'Enter email address';
      case 'sms':
        return 'Enter phone number with country code (e.g. +1234567890)';
      case 'whatsapp':
        return 'Enter WhatsApp number with country code (e.g. +1234567890)';
      default:
        return 'Select a channel first';
    }
  };

  return (
    <div className="p-6">
      <div className="flex">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowPopup(true);
          }}
          className="bg-green-500 px-5 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium hover:bg-green-600 hover:scale-105 transition-transform duration-300"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl hover:scale-105 transition-transform duration-300"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Webinar Preview</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block font-medium text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">Webinar Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block font-medium text-sm text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block font-medium text-sm text-gray-700">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">Notification Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="">Select Channel</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={getContactPlaceholder()}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">Description</label>
                <textarea
                  readOnly
                  rows={3}
                  value={generateTemplate()}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 font-medium text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium disabled:bg-indigo-400 hover:scale-105 transition-transform duration-300"
              >
                {loading ? 'Sending...' : 'Send'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarPreview;
