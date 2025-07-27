import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Dropdown, Table, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RedoOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  FileAddOutlined,
  FormOutlined,
} from '@ant-design/icons';

import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import Delete from '@/modules/ErpPanelModule/DeleteItem';
import useLanguage from '@/locale/useLanguage';
import AddNoteModal from '../Forms/AddNoteFormModal';

// Add New Item Button
function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

// Main Data Panel Component
export default function DataPanel({ config }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useErpContext();
  const { erpContextAction } = useErpContext();
  const { deleteModal } = state;
  const { modal } = erpContextAction;
  const [addNotesModal, setAddNotesModal] = useState({
    open: false,
    data: null,
  });

  const translate = useLanguage();

  const {
    entity,
    dataTableColumns: initialColumns,
    disableAdd = false,
    DATATABLE_TITLE,
    reloadData,
    setReloadData,
  } = config;

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;

  // Action handlers
  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };

  const handleEdit = (record) => {
    dispatch(erp.currentAction({ actionType: 'update', data: record }));
    navigate(`/${entity}/update/${record._id}`);
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };
  const handleAddNote = (record) => {
    setAddNotesModal({
      open: true,
      data: record,
    });
  };

  const actionMenuItems = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('add_note'),
      key: 'add_note',
      icon: <FormOutlined />,
    },
    { type: 'divider' },
    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const columns = [
    ...initialColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: actionMenuItems,
            onClick: ({ key }) => {
              if (key === 'read') handleRead(record);
              else if (key === 'edit') handleEdit(record);
              else if (key === 'add_note') handleAddNote(record);
              else if (key === 'delete') handleDelete(record);
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const loadDataTable = (pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
    };
    dispatch(erp.list({ entity, options }));
  };

  const fetchData = () => {
    dispatch(erp.resetState());
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    fetchData();
  }, [reloadData]);

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <Button key="refresh" onClick={loadDataTable} icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,
          !disableAdd && <AddNewItem key="add" config={config} />,
        ]}
        style={{ padding: '20px 0px' }}
      />

      <Table
        columns={columns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={loadDataTable}
        scroll={{ x: true }}
      />

      <Delete config={config} isOpen={deleteModal.isOpen} />
      <AddNoteModal
        entity={entity}
        open={addNotesModal?.open}
        data={addNotesModal?.data}
        onClose={() => setAddNotesModal(false)}
        onFinish={() => {
          setReloadData(!reloadData);
          setAddNotesModal({
            open: false,
            data: null,
          });
        }}
      />
    </>
  );
}
