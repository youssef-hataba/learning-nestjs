'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { fetchProductById, fetchProducts, addProductReview } from '@/features/products/api';
import { Product } from '@/features/products/types';
import { notify } from '@/lib/notifications';
import ProductBreadcrumbs from '@/components/product/ProductBreadcrumbs';
import ProductImageStage from '@/components/product/ProductImageStage';
import ProductBuyBox from '@/components/product/ProductBuyBox';
import ProductExperience from '@/components/product/ProductExperience';
import ProductReviewsSection from '@/components/product/ProductReviewsSection';
import ProductReviewModal from '@/components/product/ProductReviewModal';
import RelatedPlants from '@/components/product/RelatedPlants';

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedPlanter, setSelectedPlanter] = useState<'alabaster' | 'slate' | 'terracotta'>('alabaster');

  // Review submission modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prod, allProds] = await Promise.all([
          fetchProductById(params.id),
          fetchProducts({ limit: 8 }),
        ]);

        setProduct(prod);

        // Curate related companion plants directly from backend
        if (allProds && Array.isArray(allProds)) {
          const others = allProds.filter((p) => p.id !== params.id).slice(0, 3);
          setRelatedProducts(others);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    notify.success(
      `${quantity}x ${product.title} (${selectedPlanter.toUpperCase()} Pot) added to your bag.`,
      'Added to Botanical Sanctuary'
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    notify.info(
      `Preparing express climate-controlled delivery for ${product.title}...`,
      'Proceeding to Checkout'
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      await addProductReview(product.id, newRating, newComment.trim());
      notify.success('Thank you for sharing your botanical experience!', 'Review Published');
      setShowReviewModal(false);
      setNewComment('');
      // Refresh current product reviews from backend
      const updated = await fetchProductById(product.id);
      if (updated) setProduct(updated);
    } catch (err: any) {
      notify.error(err.message || 'Please log in to submit a review.', 'Review Submission Failed');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex flex-col items-center justify-center text-[var(--accent-lime)]">
        <div className="w-12 h-12 border-3 border-current border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading living botanical specimen...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-36 px-4 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          🪴
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-main)] mb-3">Botanical Specimen Not Found</h2>
        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
          The requested plant is currently unavailable in our live nursery inventory or has completed its seasonal cycle.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-[var(--accent-lime)] text-[var(--on-primary)] font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-md"
        >
          Return to Nursery Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-28 overflow-hidden">
      {/* Ambient Lighting Spheres */}
      <div className="absolute top-20 left-10 w-[36rem] h-[36rem] bg-[var(--accent-lime)]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[30rem] h-[30rem] bg-[var(--accent-lime)]/5 rounded-full blur-[170px] pointer-events-none" />

      <ProductBreadcrumbs product={product} />

      {/* Main Showcase & Purchase Suite (2-Column Asymmetrical Grid) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <ProductImageStage product={product} />
          </div>
          <div className="lg:col-span-5">
            <ProductBuyBox
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              selectedPlanter={selectedPlanter}
              onSelectPlanter={setSelectedPlanter}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </section>

      {/* Living Experience & Care Ritual (Engaging Lifestyle Guide) */}
      <ProductExperience product={product} />

      {/* Verified Customer Feedback Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <ProductReviewsSection
          product={product}
          onOpenReviewModal={() => setShowReviewModal(true)}
        />
      </section>

      {/* Sanctuary Pairings (Related Plants) */}
      <RelatedPlants relatedProducts={relatedProducts} />

      {/* Review Submission Modal Dialog */}
      <ProductReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productTitle={product.title}
        rating={newRating}
        onRatingChange={setNewRating}
        comment={newComment}
        onCommentChange={setNewComment}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
}
