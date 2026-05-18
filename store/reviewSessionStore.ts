// store/reviewSessionStore.ts
import { create } from "zustand";
import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({ id: "review-drafts" });

export type TrackRatingEntry = {
    id: string;
    value: number;
    favorite: boolean;
    comment: string;
    skip: boolean;
};

export type ReviewDraft = {
    albumId: string;
    ratings: Record<string, TrackRatingEntry>;
    overallRating: number;
    useMedia: boolean;
    reviewText: string;
    savedAt: number;
};

let commentPersistTimer: ReturnType<typeof setTimeout> | null = null;

const debouncedPersist = (persistFn: () => void) => {
    if (commentPersistTimer) clearTimeout(commentPersistTimer);
    commentPersistTimer = setTimeout(() => {
        persistFn();
    }, 600);
};

// helpers de storage por albumId
export const DraftStorage = {
    key: (albumId: string) => `draft_${albumId}`,

    load: (albumId: string): ReviewDraft | null => {
        const raw = mmkv.getString(DraftStorage.key(albumId));
        return raw ? JSON.parse(raw) : null;
    },

    save: (draft: ReviewDraft) => {
        mmkv.set(
            DraftStorage.key(draft.albumId),
            JSON.stringify({
                ...draft,
                savedAt: Date.now(),
            }),
        );
    },

    remove: (albumId: string) => {
        mmkv.remove(DraftStorage.key(albumId));
    },

    listAll: (): ReviewDraft[] => {
        const keys = mmkv.getAllKeys().filter((k) => k.startsWith("draft_"));
        return keys
            .map((k) => {
                const raw = mmkv.getString(k);
                return raw ? (JSON.parse(raw) as ReviewDraft) : null;
            })
            .filter(Boolean) as ReviewDraft[];
    },
};

type ReviewSessionState = {
    albumId: string | null;
    ratings: Record<string, TrackRatingEntry>;
    overallRating: number;
    useMedia: boolean;
    reviewText: string;

    initSession: (albumId: string, initialRatings: TrackRatingEntry[]) => void;
    setTrackRating: (trackId: string, value: number) => void;
    setOverallRating: (value: number) => void;
    setUseMedia: (value: boolean) => void;
    setReviewText: (value: string) => void;
    setTrackSkip: (trackId: string, skip: boolean) => void;
    setTrackComment: (trackId: string, comment: string) => void;
    getRatingsArray: () => TrackRatingEntry[];
    persistDraft: () => void;
    clearSession: (albumId: string) => void;
};

export const useReviewSession = create<ReviewSessionState>()((set, get) => ({
    albumId: null,
    ratings: {},
    overallRating: 0,
    useMedia: true,
    reviewText: "",

    initSession: (albumId, initialRatings) => {
        const existing = DraftStorage.load(albumId);

        if (existing) {
            set({
                albumId,
                ratings: existing.ratings,
                overallRating: existing.overallRating,
                useMedia: existing.useMedia,
                reviewText: existing.reviewText,
            });
            return;
        }

        const ratingsMap = Object.fromEntries(
            initialRatings.map((r) => [r.id, r]),
        );
        set({
            albumId,
            ratings: ratingsMap,
            overallRating: 0,
            useMedia: true,
            reviewText: "",
        });
    },

    setTrackRating: (trackId, value) => {
        set((state) => ({
            ratings: {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], value },
            },
        }));
        get().persistDraft();
    },

    setOverallRating: (value) => {
        set({ overallRating: value });
        get().persistDraft();
    },

    setUseMedia: (value) => {
        set({ useMedia: value });
        get().persistDraft();
    },

    setReviewText: (value) => {
        set({ reviewText: value });
        get().persistDraft();
    },
    setTrackSkip: (trackId, skip) => {
        set((state) => ({
            ratings: {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], skip },
            },
        }));
        get().persistDraft();
    },

    setTrackComment: (trackId, comment) => {
        if (commentPersistTimer) clearTimeout(commentPersistTimer);
        commentPersistTimer = setTimeout(() => {
            set((state) => ({
                ratings: {
                    ...state.ratings,
                    [trackId]: { ...state.ratings[trackId], comment },
                },
            }));
            get().persistDraft();
        }, 300);
    },

    getRatingsArray: () => Object.values(get().ratings),

    persistDraft: () => {
        const { albumId, ratings, overallRating, useMedia, reviewText } = get();
        if (!albumId) return;
        DraftStorage.save({
            albumId,
            ratings,
            overallRating,
            useMedia,
            reviewText,
            savedAt: Date.now(),
        });
    },

    clearSession: (albumId) => {
        DraftStorage.remove(albumId);
        set({
            albumId: null,
            ratings: {},
            overallRating: 0,
            useMedia: true,
            reviewText: "",
        });
    },
}));
