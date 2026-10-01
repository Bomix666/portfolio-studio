// Loaded asynchronously by <LazyMotion> — keeps Motion's animation engine out of the initial bundle.
// domMax (vs domAnimation) because the nav and specimen use shared-layout (`layoutId`) transitions.
export { domMax as default } from "motion/react";
