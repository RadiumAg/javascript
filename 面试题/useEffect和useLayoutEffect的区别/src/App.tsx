import ButtonWithTooltip from './components/ButtonWithTooltip';

function App() {
  return (
    <>
      <ButtonWithTooltip tooltipContent="1">1</ButtonWithTooltip>
      <ButtonWithTooltip tooltipContent="This is a tooltip above the button">
        Hover me!
      </ButtonWithTooltip>
    </>
  );
}

export default App;
