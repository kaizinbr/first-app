// Tipos básicos reutilizáveis
export interface ExternalUrls {
    spotify: string;
}

export interface Image {
    height?: number;
    width?: number;
    url: string;
}

export interface Href {
    href: string | null;
}

// Artists
export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ArtistDetail extends Artist {
    followers?: Href & { total: number };
    genres?: string[];
    images?: Image[];
    popularity?: number;
}

// Album
export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    is_playable: boolean;
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

// Track
export interface ExternalIds {
    isrc: string;
}

export interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
}

// Search Results
export interface SearchPagination {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[];
}

export interface TracksResult extends SearchPagination {
    items: Track[];
}

export interface ArtistsResult extends SearchPagination {
    items: ArtistDetail[];
}

export interface AlbumsResult extends SearchPagination {
    items: Album[];
}

// User
export interface Favorite {
    albuns: Album[];
    artists: ArtistDetail[];
}

export interface UserAlbum {
    id: string;
    src: string;
    title: string;
    artist: string;
}

export interface UserArtist {
    id: string;
    src: string;
    name: string;
}

export interface User {
    id: string;
    username: string;
    name: string;
    lowername: string;
    bio: string;
    pronouns: string;
    site: string | null;
    color: string;
    created_at: string;
    public: boolean;
    favorites: Favorite[];
    verified: boolean;
    avatar_url: string;
    albuns: UserAlbum[];
    artists: UserArtist[];
    location: string | null;
}

export interface Review {
    id: string;
    ratings: Rating[];
    review: string;
    total: string;
    shorten: string;
    content: Record<string, unknown>;
    published: boolean;
    created_at: string;
    updated_at: string;
    album_id: string;
    user_id: string;
    Profile: User;
};

export interface Rating {
    id: string;
    value: number;
    favorite: boolean;
};

// Response principal
export interface SearchResponse {
    tracks: TracksResult;
    artists: ArtistsResult;
    albums: AlbumsResult;
    users: User[];
    reviews: Review[];
}
