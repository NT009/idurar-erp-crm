import { useEffect, useState } from 'react';
import { Modal, Spin, Typography } from 'antd';
import { request } from '@/request';

const { Paragraph } = Typography;

const loadingTexts = ['Analyzing Notes...', 'Generating Summary...', 'Almost Ready...'];

function GenerateSummaryModal({ isOpen, handleClose, entity, id }) {
  console.log(entity, id, isOpen);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 1000); // change text every second
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (isOpen) {
      genrateSummary();
    }
  }, [isOpen]);

  const genrateSummary = async () => {
    setLoading(true);
    try {
      const response = await request.get({ entity: `${entity}/notesSummary/${id}` });
      setSummary(response?.result?.summary || 'No summary available.');
      if (response?.result?.success) {
        dispatch(erp.read({ entity: config.entity, id }));
      }
    } catch (error) {
      setSummary('Failed to generate summary.');
      handleClose();
    }
    setLoading(false);
  };

  return (
    <Modal open={isOpen} title="Generate Summary" onCancel={handleClose} footer={null} centered>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Spin size="large" />
          <p style={{ marginTop: 16, fontWeight: 500 }}>{loadingTexts[loadingStep]}</p>
        </div>
      ) : (
        <div>
          <Paragraph style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{summary}</Paragraph>
        </div>
      )}
    </Modal>
  );
}

export default GenerateSummaryModal;
