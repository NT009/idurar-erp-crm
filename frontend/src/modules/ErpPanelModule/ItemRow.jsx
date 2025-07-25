import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney, useDate } from '@/settings';
import calculate from '@/utils/calculate';
import useLanguage from '@/locale/useLanguage';

export default function ItemRow({ field, remove, current = null, isItemsNotes = false }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const translate = useLanguage();
  const money = useMoney();
  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };

  useEffect(() => {
    if (current) {
      // When it accesses the /payment/ endpoint,
      // it receives an invoice.item instead of just item
      // and breaks the code, but now we can check if items exists,
      // and if it doesn't we can access invoice.items.

      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);

    setTotal(currentTotal);
  }, [price, quantity]);

  return (
    <Row gutter={[12, 12]} align={"top"}>
      <Col xs={24} md={isItemsNotes ? 6 : 5}>
        <Form.Item
          {...(isItemsNotes ? { label: translate('Item') } : {})}
          name={[field.name, 'itemName']}
          rules={[
            {
              required: true,
              message: 'Missing itemName name',
            },
            {
              pattern: /^(?!\s*$)[\s\S]+$/, // Regular expression to allow spaces, alphanumeric, and special characters, but not just spaces
              message: 'Item Name must contain alphanumeric or special characters',
            },
          ]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col>

      <Col xs={24} md={isItemsNotes ? 6 : 7}>
        <Form.Item
          {...(isItemsNotes ? { label: translate('Description') } : {})}
          name={[field.name, 'description']}
        >
          <Input placeholder="Description" />
        </Form.Item>
      </Col>

      <Col xs={12} md={isItemsNotes ? 4 : 3}>
        <Form.Item
          {...(isItemsNotes ? { label: translate('Quantity') } : {})}
          name={[field.name, 'quantity']}
          rules={[{ required: true, message: 'Quantity is required' }]}
        >
          <InputNumber min={0} onChange={updateQt} style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col xs={12} md={4}>
        <Form.Item
          {...(isItemsNotes ? { label: translate('Price') } : {})}
          name={[field.name, 'price']}
          rules={[{ required: true, message: 'Price is required' }]}
        >
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            style={{ width: '100%' }}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>

      <Col xs={12} md={4}>
        <Form.Item {...(isItemsNotes ? { label: translate('Total') } : {})}>
          <InputNumber
            readOnly
            className="moneyInput"
            value={totalState}
            min={0}
            controls={false}
            style={{ width: '100%' }}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
            formatter={(value) =>
              money.amountFormatter({
                amount: value,
                currency_code: money.currency_code,
              })
            }
          />
        </Form.Item>
      </Col>
      {isItemsNotes && (
        <Col xs={24} md={6}>
          <Form.Item label={translate('Notes')} name={[field.name, 'notes']}>
            <Input.TextArea rows={2} placeholder="Notes..." />
          </Form.Item>
        </Col>
      )}

      <Col xs={2} md={1}>
        <Form.Item >
          <DeleteOutlined
            onClick={() => remove(field.name)}
            style={{ color: 'red', fontSize: 18, cursor: 'pointer' }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
