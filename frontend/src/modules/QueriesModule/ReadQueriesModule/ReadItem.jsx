import { Divider, Descriptions, List, Typography, Tag } from 'antd';
import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDate } from '@/settings';
import { useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import { generate as uniqueId } from 'shortid';
import { useNavigate } from 'react-router-dom';

export default function ReadItem({ config, selectedItem }) {
  console.log(selectedItem, config);
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'blue';
      case 'InProgress':
        return 'orange';
      case 'Closed':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME}`}
        ghost={false}
        tags={[<Tag color={getStatusColor(selectedItem?.status)}>{selectedItem?.status}</Tag>]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: selectedItem,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${selectedItem?._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Descriptions bordered size="small" column={1} style={{ marginBottom: '20px' }}>
        <Descriptions.Item label="Client">{selectedItem?.client?.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{selectedItem?.description}</Descriptions.Item>
        <Descriptions.Item label="Resolution">{selectedItem?.resolution}</Descriptions.Item>
        <Descriptions.Item label="Status">{selectedItem?.status}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {dayjs(selectedItem?.created).format(dateFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated">
          {dayjs(selectedItem?.updated).format(dateFormat)}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5}>Notes</Typography.Title>
      <List
        size="small"
        bordered
        dataSource={selectedItem?.notes}
        renderItem={(item) => <List.Item>{item?.note}</List.Item>}
      />
    </>
  );
}
