// Initialize localStorage with dummy data
export const initializeDummyData = () => {
  if (!localStorage.getItem('admins')) {
    const dummyAdmins = [
      {
        id: '1',
        businessName: 'IceCool Pvt Ltd',
        businessType: 'Ice Cream',
        adminName: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh@icecool.com',
        password: 'auto-generated-123',
        passwordMethod: 'auto',
        planType: 'Yearly',
        planStartDate: '2024-01-15',
        planEndDate: '2025-01-15',
        status: 'Active',
        createdAt: '2024-01-15T10:30:00Z',
        daysRemaining: 180,
        limits: {
          maxStores: 5,
          maxManagers: 10,
          maxOutlets: 20
        },
        features: {
          dashboard: true,
          productManagement: true,
          invoiceManagement: true,
          appointmentBooking: false,
          reportsAnalytics: true
        }
      },
      {
        id: '2',
        businessName: 'Beauty Bliss Salon',
        businessType: 'Salon',
        adminName: 'Priya Sharma',
        phone: '+91 98765 43211',
        email: 'priya@beautybliss.com',
        password: 'auto-generated-456',
        passwordMethod: 'auto',
        planType: 'Monthly',
        planStartDate: '2024-11-01',
        planEndDate: '2024-12-01',
        status: 'Active',
        createdAt: '2024-11-01T14:20:00Z',
        daysRemaining: 15,
        limits: {
          maxStores: 3,
          maxManagers: 5,
          maxOutlets: 10
        },
        features: {
          dashboard: true,
          productManagement: true,
          invoiceManagement: true,
          appointmentBooking: true,
          reportsAnalytics: true
        }
      },
      {
        id: '3',
        businessName: 'Fresh Mart Retail',
        businessType: 'Retail',
        adminName: 'Amit Patel',
        phone: '+91 98765 43212',
        email: 'amit@freshmart.com',
        password: 'auto-generated-789',
        passwordMethod: 'auto',
        planType: 'Trial',
        planStartDate: '2024-11-20',
        planEndDate: '2024-12-05',
        status: 'Active',
        createdAt: '2024-11-20T09:15:00Z',
        daysRemaining: 3,
        limits: {
          maxStores: 2,
          maxManagers: 3,
          maxOutlets: 5
        },
        features: {
          dashboard: true,
          productManagement: true,
          invoiceManagement: false,
          appointmentBooking: false,
          reportsAnalytics: true
        }
      }
    ];

    localStorage.setItem('admins', JSON.stringify(dummyAdmins));
  }

  if (!localStorage.getItem('recentActivity')) {
    const dummyActivity = [
      {
        business: 'IceCool Pvt Ltd',
        description: 'Account created',
        time: '2 hours ago',
        type: 'created'
      },
      {
        business: 'Beauty Bliss Salon',
        description: 'Plan renewed - Yearly',
        time: '4 hours ago',
        type: 'renewed'
      },
      {
        business: 'Fresh Mart Retail',
        description: 'Manager added by Super Admin',
        time: '6 hours ago',
        type: 'created'
      },
      {
        business: 'Tasty Bites Restaurant',
        description: 'Subscription expiring in 2 days',
        time: '8 hours ago',
        type: 'warning'
      }
    ];

    localStorage.setItem('recentActivity', JSON.stringify(dummyActivity));
  }

  if (!localStorage.getItem('managers')) {
    const dummyManagers = [
      {
        id: '101',
        adminId: '1',
        adminName: 'IceCool Pvt Ltd',
        managerName: 'Sanjay Mehta',
        phone: '+91 98765 43213',
        email: 'sanjay@icecool.com',
        storeId: '1',
        storeName: 'IceCool Pvt Ltd - Main Store',
        password: 'manager-pass-123',
        passwordMethod: 'auto',
        status: 'Active',
        createdAt: '2024-11-15T11:30:00Z'
      }
    ];

    localStorage.setItem('managers', JSON.stringify(dummyManagers));
  }
};

// Calculate days remaining for all admins
export const updateAdminDaysRemaining = () => {
  const admins = JSON.parse(localStorage.getItem('admins') || '[]');
  const today = new Date();
  
  const updatedAdmins = admins.map(admin => {
    const endDate = new Date(admin.planEndDate);
    const diffTime = endDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Auto-block expired accounts
    let status = admin.status;
    if (daysRemaining < 0 && admin.status !== 'Blocked') {
      status = 'Blocked';
    }
    
    return {
      ...admin,
      daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
      status
    };
  });
  
  localStorage.setItem('admins', JSON.stringify(updatedAdmins));
};