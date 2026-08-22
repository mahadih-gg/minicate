"use client"

import { useSyncExternalStore } from "react"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { UserAvatar } from "@/components/common/UserAvatar"
import { LANDING_REVIEWS } from "@/components/features/landing/hero"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import "swiper/css"
import "swiper/css/pagination"

function subscribeReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot() {
  return true
}

export function ReviewSlider() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )

  return (
    <Swiper
      className="review-swiper w-full pb-12"
      modules={[Autoplay, Pagination]}
      pagination={{ clickable: true }}
      autoplay={
        prefersReducedMotion
          ? false
          : {
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
      }
      speed={prefersReducedMotion ? 0 : 400}
      autoHeight={false}
      loop
      spaceBetween={16}
      aria-label="What people say about Minicate"
    >
      {LANDING_REVIEWS.map((review) => (
        <SwiperSlide key={review.name}>
          <Card className="sketch-frame h-full">
            <CardHeader>
              <span
                aria-hidden
                className="font-heading text-5xl leading-none text-brand-violet"
              >
                “
              </span>
            </CardHeader>
            <CardContent className="flex-1">
              <blockquote className="font-hand text-lg leading-snug text-foreground">
                {review.quote}
              </blockquote>
            </CardContent>
            <CardFooter className="mt-auto gap-3">
              <UserAvatar seed={review.name} label={review.name} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{review.name}</p>
                <p className="truncate font-hand text-sm text-muted-foreground">
                  {review.role}
                </p>
              </div>
            </CardFooter>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
