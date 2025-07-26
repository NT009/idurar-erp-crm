import { Button, Form, Input, Select } from "antd";
const { TextArea } = Input;
const statusOptions = ["pending", "in-progress", "completed"];
function FormItems() {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Project name is required" }]}
      >
        <Input placeholder="Enter project name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <TextArea rows={3} placeholder="Enter description" />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Select a status" }]}
      >
        <Select>
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      
    </>
  );
}

export default FormItems;
