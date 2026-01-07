export type ProductItem = { name: string; image?: string; url?: string };

export function ProductListSchema({ products }: { products: ProductItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        image: p.image,
        url: p.url || "https://vulpinehomes.com/products",
        brand: {
          "@type": "Brand",
          name: "Vulpine Homes"
        }
      }
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
