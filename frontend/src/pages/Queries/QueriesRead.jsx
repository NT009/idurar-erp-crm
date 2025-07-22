import useLanguage from '@/locale/useLanguage';
import ReadQueriesModule from '@/modules/QueriesModule/ReadQueriesModule';
export default function InvoiceRead() {
  const entity = 'queries';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('queries'),
    DATATABLE_TITLE: translate('queries_list'),
    ADD_NEW_ENTITY: translate('add_new_query'),
    ENTITY_NAME: translate('queries'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadQueriesModule config={configPage} />;
}
