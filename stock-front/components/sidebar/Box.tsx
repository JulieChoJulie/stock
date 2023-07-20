import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  active: boolean;
}

const Box: React.FC<BoxProps> = ({ children, className, active }) => {
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
        active && "bg-slate-300",
      )}
    >
      {children}
    </div>
  );
};

export default Box;
