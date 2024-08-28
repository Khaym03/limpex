export const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.03 * i
    }
  })
}
