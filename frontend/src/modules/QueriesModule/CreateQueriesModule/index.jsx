import { ErpLayout } from '@/layout';
import CreateItem from './Createitem';

export default function CreateQueriesModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config}  />
    </ErpLayout>
  );
}
