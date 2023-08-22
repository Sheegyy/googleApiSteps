
interface Props {
  steps: number;
}

const StepInput = ({ steps }: Props) => {
  return (
    <div>
      <a> {steps} </a>
    </div>
  );
};

export default StepInput;