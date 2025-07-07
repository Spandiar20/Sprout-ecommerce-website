import { CheckCircle } from "lucide-react";


export const FormSuccess = ({ message } : { message?: string }) => {
    if (!message) return null;

    return (
        <div className="bg-teal-400/25 flex items-center gap-2 text-sm text-secondary-foreground p-3 rounded-md">
            <CheckCircle className="w-4 h-4"></CheckCircle>
            <p>{message}</p>
        </div>
    )
}