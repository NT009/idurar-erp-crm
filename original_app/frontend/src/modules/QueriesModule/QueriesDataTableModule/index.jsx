import { ErpLayout } from '@/layout';
import DataPanel from './DataPanel';

export default function QueriesDataTableModule({ config }) {
  return (
    <ErpLayout>
      <DataPanel config={config} />
    </ErpLayout>
  );
}
