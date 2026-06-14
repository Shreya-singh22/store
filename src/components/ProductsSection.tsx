import ProductCard from './ProductCard';
import type { NormalizedProduct } from '@/lib/products';
import './ProductsSection.css';

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  products: NormalizedProduct[];
  className?: string;
}

export default function ProductsSection({ title, subtitle, products, className = '' }: ProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`products-section animate-slide-up ${className}`}>
      <div className="products-section__header">
        <h2 className="products-section__title">{title}</h2>
        {subtitle && <p className="products-section__subtitle">{subtitle}</p>}
        <div className="products-section__divider" />
      </div>
      <div className="products-section__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
