import { useState } from "react";
import { postPoint } from "../api/post-points";

export default function usePostPoint() {
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(null);

    const submitPoints = async (payload, token) => {
        setIsPosting(true);
        setPostError(null);
        try {
            return await postPoint(payload, token);
        } catch (error) {
            setPostError(error);
            throw error;
        } finally {
            setIsPosting(false);
        }
    };

    return { submitPoints, isPosting, postError };
}
