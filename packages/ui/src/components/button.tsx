import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-body font-bold text-[12px] uppercase tracking-[0.12em] ring-offset-background transition-colors duration-fast ease-lex-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lex-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-lex-gold text-lex-navy hover:bg-lex-gold-light",
        destructive: "bg-lex-error text-white hover:bg-lex-error/90",
        outline: "border border-lex-navy/20 bg-transparent text-lex-navy hover:bg-lex-navy/5",
        outlineGold: "border border-lex-gold bg-transparent text-lex-gold hover:bg-lex-gold/10",
        secondary: "bg-lex-navy text-lex-smoke hover:bg-lex-steel",
        ghost: "bg-transparent text-lex-smoke border border-lex-smoke/30 hover:bg-lex-smoke/10",
        link: "text-lex-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[48px]",
        sm: "h-9 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, cn }
