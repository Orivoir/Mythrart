import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type UnderlineOptions = {
  position?: "start" | "center" | "end";
  offset?: {
    left?: number;
    right?: number
  };
  width?: number;
  gap?: number;
  color?: string;
  stroke?: number;
};

type WithUnderlineProps = {
  underline?: UnderlineOptions;
};

const defaultUnderline: Required<UnderlineOptions> = {
  position: "center",
  width: 2,
  gap: 1.5,
  color: "currentColor",
  stroke: .5,
  offset: {
    left: 0,
    right: 0
  }
};

export function withUnderline<P extends object>(
  Component: ComponentType<P>,
) {
  return function UnderlinedComponent({
    underline,
    ...props
  }: P & WithUnderlineProps) {

    if(!underline) {
      return (
        <Component {...(props as P)} />
      )
    }

    const options = {
      ...defaultUnderline,
      ...underline,
    };

    return (
      <div
        className={cn(
          "flex flex-col",
          {
            "items-start": options.position === "start",
            "items-center": options.position === "center",
            "items-end": options.position === "end",
          },
        )}
      >
        <Component {...(props as P)} />

        <span
          aria-hidden="true"
          className="block"
          style={{
            marginLeft: `${options.offset.left}rem`,
            marginRight: `${options.offset.right}rem`,
            width: `${options.width}rem`,
            height: `${options.stroke}px`,
            marginTop: `${options.gap}rem`,
            backgroundColor: options.color,
          }}
        />
      </div>
    );
  };
}