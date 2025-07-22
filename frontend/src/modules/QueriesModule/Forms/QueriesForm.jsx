import React from 'react';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import { Button, Form, Divider, Row, Col, Input, Select } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';


function QueriesForm() {
    const translate = useLanguage();
  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="client"
            label={translate('Client')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'client'}
              displayLabels={['name']}
              searchFields={'name'}
              redirectLabel={'Add New Client'}
              withRedirect
              urlToRedirect={'/customer'}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={16}>
          <Form.Item
            name="description"
            label={translate('Description')}
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item label={translate('Status')} name="status" initialValue="Open">
            <Select
              options={[
                { value: 'Open', label: 'Open' },
                { value: 'InProgress', label: 'In Progress' },
                { value: 'Closed', label: 'Closed' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={16}>
          <Form.Item name="resolution" label={translate('Resolution')}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Form.List name="notes">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row key={field.key} gutter={12} align="top">
                <Col span={22}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'note']}
                    fieldKey={[field.fieldKey, 'note']}
                    rules={[{ required: true, message: 'Please enter note' }]}
                  >
                    <Input placeholder="Note" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button
                    danger
                    onClick={() => remove(field.name)}
                    icon={<CloseCircleOutlined />}
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                {translate('Add Note')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default QueriesForm;
