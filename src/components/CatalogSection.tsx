"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { catalog } from "@/lib/content";
import { brandGradients } from "@/lib/brandGradients";
import {
  blurReveal,
  scaleBlurIn,
  staggerSlow,
  defaultViewport,
} from "@/lib/motion";
import { CTAButton } from "./CTAButton";

const productCardGradients = [
  brandGradients.tealDeep,
  brandGradients.slateDeep,
  brandGradients.pacificDeep,
  brandGradients.peachPurple,
  brandGradients.pinkPeriwinkle,
] as const;

export function CatalogSection() {
  return (
    <section
      id={catalog.id}
      data-nav-theme="dark"
      className="edge-blend relative isolate section-y section-y-tight-bottom"
      style={{ background: brandGradients.slateDeep }}
    >
      <div className="relative z-[3] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerSlow}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p variants={blurReveal} className="type-mono-label text-white/55">
              {catalog.eyebrow}
            </motion.p>

            <motion.h2
              variants={blurReveal}
              className="type-editorial-40 mt-4 max-w-2xl text-balance text-white"
            >
              {catalog.heading.before}
              {catalog.heading.emphasis}
              {catalog.heading.after}
            </motion.h2>
          </div>

          <motion.div variants={blurReveal} className="shrink-0">
            <CTAButton variant="glass" className="w-full sm:w-auto">
              {catalog.storeCta}
            </CTAButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerSlow}
          className="catalog-scroll mt-10 flex gap-4 overflow-x-auto pb-2 sm:mt-12 sm:gap-5 lg:gap-6"
        >
          {catalog.products.map((product, index) => (
            <motion.article
              key={product.name}
              variants={scaleBlurIn}
              className="catalog-product-card glass glass-hover group w-[min(74vw,240px)] shrink-0 rounded-2xl p-3 sm:w-[260px] sm:rounded-[1.25rem] lg:w-[280px]"
            >
              <div
                className="grid aspect-[3/4] place-items-center overflow-hidden rounded-xl sm:rounded-2xl"
                style={{
                  background:
                    productCardGradients[index % productCardGradients.length],
                }}
              >
                <div className="relative aspect-[3/5] h-[76%] w-[76%]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="280px"
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
              </div>

              <div className="px-2 pb-1 pt-4 sm:px-3 sm:pt-5">
                <h3 className="type-h3 text-white">{product.name}</h3>
                <p className="type-mono-label mt-1.5 text-white/45">{product.spec}</p>

                <dl className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="type-mono-label text-white/40">Purity (HPLC)</dt>
                    <dd className="type-mono-data text-aqua-200">{product.purity}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="type-mono-label text-white/40">Mol. weight</dt>
                    <dd className="type-mono-data text-white/70">{product.mw}</dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={blurReveal}
          className="type-mono-label mt-8 text-white/35"
        >
          {catalog.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}
