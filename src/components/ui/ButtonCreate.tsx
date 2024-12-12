import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";
import { Button, ButtonProps } from "./button";

interface ButtonCreateProps extends ButtonProps {
  className?: string;
  children: ReactNode;
}

export const ButtonCreate = forwardRef<HTMLButtonElement, ButtonCreateProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        className={cn(
          " border-black border-2 bg-white text-black rounded-none  font-bebas hover:bg-black hover:text-white",
          className
        )}>
        {children}
      </Button>
    );
  }
);

// Important: Set display name for dev tools
ButtonCreate.displayName = "ButtonCreate";
