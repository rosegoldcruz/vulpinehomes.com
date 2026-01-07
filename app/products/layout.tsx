import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Cabinet Doors & Hardware Phoenix | Custom Styles & Colors",
  description:
    "Explore our collection of custom cabinet doors, colors, and hardware. Made to order for your Phoenix kitchen renovation. Shaker, Slab, and more.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
