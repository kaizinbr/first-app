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

let persistTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedPersist = (persistFn: () => void) => {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
        persistFn();
    }, 600);
};

// NOVO HELPER: Calcula a média ignorando os skips
const calculateAverage = (ratings: Record<string, TrackRatingEntry>) => {
    const validTracks = Object.values(ratings).filter((r) => !r.skip);
    if (validTracks.length === 0) return 0;

    const sum = validTracks.reduce((acc, curr) => acc + curr.value, 0);
    return parseFloat((sum / validTracks.length).toFixed(2));
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

    initSession: (
        albumId: string,
        initialRatings: TrackRatingEntry[],
        text: string,
        overallRating?: number,
        manual?: boolean,
    ) => void;
    setTrackRating: (trackId: string, value: number) => void;
    setOverallRating: (value: number) => void;
    setUseMedia: (value: boolean) => void;
    setReviewText: (value: string) => void;
    setTrackSkip: (trackId: string, skip: boolean) => void;
    setTrackComment: (trackId: string, comment: string) => void;
    setTrackFavorite: (trackId: string, favorite: boolean) => void;
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

    initSession: (albumId, initialRatings, text, overallRating, manual) => {
        const existing = DraftStorage.load(albumId);
        console.log("Initializing review session for album", albumId, {
            existing,
            initialRatings,
            text,
            manual,
        });

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
            overallRating: overallRating, // Aplica o valor do DB
            useMedia: !manual, // Se for manual, useMedia é false
            reviewText: text,
        });
    },

    setReviewText: (value) => {
        set({ reviewText: value });
        get().persistDraft();
    },

    getRatingsArray: () => Object.values(get().ratings),

    setTrackRating: (trackId, value) => {
        set((state) => {
            const newRatings = {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], value },
            };

            // Recalcula a média automaticamente se usar media
            const newOverall = state.useMedia
                ? calculateAverage(newRatings)
                : state.overallRating;

            return { ratings: newRatings, overallRating: newOverall };
        });
        get().persistDraft();
    },

    setOverallRating: (value) => {
        set({ overallRating: value });
        get().persistDraft();
    },

    setUseMedia: (value) => {
        set((state) => ({
            useMedia: value,
            // Se ativou a média agora, já força o cálculo imediatamente
            overallRating: value
                ? calculateAverage(state.ratings)
                : state.overallRating,
        }));
        get().persistDraft();
    },

    setTrackSkip: (trackId, skip) => {
        set((state) => {
            const newRatings = {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], skip },
            };

            // Se pulou a track, ela sai do cálculo da média na mesma hora
            const newOverall = state.useMedia
                ? calculateAverage(newRatings)
                : state.overallRating;

            return { ratings: newRatings, overallRating: newOverall };
        });
        get().persistDraft();
    },

    setTrackComment: (trackId, comment) => {
        // 1. Atualiza a UI e o Zustand IMEDIATAMENTE (sem setTimeout)
        set((state) => ({
            ratings: {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], comment },
            },
        }));
        // 2. Atrasa apenas o salvamento no cache para não fritar o disco
        debouncedPersist(() => get().persistDraft());
    },

    setTrackFavorite: (trackId, favorite) => {
        set((state) => ({
            ratings: {
                ...state.ratings,
                [trackId]: { ...state.ratings[trackId], favorite },
            },
        }));
        get().persistDraft();
    },

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
