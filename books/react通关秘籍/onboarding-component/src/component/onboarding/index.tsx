import React from 'react';
import { TooltipPlacement } from 'antd/es/tooltip';
import { Button, Popover } from 'antd';
import { createPortal } from 'react-dom';
import Mask from '../mask';
import './index.scss';

export interface OnBoardingStepConfig {
  selector: () => HTMLElement | null;
  placement?: TooltipPlacement;
  renderContent?: (currentStep: number) => React.ReactNode;
  beforeBack?: (currentStep: number) => void;
  beforeForward?: (currentStep: number) => void;
}

export interface OnBoardingProps {
  step?: number;
  steps: OnBoardingStepConfig[];
  getContainer?: () => HTMLElement;
  onStepsEnd?: () => void;
}

const OnBoarding: React.FC<OnBoardingProps> = (props) => {
  const { step = 0, steps, getContainer, onStepsEnd } = props;
  const [currentStep, setCurrentStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const currentSelectedElement = steps[currentStep]?.selector();
  const currentContainerElement = getContainer?.() || document.documentElement;

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    if (currentStep === 0) {
      return;
    }

    const { beforeBack } = getCurrentStep();
    await beforeBack?.(currentStep - 1);
    setCurrentStep(currentStep - 1);
  };

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await onStepsEnd?.();
      setDone(true);
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  React.useEffect(() => {
    setCurrentStep(step!);
  }, [step]);

  const renderPopover = (wrapper: React.ReactNode) => {
    const config = getCurrentStep();

    if (!config) {
      return wrapper;
    }

    const { renderContent } = config;
    const content = renderContent ? renderContent(currentStep) : null;

    const operation = (
      <div className="onboarding-operation">
        {currentStep !== 0 && (
          <Button className="back" onClick={back}>
            上一步
          </Button>
        )}
        <Button className="forward" type="primary" onClick={forward}>
          {currentStep === steps.length - 1 ? '我知道了' : '下一步'}
        </Button>
      </div>
    );

    return (
      <Popover
        content={
          <div>
            {content}
            {operation}
          </div>
        }
        open={true}
        placement={getCurrentStep()?.placement}
      >
        {wrapper}
      </Popover>
    );
  };

  const [, setRenderTick] = React.useState(0);

  React.useEffect(() => {
    setRenderTick(1);
  }, []);

  console.log(!currentSelectedElement);

  if (!currentSelectedElement || done) {
    return null;
  }

  const mask = (
    <Mask
      element={currentSelectedElement}
      container={currentContainerElement}
      renderMaskContent={(wrapper) => renderPopover(wrapper)}
    />
  );

  return createPortal(mask, currentContainerElement);
};

export default OnBoarding;
