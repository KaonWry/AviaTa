import * as React from "react"
import { cn } from "../../lib/utils"
import { Search, GitCompare, CreditCard } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./carousel"

const iconMap = {
  search: Search,
  compare: GitCompare,
  payment: CreditCard,
}

const TestimonialCarousel = React.forwardRef(
  ({ className, testimonials, ...props }, ref) => {
    const [api, setApi] = React.useState()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
      if (!api) return
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap())
      })
    }, [api])

    return (
      <div
        ref={ref}
        className={cn("py-16 select-none", className)}
        style={{ WebkitUserSelect: 'none', userSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
        draggable={false}
        {...props}
      >
        <Carousel
          setApi={setApi}
          className="max-w-screen-xl mx-auto px-4 lg:px-8"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const IconComponent = iconMap[testimonial.icon] || Search
              return (
                <CarouselItem
                  key={testimonial.name}
                  className="flex flex-col items-center cursor-grab select-none"
                  style={{ WebkitUserSelect: 'none', userSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                  draggable={false}
                >
                  {/* Icon instead of company logo */}
                  <div className="mb-7 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Quote/Review */}
                  <p className="max-w-xl text-balance text-center text-xl sm:text-2xl text-foreground italic">
                    "{testimonial.review}"
                  </p>
                  
                  {/* Name */}
                  <h5 className="mt-5 font-semibold text-foreground">
                    {testimonial.name}
                  </h5>
                  
                  {/* Role */}
                  <h5 className="mt-1.5 font-medium text-muted-foreground">
                    {testimonial.role}
                  </h5>
                  
                  {/* Avatar */}
                  <div className="mt-5 relative size-24 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        {/* Pagination dots */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  index === current 
                    ? "bg-primary w-6" 
                    : "bg-primary/35 hover:bg-primary/50"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

TestimonialCarousel.displayName = "TestimonialCarousel"

// Pre-configured About Us section with AviaTa team testimonials
function AboutUsSection({ className }) {
  const testimonials = [
    {
      icon: "search",
      avatar: "https://i.pinimg.com/736x/f9/bd/76/f9bd7649862359ba3e7d45c4f17e9302.jpg",
      name: "Yoga",
      role: "Tim AviaTa",
      review: "AviaTa fokus membantu kamu mencari tiket pesawat dengan cepat.",
    },
    {
      icon: "compare",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      name: "Gideon",
      role: "Tim AviaTa",
      review: "AviaTa membantu kamu mengelola tiket dan memantau perjalanan dalam satu tempat.",
    },
    {
      icon: "payment",
      avatar: "https://pbs.twimg.com/media/GukOAG8XUAErZf-?format=jpg&name=medium",
      name: "Pras",
      role: "Tim AviaTa",
      review: "AviaTa memastikan proses pilih penerbangan sampai pembayaran tetap simpel.",
    },
  ]

  return (
    <section className={cn("bg-secondary/50 dark:bg-muted/30 rounded-2xl", className)}>
      <div className="text-center pt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Tentang Kami
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Kenali tim di balik AviaTa yang berkomitmen memberikan pengalaman booking tiket terbaik
        </p>
      </div>
      <TestimonialCarousel testimonials={testimonials} />
    </section>
  )
}

export { TestimonialCarousel, AboutUsSection }
