import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Header from './header';
import EditorArea from './edit-area';
import Setting from './components/setting';
import MaterialWrapper from './components/material-wrapper';

const LowcodeEditor: React.FC = () => {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-[60]px flex items-center border-b-[1px] border-[#000]">
        <Header></Header>
      </div>

      <Allotment>
        <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
          <MaterialWrapper />
        </Allotment.Pane>

        <Allotment.Pane>
          <EditorArea />
        </Allotment.Pane>

        <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
          <Setting />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default LowcodeEditor;
