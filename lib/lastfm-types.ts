export type LastfmPeriod = "overall" | "7day" | "1month" | "3month" | "6month" | "12month";

/** Ou um período pronto do Last.fm, ou um intervalo livre (timestamps UNIX em segundos). */
export type LastfmRange = { period: LastfmPeriod } | { from: number; to: number };

export type LastfmTopType = "artists" | "albums" | "tracks";

export type LastfmTopItem = {
    rank: number;
    name: string;
    /** Artista da música/álbum. Null nos artistas. */
    artist: string | null;
    playcount: number;
    url: string;
    /** Só os álbuns já vêm com capa. */
    imageUrl: string | null;
};

export type LastfmTopResponse = {
    type: LastfmTopType;
    /** Itens diferentes no período (ex.: quantos artistas diferentes). */
    total: number;
    items: LastfmTopItem[];
};

export type LastfmGenre = {
    name: string;
    weight: number;
    artists: string[];
};
