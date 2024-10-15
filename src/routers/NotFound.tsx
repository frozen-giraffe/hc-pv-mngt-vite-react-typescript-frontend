import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，您访问的页面不存在。"
      extra={[
        <Button type="primary" key="home" onClick={goHome}>
          返回首页
        </Button>,
        <Button key="back" onClick={goBack}>
          返回上一页
        </Button>,
      ]}
    >
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            尝试访问：{location.pathname}
          </Text>
        </Paragraph>
        <Paragraph>
          来自：{location.state?.from || "未知来源"}
        </Paragraph>
      </div>
    </Result>
  );
};

export default NotFound;
