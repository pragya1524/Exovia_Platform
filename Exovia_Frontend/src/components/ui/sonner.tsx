import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            // Chocolate brown gradient and light text, themed border and shadow
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-[#6D4C41] group-[.toaster]:via-[#5D4037] group-[.toaster]:to-[#4E342E] group-[.toaster]:text-[#FFFDF8] group-[.toaster]:border-[#BCAAA4] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#FFE2B2]",
          actionButton:
            "group-[.toast]:bg-[#5D4037] group-[.toast]:text-[#FFFDF8] group-[.toast]:hover:bg-[#4E342E]",
          cancelButton:
            "group-[.toast]:bg-[#EAD9C1] group-[.toast]:text-[#5D4037]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
