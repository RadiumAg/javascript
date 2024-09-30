import React from 'react';
import OnBoarding from './component/onboarding';
import { Button, Flex } from 'antd';

function App() {
  const [buttonGroup, setButtonGroup] = React.useState<HTMLElement | null>(
    null
  );
  const [buttonGroup2, setbuttonGroup2] = React.useState<HTMLElement | null>(
    null
  );
  const [buttonGroup3, setbuttonGroup3] = React.useState<HTMLElement | null>(
    null
  );

  return (
    <div className="App">
      <Flex gap="small" wrap="wrap" id="btn-group1" ref={setButtonGroup}>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Flex>

      <div style={{ height: '1000px' }}></div>

      <Flex wrap="wrap" gap="small">
        <Button type="primary" danger ref={setbuttonGroup2}>
          Primary
        </Button>
        <Button danger>Default</Button>
        <Button type="dashed" danger id="btn-group2">
          Dashed
        </Button>
        <Button type="text" danger>
          Text
        </Button>
        <Button type="link" danger>
          Link
        </Button>
      </Flex>

      <div style={{ height: '500px' }}></div>

      <Flex wrap="wrap" gap="small">
        <Button type="primary" ghost ref={setbuttonGroup3}>
          Primary
        </Button>
        <Button ghost>Default</Button>
        <Button type="dashed" ghost>
          Dashed
        </Button>
        <Button type="primary" danger ghost id="btn-group3">
          Danger
        </Button>
      </Flex>

      <OnBoarding
        steps={[
          {
            selector: () => {
              return buttonGroup;
            },
            renderContent: () => {
              return '神说要有光';
            },
            placement: 'bottom',
          },
          {
            selector: () => {
              return buttonGroup2;
            },
            renderContent: () => {
              return '于是就有了光';
            },
            placement: 'bottom',
          },
          {
            selector: () => {
              return buttonGroup3;
            },
            renderContent: () => {
              return '你相信光么';
            },
            placement: 'bottom',
          },
        ]}
      />
    </div>
  );
}

export default App;
