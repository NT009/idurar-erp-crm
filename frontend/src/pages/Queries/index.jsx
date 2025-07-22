import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { useDate } from '@/settings';
import QueriesDataTableModule from '@/modules/QueriesModule/QueriesDataTableModule';
import { Select, Tooltip } from 'antd';
import { request } from '@/request';
import { useState } from 'react';
import Loading from '@/components/Loading';
export default function Queries() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const entity = 'queries';

  const deleteModalLabels = ['description'];

  const Labels = {
    PANEL_TITLE: translate('queries'),
    DATATABLE_TITLE: translate('queries_list'),
    ADD_NEW_ENTITY: translate('add_new_query'),
    ENTITY_NAME: translate('queries'),
  };
  const onStatusChange = async (newValue, record) => {
    setIsLoading(true);
    const requestData = {
      entity: `${entity}/update/${record._id}`,
      jsonData: { status: newValue },
    };
    const response = await request.patch(requestData);
    if (response?.success) {
      setReload(!reload);
    }
    setIsLoading(false);
  };
  const dataTableColumns = [
    {
      title: translate('client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Description'),
      dataIndex: 'description',
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (value, record) => (
        <Select
          value={value}
          onChange={(newValue) => onStatusChange(newValue, record)}
          options={[
            { label: 'Open', value: 'Open' },
            { label: 'InProgress', value: 'InProgress' },
            { label: 'Closed', value: 'Closed' },
          ]}
          style={{ width: 120 }}
        />
      ),
    },

    {
      title: translate('resolution'),
      dataIndex: 'resolution',
      width: '200px',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div
            style={{
              maxWidth: '200px', // adjust this width as needed
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },

    {
      title: translate('created_date'),
      dataIndex: 'created',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
  ];
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    deleteModalLabels,
    reloadData:reload,
    setReloadData:setReload,
    disablePdfDownload: true,
  };
  return (
    <Loading isLoading={isLoading}>
      <QueriesDataTableModule config={config} />
    </Loading>
  );
}
