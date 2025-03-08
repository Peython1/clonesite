
import { SVGProps } from 'react';

export function FontIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18V6" />
      <path d="M20 6v12" />
      <path d="M12 6v12" />
      <path d="M12 12h8" />
      <path d="M4 12h8" />
    </svg>
  );
}

export default FontIcon;
