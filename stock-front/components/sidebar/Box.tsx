import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
    rounded-lg
    h-fit
    w-full
    bg-slate-100
    `,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Box;
