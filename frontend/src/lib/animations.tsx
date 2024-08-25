import { useSpring, useTransition } from '@react-spring/web'

export const InsertAnimation = (data: any) => {
  return useTransition(data, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 } ,
    delay: 200

  })
}

export const useFadeIn = () =>
  useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 }
  })
