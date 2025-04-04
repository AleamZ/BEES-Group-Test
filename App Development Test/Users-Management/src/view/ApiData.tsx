import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Alert, Modal, Form, Input } from 'antd';
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
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

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

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsEditModalVisible(true);
    };

    const handleDelete = (user: User) => {
        setEditingUser(user);
        setIsDeleteModalVisible(true);
    };

    const handleEditSubmit = () => {
        form.validateFields().then(values => {
            const updatedUsers = users.map(user =>
                user.id === editingUser?.id ? { ...user, ...values } : user
            );
            setUsers(updatedUsers);
            setIsEditModalVisible(false);
            form.resetFields();
        });
    };

    const handleDeleteConfirm = () => {
        if (editingUser) {
            const updatedUsers = users.filter(user => user.id !== editingUser.id);
            setUsers(updatedUsers);
            setIsDeleteModalVisible(false);
        }
    };

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
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>Edit</a>
                    <a onClick={() => handleDelete(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRows(selectedRowKeys);
        },
    };

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
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={users}
                    scroll={{ y: 500 }}
                    pagination={false}
                    rowKey="id"
                />
            )}
            <Modal
                title="Edit User"
                open={isEditModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label="Username">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>
                    <Form.Item name="website" label="Website">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Delete User"
                open={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete {editingUser?.name}?</p>
            </Modal>
        </div>
    );
}

export default ApiData;