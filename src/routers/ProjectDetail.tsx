
import { Form, Input, Button, Row, Col } from 'antd';
import React from 'react'

export const ProjectDetail = () => {
    const [form] = Form.useForm();
    const handleSubmit = (values: any) => {
        console.log('Form Values:', values);
      };
  return (
    <div>
        <Form form={form} layout="horizontal" onFinish={handleSubmit}>
        {/* First Row: Two inputs side by side */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Second Row: Email input */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        {/* Third Row: Address input */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>

        {/* Fourth Row: Button */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
