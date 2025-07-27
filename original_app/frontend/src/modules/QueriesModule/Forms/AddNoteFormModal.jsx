import { useState } from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { request } from '@/request';

export default function AddNoteModal({ open, onClose, onFinish, entity, data }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const requestData = {
      entity: `${entity}/${data._id}/notes`,
      jsonData: form.getFieldsValue(),
    };
    const response = await request.post(requestData);
    if (response?.success) {
      onClose();
      form.resetFields();
      onFinish();
    }
    setSubmitting(false);
  };

  return (
    <Modal
      title="Add Notes"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={submitting} onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: true, message: 'Please enter a note' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter your note here" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
