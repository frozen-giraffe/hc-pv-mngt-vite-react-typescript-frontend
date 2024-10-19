import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const formatter = (value: number): React.ReactNode => (
    <CountUp start={value / 2} end={value} duration={2} />
  );

  return (
    <div>
      <h1>新疆昊辰建筑设计规划研究院有限公司-产值计算系统</h1>
      {user?.full_name ? <h2>欢迎回来，{user?.full_name}</h2> : <h2>欢迎回来！</h2>}
      <Row gutter={[18,18]}>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="本年工程数量"
              value={420}
              suffix="个"
              formatter={(value) => formatter(value as number)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="总工程数量"
              value={2048}
              suffix="个"
              formatter={(value) => formatter(value as number)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="未进行产值计算项目"
              value={3}
              suffix="个"
              formatter={(value) => formatter(value as number)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="无回款项目"
              value={10}
              suffix="个"
              formatter={(value) => formatter(value as number)}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
