'use client'
import {motion} from "framer-motion"
import { ReviewsWithUser } from "@/lib/infer-type"
import { Card } from "../ui/card"
import Image from "next/image"
import {formatDistance, subDays} from "date-fns"
import Stars from "./starts"

export default function Review({reviews}: {reviews: ReviewsWithUser[]}) {
    return (
        <motion.div className="flex flex-col gap-4">
            {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                    <div className="flex gap-2 items-center">
                        <Image className="rounded-full" width={32} height={32} alt={review.user.name!} src={review.user?.image!}></Image>
                        <div>
                            <p className="text-xs font-bold">{review.user.name}</p>
                            <div className="flex gap-2 items-center">
                                <Stars rating={review.rating} />
                                <p className="text-xs text-bold text-muted-background">{formatDistance(subDays(review.created!, 0), new Date())}</p>
                            </div>
                        </div>
                    </div>
                    <p className="py-2 font-medium">{review.comment}</p>
                </Card>
            ))}
        </motion.div>
    )
}