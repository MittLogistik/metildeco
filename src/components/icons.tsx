import type { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & { size?: number };

const S = ({ size = 20, children, ...p }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);

export const CartIcon = (p: Props) => (
  <S {...p}>
    <path d="M6 7h13l-1.4 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.6L5.3 4.5A1 1 0 0 0 4.3 3.7H3" />
    <circle cx="9.5" cy="20.5" r="1" />
    <circle cx="16" cy="20.5" r="1" />
  </S>
);
export const MenuIcon = (p: Props) => (
  <S {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </S>
);
export const CloseIcon = (p: Props) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);
export const ChevronDown = (p: Props) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
);
export const ChevronRight = (p: Props) => (
  <S {...p}>
    <path d="m9 6 6 6-6 6" />
  </S>
);
export const ArrowRight = (p: Props) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);
export const CheckIcon = (p: Props) => (
  <S {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </S>
);
export const PlusIcon = (p: Props) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const MinusIcon = (p: Props) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);
export const TruckIcon = (p: Props) => (
  <S {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </S>
);
export const ShieldIcon = (p: Props) => (
  <S {...p}>
    <path d="M12 3 5 6v5c0 4.5 3 8.2 7 9.5 4-1.3 7-5 7-9.5V6z" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </S>
);
export const LeafIcon = (p: Props) => (
  <S {...p}>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
    <path d="M5 19c3-4 6-7 10-9" />
  </S>
);
export const FlaskIcon = (p: Props) => (
  <S {...p}>
    <path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M7.5 15h9" />
  </S>
);
export const RefreshIcon = (p: Props) => (
  <S {...p}>
    <path d="M20 12a8 8 0 0 1-14.5 4.6M4 12a8 8 0 0 1 14.5-4.6" />
    <path d="M19 3v5h-5M5 21v-5h5" />
  </S>
);
export const MailIcon = (p: Props) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </S>
);
export const PhoneIcon = (p: Props) => (
  <S {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </S>
);
export const PinIcon = (p: Props) => (
  <S {...p}>
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </S>
);
export const StarIcon = ({ size = 16, filled = true, ...p }: Props & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      d="M12 2.8l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4L2.7 9.5l6.5-.7z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
export const PlayIcon = (p: Props) => (
  <S {...p}>
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </S>
);
export const BoxIcon = (p: Props) => (
  <S {...p}>
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </S>
);
export const LockIcon = (p: Props) => (
  <S {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </S>
);
