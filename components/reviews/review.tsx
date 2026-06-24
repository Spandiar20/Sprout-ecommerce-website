import ReviewsForm from "./reviews-form";

export default async function Reviews({ productID }: {productID: number}) {
    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
            <div>
                <ReviewsForm/>
            </div>
        </section>
    )
}