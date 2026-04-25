// hooks/usePaginatedReviews.ts
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { ReviewWithAlbum } from "@/lib/types";

interface UsePaginatedReviewsOptions {
    endpoint: string;
    data?: any;
}

export function usePaginatedReviews({ endpoint, data }: UsePaginatedReviewsOptions) {
    const [reviews, setReviews] = useState<ReviewWithAlbum[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const isFetching = useRef(false);
    const initialLoadDone = useRef(false);
    const loadingInitialRef = useRef(true);
    const loadingMoreRef = useRef(false);
    const onEndReachedCalledDuringMomentum = useRef(true);
    const hasMoreRef = useRef(true);
    const nextPageRef = useRef(1);
    const requestedPagesRef = useRef(new Set<number>());
    const loadedIdsRef = useRef(new Set<ReviewWithAlbum["id"]>());
    const mountedRef = useRef(true);

    const updateHasMore = (value: boolean) => {
        hasMoreRef.current = value;
        setHasMore(value);
    };

    useEffect(() => {
        // reseta tudo ao trocar de endpoint
        isFetching.current = false;
        initialLoadDone.current = false;
        loadingInitialRef.current = true;
        loadingMoreRef.current = false;
        onEndReachedCalledDuringMomentum.current = true;
        hasMoreRef.current = true;
        nextPageRef.current = 1;
        requestedPagesRef.current = new Set();
        loadedIdsRef.current = new Set();
        mountedRef.current = true;

        void fetchPage(1, true);
        return () => {
            mountedRef.current = false;
        };
    }, [endpoint, data]);

    const fetchPage = async (pageNumber: number, replace = false) => {
        if (isFetching.current) return;
        if (!replace && !hasMoreRef.current) return;
        if (!replace && requestedPagesRef.current.has(pageNumber)) return;

        requestedPagesRef.current.add(pageNumber);
        isFetching.current = true;

        if (replace) {
            loadingInitialRef.current = true;
            setLoadingInitial(true);
        } else {
            loadingMoreRef.current = true;
            setLoadingMore(true);
        }

        try {
            const response = await api.get(`${endpoint}?p=${pageNumber}`);
            const payload = response.data;
            const incomingReviews: ReviewWithAlbum[] = Array.isArray(
                payload?.reviews,
            )
                ? payload.reviews
                : Array.isArray(payload)
                  ? payload
                  : [];

            if (!mountedRef.current) return;

            if (replace) {
                loadedIdsRef.current.clear();
                requestedPagesRef.current.clear();
                requestedPagesRef.current.add(1);
                updateHasMore(true);
            }

            const uniqueReviews: ReviewWithAlbum[] = [];
            for (const review of incomingReviews) {
                if (!loadedIdsRef.current.has(review.id)) {
                    loadedIdsRef.current.add(review.id);
                    uniqueReviews.push(review);
                }
            }

            if (replace) setReviews(uniqueReviews);
            else if (uniqueReviews.length > 0) {
                setReviews((prev) => [...prev, ...uniqueReviews]);
            }

            if (
                incomingReviews.length === 0 ||
                (!replace && uniqueReviews.length === 0)
            ) {
                updateHasMore(false);
                return;
            }
            if (payload.total_pages && pageNumber >= payload.total_pages) {
                updateHasMore(false);
                return;
            }

            nextPageRef.current = payload.next;
        } catch (error) {
            requestedPagesRef.current.delete(pageNumber);
            console.error("Error fetching reviews:", error);
        } finally {
            // reseta refs ANTES de verificar mountedRef
            isFetching.current = false;
            loadingInitialRef.current = false;
            loadingMoreRef.current = false;
            if (replace) initialLoadDone.current = true;

            if (!mountedRef.current) return;
            setLoadingInitial(false);
            setLoadingMore(false);
        }
    };

    // Para Animated.FlatList — com trava de momentum
    const loadMore = () => {
        if (!initialLoadDone.current) return;
        if (onEndReachedCalledDuringMomentum.current) return;
        if (
            !hasMoreRef.current ||
            loadingInitialRef.current ||
            loadingMoreRef.current ||
            isFetching.current
        )
            return;
        onEndReachedCalledDuringMomentum.current = true;
        void fetchPage(nextPageRef.current);
    };

    const reload = async  () => {
        // reseta tudo
        isFetching.current = false;
        initialLoadDone.current = false;
        loadingInitialRef.current = true;
        loadingMoreRef.current = false;
        onEndReachedCalledDuringMomentum.current = true;
        hasMoreRef.current = true;
        nextPageRef.current = 1;
        requestedPagesRef.current = new Set();
        loadedIdsRef.current = new Set();
        await fetchPage(1, true);
    }

    // Para Tabs.FlatList — sem trava de momentum
    const loadMoreForTabs = () => {
        console.log(nextPageRef.current);
        if (!initialLoadDone.current) return;
        if (!nextPageRef.current) return;
        if (
            !hasMoreRef.current ||
            loadingInitialRef.current ||
            loadingMoreRef.current ||
            isFetching.current
        )
            return;
        void fetchPage(nextPageRef.current);
    };

    const onMomentumScrollBegin = () => {
        onEndReachedCalledDuringMomentum.current = false;
    };

    return {
        reviews,
        loadingInitial,
        loadingMore,
        hasMore,
        reload,
        loadMore,
        loadMoreForTabs,
        onMomentumScrollBegin,
    };
}
