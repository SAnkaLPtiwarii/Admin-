import axios from 'axios';

// Mock data
const mockUsers = [
    { id: 1, name: 'sankalp', email: 'sankalp@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane', email: 'jane@example.com', role: 'user', status: 'active' },
];

export const getUserStats = async () => {
    return {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        newSignups: 5,
        userGrowth: [
            { month: 'Jan', users: 100 },
            { month: 'Feb', users: 150 },
            { month: 'Mar', users: 180 },
            { month: 'Apr', users: 220 },
            { month: 'May', users: 270 },
        ]
    };
};

export const getUsers = async () => {
    return mockUsers;
};

export const createUser = async (userData) => {
    const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        status: 'active',
    };
    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = async (id, userData) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData };
        return mockUsers[index];
    }
    throw new Error('User not found');
};

export const deleteUser = async (id) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        mockUsers.splice(index, 1);
        return true;
    }
    throw new Error('User not found');
};