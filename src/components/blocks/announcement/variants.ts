import { cva, type VariantProps } from "class-variance-authority"

/** Announcement banner colour scheme. All pairs are theme tokens. */
export const announcementVariants = cva("block w-full text-sm", {
  variants: {
    tone: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      muted: "border-b bg-muted text-foreground",
      // Warnings / closures: a tinted band with a destructive accent. Text
      // stays on `foreground` so contrast holds in every theme and mode.
      destructive:
        "border-y border-destructive/40 bg-destructive/10 text-foreground **:data-[slot=announcement-icon]:text-destructive",
    },
  },
  defaultVariants: {
    tone: "primary",
  },
})

export type AnnouncementVariants = VariantProps<typeof announcementVariants>
