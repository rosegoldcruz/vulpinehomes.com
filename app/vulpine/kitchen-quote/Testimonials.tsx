import React from "react";
import { FadeIn, StaggerContainer, ScaleOnHover } from "@/app/components/ui/Motion";

const testimonials = [
    {
        id: 1,
        name: "Sarah M.",
        location: "Scottsdale, AZ",
        rating: 5,
        text: "I can't believe this is the same kitchen! The team was professional, fast, and the quality is incredible. Saved us over $15k compared to other quotes.",
        image: "/before-after/kitchen 1 after.jpg",
    },
    {
        id: 2,
        name: "James & Linda T.",
        location: "Gilbert, AZ",
        rating: 5,
        text: "We were skeptical about refacing, but Vulpine proved us wrong. The new doors look and feel like solid wood custom cabinets. Highly recommend!",
        image: "/before-after/Howe & Taylor after.jpeg",
    },
    {
        id: 3,
        name: "Robert K.",
        location: "Phoenix, AZ",
        rating: 5,
        text: "Zero mess, done in 4 days. The technician was meticulous. My wife loves her 'new' kitchen.",
        image: "/before-after/Two-tone After.jpg",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <FadeIn className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        What Our Clients Say
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-orange-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                        <span className="text-white font-medium ml-2 text-lg">5.0 Average Rating</span>
                    </div>
                </FadeIn>

                <StaggerContainer className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <ScaleOnHover
                            key={testimonial.id}
                            className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-500 flex flex-col h-full"
                        >
                            <div className="flex items-center gap-1 text-orange-400 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow italic">
                                "{testimonial.text}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xl font-bold text-white">
                                    {testimonial.name[0]}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </ScaleOnHover>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
