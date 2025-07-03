import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Re-export ApiResult from utils
export * from "../utils/ApiResult";

// Re-export magnet utilities
export * from "../utils/magnetGenerator";
