import { Space, Table, Tag, Tooltip, Modal, Form, Input, Select, message, Button } from 'antd';
import type { TableProps } from 'antd';
import data from '../data/data.json';
import "../App.scss"
import React from 'react';

interface DataType {
    id: string;
    name: string;
    balance: number;
    email: string;
    registration: string;
    status: string;
}
const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        sorter: {
            compare: (a, b) => a.balance - b.balance,
            multiple: 2
        },
        render: (balance) => `$${balance.toFixed(2)}`,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (email) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
        title: 'Registration Date',
        dataIndex: 'registration',
        key: 'registration',
        sorter: {
            compare: (a, b) => new Date(a.registration).getTime() - new Date(b.registration).getTime(),
            multiple: 1
        },
        render: (date) => {
            const fullDate = new Date(date);
            const formattedDate = fullDate.toISOString().split('T')[0];

            const tooltipDateTime = `${fullDate.getUTCFullYear()}-${String(fullDate.getUTCMonth() + 1).padStart(2, '0')}-${String(fullDate.getUTCDate()).padStart(2, '0')} ${String(fullDate.getUTCHours()).padStart(2, '0')}:${String(fullDate.getUTCMinutes()).padStart(2, '0')}:${String(fullDate.getUTCSeconds()).padStart(2, '0')}`;

            return (
                <Tooltip title={tooltipDateTime}>
                    <span>{formattedDate}</span>
                </Tooltip>
            );
        },
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status) => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];
const FakeData = () => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [tableData, setTableData] = React.useState<DataType[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<DataType | null>(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulating API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (!data.users) {
                throw new Error('No data available');
            }

            setTableData(data.users);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
            setError(errorMessage);
            message.error('Failed to load users data');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (record: DataType) => {
        setSelectedUser(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditModalOk = async () => {
        try {
            // Here you would typically update the data
            message.success('User updated successfully');
            setIsEditModalOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error('Failed to update user');
        }
    };

    const handleEditModalCancel = () => {
        setIsEditModalOpen(false);
        form.resetFields();
        message.info('Edit cancelled');
    };

    // Modify the columns array to update the Action column
    const actionColumn = columns.find(col => col.key === 'action');
    if (actionColumn) {
        actionColumn.render = (_, record) => (
            <Space size="middle">
                <a onClick={() => handleEdit(record)}>Edit</a>
                <a>Delete</a>
            </Space>
        );
    }

    // Error state UI
    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3 style={{ color: '#ff4d4f' }}>Error loading data</h3>
                <p>{error}</p>
                <Button onClick={fetchData} type="primary">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Table<DataType>
                columns={columns}
                dataSource={tableData}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ y: 500 }}
                rowKey="id"
            />
            <Modal
                title="Edit User"
                open={isEditModalOpen}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={selectedUser || {}}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="balance"
                        label="Balance"
                        rules={[{ required: true, message: 'Please input the balance!' }]}
                    >
                        <Input type="number" prefix="$" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select the status!' }]}
                    >
                        <Select>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default FakeData