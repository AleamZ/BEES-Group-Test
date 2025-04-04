import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Alert } from 'antd';
import type { TableProps } from 'antd';
import "../App.scss";
import Loader from '../basicUI/loading';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    phone: string;
    website: string;
}

const ApiData = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    setUsers(data);
                    setLoading(false);
                    setError(null);
                }, 3000);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load users. Please try again later.');
                setLoading(false);
            });
    }, []);

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <a href={`mailto:${email}`}>{email}</a>,
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (website) => <a href={`http://${website}`} target="_blank" rel="noopener noreferrer">{website}</a>,
        },
        {
            title: 'Status',
            key: 'status',
            render: () => {
                const status = Math.random() > 0.5 ? 'active' : 'inactive';
                const color = status === 'active' ? 'green' : 'red';
                return (
                    <Tag color={color}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a>Edit</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Loader />
                </div>
            ) : error ? (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginTop: 20 }}
                />
            ) : (
                <Table<User>
                    columns={columns}
                    dataSource={users}
                    scroll={{ y: 500 }}
                    pagination={false}
                    rowKey="id"
                />
            )}
        </div>
    );
}

export default ApiData;