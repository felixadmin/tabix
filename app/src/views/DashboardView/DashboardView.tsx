import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { Layout } from 'antd';
import { Flex } from 'reflexy';
import { typedInject } from '@vzh/mobx-stores';
import { ServerStructure } from 'services';
import { Stores, DashboardStore } from 'stores';
import Page from 'components/Page';
import { DBTree, SqlEditor } from 'components/Dashboard';
import Splitter from 'components/Splitter';
// import css from './DashboardView.css';

interface InjectedProps {
  store: DashboardStore;
}

export interface Props extends InjectedProps {}

type RoutedProps = Props & RouteComponentProps<any>;

@observer
class DashboardView extends React.Component<RoutedProps> {
  componentWillMount() {
    this.load();
  }

  private load = () => {
    const { store } = this.props;
    store.loadData();
  };

  private onColumnClick = (column: ServerStructure.Column) => {
    console.log(column);
  };

  render() {
    const { store } = this.props;

    return (
      <Page column={false} uiStore={store.uiStore}>
        <Splitter>
          <Flex alignItems="stretch" vfill>
            <Layout>
              <Layout.Sider width="100%">
                {store.serverStructure
                  .map(s => (
                    <DBTree structure={s} onReload={this.load} onColumnClick={this.onColumnClick} />
                  ))
                  .orUndefined()}
              </Layout.Sider>
            </Layout>
          </Flex>

          <Splitter split="horizontal" minSize={100} defaultSize={350}>
            <SqlEditor databases={store.serverStructure.map(_ => _.databases).getOrElse([])} fill />

            <Flex>123</Flex>
          </Splitter>
        </Splitter>
      </Page>
    );
  }
}

export default withRouter(
  typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({ store: store.dashboardStore }))(
    DashboardView
  )
);