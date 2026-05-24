const TAB_BAR_HEIGHT = 48;

const TABS = {
    OVERVIEW: 'Overview',
    HISTORY: 'History',
};

type TabType = (typeof TABS)[keyof typeof TABS];

export { TAB_BAR_HEIGHT, TABS };
export type { TabType };