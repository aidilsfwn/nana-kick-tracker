import { Button } from "./ui";

export const LogButton = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => {
  return (
    <Button
      disabled={loading}
      onClick={onClick}
      className="rounded-full w-36 h-36 bg-white hover:bg-neutral-100 shadow-md"
    >
      <img src="/src/assets/logo.svg" alt="Loading" className="w-24 h-24 " />
    </Button>
  );
};
