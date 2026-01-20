import React, { useState } from 'react';
import { HelpCircle, MessageSquare, FileText, Mail, Phone, Search, ChevronDown } from 'lucide-react';

const HelpSupport = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: 'ℹ️'
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: '👤'
    },
    {
      id: 'billing',
      title: 'Billing & Plans',
      icon: '💰'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: '🔧'
    },
    {
      id: 'security',
      title: 'Security',
      icon: '🔒'
    }
  ];

  const faqs = {
    general: [
      {
        question: 'What is Super Admin Platform?',
        answer: 'Super Admin Platform is a comprehensive management system that allows platform owners to manage businesses, subscriptions, and user accounts on their SaaS platform.'
      },
      {
        question: 'Who can access the Super Admin panel?',
        answer: 'Only authorized Super Admin users with proper credentials can access this panel. Access is strictly controlled and monitored.'
      },
      {
        question: 'How do I reset my Super Admin password?',
        answer: 'Contact the system administrator or use the password reset feature if enabled. For security reasons, password resets require additional verification.'
      }
    ],
    account: [
      {
        question: 'How to create a new admin account?',
        answer: 'Navigate to Admin Creation → Create New Admin. Fill in all required details including business information, admin details, and subscription plan.'
      },
      {
        question: 'Can I edit an existing admin account?',
        answer: 'Yes, go to Admin Management, find the admin account, and click the edit icon. You can modify plan details, features, and limits.'
      },
      {
        question: 'How to block/unblock an admin?',
        answer: 'In Admin Management, use the actions menu on each admin row to block or unblock accounts. Blocked admins cannot access the system.'
      }
    ],
    billing: [
      {
        question: 'How are subscription plans managed?',
        answer: 'Super Admin can create, modify, and monitor subscription plans. Plans can be Trial, Monthly, or Yearly with custom start and end dates.'
      },
      {
        question: 'What happens when a plan expires?',
        answer: 'The system automatically blocks admin accounts when their plan expires. Super Admin can renew or extend plans to restore access.'
      },
      {
        question: 'Can I give extended trial periods?',
        answer: 'Yes, Super Admin can modify plan end dates to extend trial periods or create custom subscription durations.'
      }
    ],
    technical: [
      {
        question: 'System requirements for running the platform?',
        answer: 'Modern web browser with JavaScript enabled. Recommended: Chrome 90+, Firefox 88+, Safari 14+. Internet connection required.'
      },
      {
        question: 'How to backup system data?',
        answer: 'Use the System Settings → Backup Settings to configure automatic backups. Manual exports are also available in Audit Logs.'
      },
      {
        question: 'Troubleshooting login issues?',
        answer: 'Clear browser cache, check internet connection, verify credentials. If issues persist, contact technical support.'
      }
    ],
    security: [
      {
        question: 'What security measures are in place?',
        answer: 'The platform uses encryption, secure sessions, audit logs, and strict access controls. Regular security updates are applied.'
      },
      {
        question: 'How is user data protected?',
        answer: 'Data is encrypted in transit and at rest. Access is logged and monitored. Regular security audits are conducted.'
      },
      {
        question: 'Reporting security vulnerabilities?',
        answer: 'Report any security concerns immediately to security@yourplatform.com. Include detailed information about the issue.'
      }
    ]
  };

  const supportContacts = [
    {
      type: 'Email',
      value: 'support@superadmin.com',
      icon: <Mail className="h-5 w-5" />
    },
    {
      type: 'Phone',
      value: '+91 98765 43210',
      icon: <Phone className="h-5 w-5" />
    },
    {
      type: 'Live Chat',
      value: 'Available 24/7',
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Get help, browse documentation, and contact support</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          View Documentation
        </button>
      </div>

      {/* Search Help */}
      <div className="bg-white rounded-xl border p-6">
        <div className="max-w-2xl mx-auto text-center">
          <HelpCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How can we help you?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help topics, questions, or issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-600 mt-1">Browse questions by category</p>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap gap-2">
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-gray-200">
          {faqs[activeCategory]?.map((faq, index) => (
            <div key={index} className="px-6 py-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-medium text-gray-900 group-open:text-blue-600">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center mb-8">
          <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h2>
          <p className="text-gray-600">Get in touch with our support team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportContacts.map(contact => (
            <div key={contact.type} className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                {contact.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{contact.type}</h3>
              <p className="text-gray-600">{contact.value}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Contact via {contact.type}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Average response time: <span className="font-medium">2 hours</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Support available: <span className="font-medium">24/7</span>
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-medium">User Manual</span>
          </a>
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-medium">API Documentation</span>
          </a>
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-medium">System Requirements</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;