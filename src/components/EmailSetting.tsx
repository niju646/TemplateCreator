import React, { useState, useEffect } from 'react';
import { Mail, User, CheckCircle, AlertCircle, Edit2, Settings, Plus } from 'lucide-react';

const EmailSettingsForm: React.FC = () => {
    const [fromName, setFromName] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<{ fromName?: string; replyTo?: string }>({});
    const [emailSettings, setEmailSettings] = useState<any[]>([]);
    const [editingSettingId, setEditingSettingId] = useState<number | null>(null);

    // Fetch email settings when the component mounts
    useEffect(() => {
        const fetchEmailSettings = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/email-settings/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const { data } = await response.json();
                setEmailSettings(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.log('Error fetching email settings:', error.message);
                }
            }
        };
        fetchEmailSettings();
    }, [showSuccess]);

    const validateForm = () => {
        const newErrors: { fromName?: string; replyTo?: string } = {};

        if (!fromName.trim()) {
            newErrors.fromName = 'From name is required';
        } else if (fromName.trim().length < 2) {
            newErrors.fromName = 'From name must be at least 2 characters';
        }

        if (!replyTo.trim()) {
            newErrors.replyTo = 'Reply-to email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
            newErrors.replyTo = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = (setting: any) => {
        setEditingSettingId(setting.id);
        setFromName(setting.from_name);
        setReplyTo(setting.reply_to_email);
        // Smooth scroll to form
        document.querySelector('#email-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingSettingId(null);
        setFromName('');
        setReplyTo('');
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        setShowSuccess(false);

        try {
            const method = editingSettingId ? 'PUT' : 'POST';
            const url = editingSettingId
                ? `http://localhost:3001/api/email-settings/${editingSettingId}`
                : 'http://localhost:3001/api/email-settings';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from_name: fromName.trim(),
                    reply_to: replyTo.trim(),
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            console.log(editingSettingId ? 'Form updated:' : 'Form submitted:', { fromName, replyTo });
            setFromName('');
            setReplyTo('');
            setEditingSettingId(null);
            setShowSuccess(true);
        } catch (error) {
            if (error instanceof Error) {
                alert('An error occurred: ' + error.message);
            } else {
                alert('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    };

    const handleInputChange = (field: 'fromName' | 'replyTo', value: string) => {
        if (field === 'fromName') {
            setFromName(value);
        } else {
            setReplyTo(value);
        }
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 text-center mb-12">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                        <Settings className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Email Settings Manager
                    </h1>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-center space-x-4 shadow-lg">
                        <div className="flex-shrink-0">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-green-800 font-semibold text-lg">
                                {editingSettingId ? 'Settings Updated Successfully!' : 'Settings Saved Successfully!'}
                            </h3>
                            <p className="text-green-700">Your email configuration has been updated and is now active.</p>
                        </div>
                    </div>
                )}

                {/* Main Content - Single Column Layout */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Form Section */}
                    <div id="email-form" className="order-1">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                            <div className="px-8 py-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-b border-white/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-6 h-6 text-indigo-600" />
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {editingSettingId ? 'Edit Configuration' : 'New Configuration'}
                                        </h2>
                                    </div>
                                    {editingSettingId && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 space-y-8">
                                {/* From Name Field */}
                                <div className="space-y-3">
                                    <label htmlFor="fromName" className="flex items-center text-sm font-semibold text-gray-800">
                                        <User className="w-5 h-5 mr-2 text-indigo-500" />
                                        Sender Name
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="fromName"
                                            type="text"
                                            value={fromName}
                                            onChange={(e) => handleInputChange('fromName', e.target.value)}
                                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 group-hover:shadow-lg ${
                                                errors.fromName 
                                                    ? 'border-red-300 bg-red-50/50' 
                                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                                            }`}
                                            placeholder="e.g., YourBrand Academy"
                                        />
                                        {errors.fromName && (
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.fromName ? (
                                        <p className="text-sm text-red-600 flex items-center font-medium">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            {errors.fromName}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            This name appears as the sender in all outgoing emails
                                        </p>
                                    )}
                                </div>
                                {/* Reply To Email Field */}
                                <div className="space-y-3">
                                    <label htmlFor="replyTo" className="flex items-center text-sm font-semibold text-gray-800">
                                        <Mail className="w-5 h-5 mr-2 text-indigo-500" />
                                        Reply-to Email Address
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="replyTo"
                                            type="email"
                                            value={replyTo}
                                            onChange={(e) => handleInputChange('replyTo', e.target.value)}
                                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 group-hover:shadow-lg ${
                                                errors.replyTo 
                                                    ? 'border-red-300 bg-red-50/50' 
                                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                                            }`}
                                            placeholder="e.g., support@yourbrand.com"
                                        />
                                        {errors.replyTo && (
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.replyTo ? (
                                        <p className="text-sm text-red-600 flex items-center font-medium">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            {errors.replyTo}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            All subscriber replies will be forwarded to this address
                                        </p>
                                    )}
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    {editingSettingId && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-105'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                {editingSettingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                <span>{editingSettingId ? 'Update Configuration' : 'Save Configuration'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings List Section */}
                    <div className="order-2">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                            <div className="px-8 py-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-b border-white/20">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <Settings className="w-6 h-6 mr-3 text-indigo-600" />
                                        Saved Configurations
                                    </h2>
                                    <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                                        {emailSettings.length} {emailSettings.length === 1 ? 'Setting' : 'Settings'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 max-h-96 overflow-y-auto">
                                {emailSettings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-500 mb-2">No Configurations Yet</h3>
                                        <p className="text-gray-400">Create your first email configuration to get started</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {emailSettings.map((setting, index) => (
                                            <div
                                                key={setting.id}
                                                className={`group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-102 ${
                                                    editingSettingId === setting.id 
                                                        ? 'border-indigo-300 bg-indigo-50/50 shadow-lg' 
                                                        : 'border-gray-200 hover:border-indigo-200'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 text-lg">{setting.from_name}</h3>
                                                                <p className="text-indigo-600 font-medium">{setting.reply_to_email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2 inline-block">
                                                            Created: {new Date(setting.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleEdit(setting)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl opacity-80 group-hover:opacity-100"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="font-medium">Edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Need assistance? Contact our support team for help with email configuration.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailSettingsForm;