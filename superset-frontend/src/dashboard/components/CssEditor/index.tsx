/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Key, ReactNode, PureComponent } from 'react';
import {
  Dropdown,
  CssEditor as AceCssEditor,
  Button,
  ModalTrigger,
} from '@superset-ui/core/components';
import rison from 'rison';
import { Menu } from '@superset-ui/core/components/Menu';
import { t, styled, SupersetClient } from '@superset-ui/core';

export interface CssEditorProps {
  initialCss: string;
  triggerNode: ReactNode;
  onChange: (css: string) => void;
  addDangerToast: (msg: string) => void;
}

export type CssEditorState = {
  css: string;
  templates?: Array<{
    css: string;
    label: string;
  }>;
};
const StyledWrapper = styled.div`
  ${({ theme }) => `
    .css-editor-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: ${theme.sizeUnit * 2}px;

      h5 {
        margin-top: ${theme.sizeUnit}px;
      }
    }
    .css-editor {
      border: 1px solid ${theme.colorBorder};
    }
  `}
`;

class CssEditor extends PureComponent<CssEditorProps, CssEditorState> {
  static defaultProps: Partial<CssEditorProps> = {
    initialCss: '',
    onChange: () => {},
  };

  constructor(props: CssEditorProps) {
    super(props);
    this.state = {
      css: props.initialCss,
    };
    this.changeCss = this.changeCss.bind(this);
    this.changeCssTemplate = this.changeCssTemplate.bind(this);
  }

  componentDidMount() {
    AceCssEditor.preload();
    const query = rison.encode({ columns: ['template_name', 'css'] });
    SupersetClient.get({ endpoint: `/api/v1/css_template/?q=${query}` })
      .then(({ json }) => {
        const templates = json.result.map(
          (row: { template_name: string; css: string }) => ({
            value: row.template_name,
            css: row.css,
            label: row.template_name,
          }),
        );

        this.setState({ templates });
      })
      .catch(() => {
        this.props.addDangerToast(
          t('An error occurred while fetching available CSS templates'),
        );
      });
  }

  changeCss(css: string) {
    this.setState({ css }, () => {
      this.props.onChange(css);
    });
  }

  changeCssTemplate(info: { key: Key }) {
    const selectedTemplate = this.state.templates?.find(
      template => template.label === info.key,
    );
    if (selectedTemplate) {
      this.changeCss(selectedTemplate.css);
    }
  }

  renderTemplateSelector() {
    if (this.state.templates) {
      const menu = (
        <Menu
          onClick={this.changeCssTemplate}
          items={this.state.templates.map(template => ({
            key: template.label,
            label: template.label,
          }))}
        />
      );
      return (
        <Dropdown popupRender={() => menu} placement="bottomRight">
          <Button>{t('Load a CSS template')}</Button>
        </Dropdown>
      );
    }
    return null;
  }

  render() {
    return (
      <ModalTrigger
        triggerNode={this.props.triggerNode}
        modalTitle={t('CSS')}
        modalBody={
          <StyledWrapper>
            <div className="css-editor-header">
              <h5>{t('Live CSS editor')}</h5>
              {this.renderTemplateSelector()}
            </div>
            <AceCssEditor
              className="css-editor"
              minLines={12}
              maxLines={30}
              onChange={this.changeCss}
              height="200px"
              width="100%"
              editorProps={{ $blockScrolling: true }}
              enableLiveAutocompletion
              value={this.state.css || ''}
            />
          </StyledWrapper>
        }
      />
    );
  }
}

export default CssEditor;
