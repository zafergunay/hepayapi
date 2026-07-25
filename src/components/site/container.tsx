import { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  className = "",
  ...props
}: ContainerProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (as || "div") as any;
  return (
    <Component
      className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14 ${className}`}
      {...props}
    />
  );
}
