'use client';

import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

interface LinkButtonProps extends ButtonProps {
  href: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className="flex justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
      {...props}
    />
  );
}

export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button
      onClick={() => window.open(href, "_blank")}
      {...props}
    >
      {children}
    </Button>
  );
}