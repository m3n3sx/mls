/**
 * Modern Admin Styler Enterprise - Complete Object Repository
 * Wszystkie elementy interfejsu wtyczki MASE
 */

class MASEElements {
    
    // ========== LOGOWANIE WORDPRESS ==========
    static final String LOGIN_USERNAME = "//input[@id='user_login']"
    static final String LOGIN_PASSWORD = "//input[@id='user_pass']"
    static final String LOGIN_SUBMIT = "//input[@id='wp-submit']"
    static final String LOGIN_REMEMBER = "//input[@id='rememberme']"
    
    // ========== MENU WORDPRESS ==========
    static final String ADMIN_MENU_MASE = "//li[@id='toplevel_page_modern-admin-styler']"
    static final String ADMIN_MENU_MASE_LINK = "//a[contains(text(),'Modern Admin Styler')]"
    
    // ========== NAGŁÓWEK STRONY USTAWIEŃ ==========
    static final String PAGE_TITLE = "//h1[contains(text(),'Modern Admin Styler')]"
    static final String VERSION_INFO = "//span[@class='mase-version']"
    static final String SAVE_BUTTON = "//button[@id='mase-save-settings']"
    static final String RESET_BUTTON = "//button[@id='mase-reset-settings']"
    static final String SUCCESS_MESSAGE = "//div[@class='notice notice-success']"
    static final String ERROR_MESSAGE = "//div[@class='notice notice-error']"
    
    // ========== ZAKŁADKI NAWIGACYJNE ==========
    static final String TAB_GENERAL = "//button[@data-tab='general']"
    static final String TAB_ADMIN_BAR = "//button[@data-tab='admin-bar']"
    static final String TAB_ADMIN_MENU = "//button[@data-tab='admin-menu']"
    static final String TAB_CONTENT_AREA = "//button[@data-tab='content-area']"
    static final String TAB_TYPOGRAPHY = "//button[@data-tab='typography']"
    static final String TAB_VISUAL_EFFECTS = "//button[@data-tab='visual-effects']"
    static final String TAB_ADVANCED = "//button[@data-tab='advanced']"
    static final String TAB_IMPORT_EXPORT = "//button[@data-tab='import-export']"
    
    // ========== ZAKŁADKA GENERAL - PALETY KOLORÓW ==========
    static final String PALETTE_SECTION = "//div[@class='mase-palette-selector']"
    static final String PALETTE_PROFESSIONAL_BLUE = "//div[@data-palette='professional-blue']"
    static final String PALETTE_ENERGETIC_GREEN = "//div[@data-palette='energetic-green']"
    static final String PALETTE_CREATIVE_PURPLE = "//div[@data-palette='creative-purple']"
    static final String PALETTE_WARM_SUNSET = "//div[@data-palette='warm-sunset']"
    static final String PALETTE_OCEAN_BLUE = "//div[@data-palette='ocean-blue']"
    static final String PALETTE_FOREST_GREEN = "//div[@data-palette='forest-green']"
    static final String PALETTE_ROYAL_PURPLE = "//div[@data-palette='royal-purple']"
    static final String PALETTE_MONOCHROME = "//div[@data-palette='monochrome']"
    static final String PALETTE_DARK_ELEGANCE = "//div[@data-palette='dark-elegance']"
    static final String PALETTE_VIBRANT_CORAL = "//div[@data-palette='vibrant-coral']"
    static final String PALETTE_APPLY_BUTTON = "//button[@class='mase-palette-apply']"
    static final String PALETTE_ACTIVE_INDICATOR = "//div[@class='mase-palette-card active']"
    
    // ========== ZAKŁADKA GENERAL - SZABLONY ==========
    static final String TEMPLATE_SECTION = "//div[@class='mase-template-gallery']"
    static final String TEMPLATE_MODERN_MINIMAL = "//div[@data-template='modern-minimal']"
    static final String TEMPLATE_PROFESSIONAL_DARK = "//div[@data-template='professional-dark']"
    static final String TEMPLATE_CREATIVE_BRIGHT = "//div[@data-template='creative-bright']"
    static final String TEMPLATE_ELEGANT_NEUTRAL = "//div[@data-template='elegant-neutral']"
    static final String TEMPLATE_BOLD_VIBRANT = "//div[@data-template='bold-vibrant']"
    static final String TEMPLATE_SOFT_PASTEL = "//div[@data-template='soft-pastel']"
    static final String TEMPLATE_HIGH_CONTRAST = "//div[@data-template='high-contrast']"
    static final String TEMPLATE_NATURE_INSPIRED = "//div[@data-template='nature-inspired']"
    static final String TEMPLATE_TECH_MODERN = "//div[@data-template='tech-modern']"
    static final String TEMPLATE_WARM_COZY = "//div[@data-template='warm-cozy']"
    static final String TEMPLATE_COOL_PROFESSIONAL = "//div[@data-template='cool-professional']"
    static final String TEMPLATE_APPLY_BUTTON = "//button[@class='mase-template-apply']"
    static final String TEMPLATE_PREVIEW_BUTTON = "//button[@class='mase-template-preview']"
    
    // ========== ZAKŁADKA GENERAL - LIVE PREVIEW ==========
    static final String LIVE_PREVIEW_TOGGLE = "//input[@id='mase-live-preview']"
    static final String LIVE_PREVIEW_LABEL = "//label[@for='mase-live-preview']"
    static final String LIVE_PREVIEW_STATUS = "//span[@class='mase-live-preview-status']"
    
    // ========== ZAKŁADKA ADMIN BAR - KOLORY ==========
    static final String ADMINBAR_BG_COLOR = "//input[@id='mase-adminbar-bg-color']"
    static final String ADMINBAR_TEXT_COLOR = "//input[@id='mase-adminbar-text-color']"
    static final String ADMINBAR_HOVER_BG = "//input[@id='mase-adminbar-hover-bg']"
    static final String ADMINBAR_HOVER_TEXT = "//input[@id='mase-adminbar-hover-text']"
    static final String ADMINBAR_LINK_COLOR = "//input[@id='mase-adminbar-link-color']"
    static final String ADMINBAR_LINK_HOVER = "//input[@id='mase-adminbar-link-hover']"
    
    // ========== ZAKŁADKA ADMIN BAR - TYPOGRAFIA ==========
    static final String ADMINBAR_FONT_FAMILY = "//select[@id='mase-adminbar-font-family']"
    static final String ADMINBAR_FONT_SIZE = "//input[@id='mase-adminbar-font-size']"
    static final String ADMINBAR_FONT_WEIGHT = "//select[@id='mase-adminbar-font-weight']"
    static final String ADMINBAR_LINE_HEIGHT = "//input[@id='mase-adminbar-line-height']"
    
    // ========== ZAKŁADKA ADMIN BAR - WYMIARY ==========
    static final String ADMINBAR_HEIGHT = "//input[@id='mase-adminbar-height']"
    static final String ADMINBAR_PADDING = "//input[@id='mase-adminbar-padding']"
    
    // ========== ZAKŁADKA ADMIN MENU - KOLORY ==========
    static final String MENU_BG_COLOR = "//input[@id='mase-menu-bg-color']"
    static final String MENU_TEXT_COLOR = "//input[@id='mase-menu-text-color']"
    static final String MENU_HOVER_BG = "//input[@id='mase-menu-hover-bg']"
    static final String MENU_HOVER_TEXT = "//input[@id='mase-menu-hover-text']"
    static final String MENU_ACTIVE_BG = "//input[@id='mase-menu-active-bg']"
    static final String MENU_ACTIVE_TEXT = "//input[@id='mase-menu-active-text']"
    static final String MENU_SUBMENU_BG = "//input[@id='mase-menu-submenu-bg']"
    static final String MENU_SUBMENU_TEXT = "//input[@id='mase-menu-submenu-text']"
    
    // ========== ZAKŁADKA ADMIN MENU - TYPOGRAFIA ==========
    static final String MENU_FONT_FAMILY = "//select[@id='mase-menu-font-family']"
    static final String MENU_FONT_SIZE = "//input[@id='mase-menu-font-size']"
    static final String MENU_FONT_WEIGHT = "//select[@id='mase-menu-font-weight']"
    static final String MENU_LINE_HEIGHT = "//input[@id='mase-menu-line-height']"
    
    // ========== ZAKŁADKA ADMIN MENU - WYMIARY ==========
    static final String MENU_WIDTH = "//input[@id='mase-menu-width']"
    static final String MENU_ITEM_HEIGHT = "//input[@id='mase-menu-item-height']"
    static final String MENU_PADDING = "//input[@id='mase-menu-padding']"
    
    // ========== ZAKŁADKA CONTENT AREA - KOLORY ==========
    static final String CONTENT_BG_COLOR = "//input[@id='mase-content-bg-color']"
    static final String CONTENT_TEXT_COLOR = "//input[@id='mase-content-text-color']"
    static final String CONTENT_HEADING_COLOR = "//input[@id='mase-content-heading-color']"
    static final String CONTENT_LINK_COLOR = "//input[@id='mase-content-link-color']"
    static final String CONTENT_LINK_HOVER = "//input[@id='mase-content-link-hover']"
    static final String CONTENT_BORDER_COLOR = "//input[@id='mase-content-border-color']"
    
    // ========== ZAKŁADKA TYPOGRAPHY - GŁÓWNE CZCIONKI ==========
    static final String TYPOGRAPHY_HEADING_FONT = "//select[@id='mase-heading-font-family']"
    static final String TYPOGRAPHY_BODY_FONT = "//select[@id='mase-body-font-family']"
    static final String TYPOGRAPHY_H1_SIZE = "//input[@id='mase-h1-font-size']"
    static final String TYPOGRAPHY_H2_SIZE = "//input[@id='mase-h2-font-size']"
    static final String TYPOGRAPHY_H3_SIZE = "//input[@id='mase-h3-font-size']"
    static final String TYPOGRAPHY_BODY_SIZE = "//input[@id='mase-body-font-size']"
    static final String TYPOGRAPHY_LINE_HEIGHT = "//input[@id='mase-body-line-height']"
    
    // ========== ZAKŁADKA VISUAL EFFECTS - EFEKTY ==========
    static final String EFFECT_GLASSMORPHISM = "//input[@id='mase-glassmorphism-enable']"
    static final String EFFECT_GLASSMORPHISM_BLUR = "//input[@id='mase-glassmorphism-blur']"
    static final String EFFECT_GLASSMORPHISM_OPACITY = "//input[@id='mase-glassmorphism-opacity']"
    static final String EFFECT_FLOATING_ELEMENTS = "//input[@id='mase-floating-enable']"
    static final String EFFECT_SHADOWS = "//input[@id='mase-shadows-enable']"
    static final String EFFECT_SHADOW_SIZE = "//select[@id='mase-shadow-size']"
    static final String EFFECT_ANIMATIONS = "//input[@id='mase-animations-enable']"
    static final String EFFECT_ANIMATION_SPEED = "//select[@id='mase-animation-speed']"
    static final String EFFECT_BORDER_RADIUS = "//input[@id='mase-border-radius']"
    
    // ========== ZAKŁADKA VISUAL EFFECTS - DARK MODE ==========
    static final String DARK_MODE_TOGGLE = "//input[@id='mase-dark-mode-enable']"
    static final String DARK_MODE_AUTO = "//input[@id='mase-dark-mode-auto']"
    static final String DARK_MODE_START_TIME = "//input[@id='mase-dark-mode-start']"
    static final String DARK_MODE_END_TIME = "//input[@id='mase-dark-mode-end']"
    
    // ========== ZAKŁADKA ADVANCED - WYDAJNOŚĆ ==========
    static final String ADVANCED_CACHE_ENABLE = "//input[@id='mase-cache-enable']"
    static final String ADVANCED_CACHE_DURATION = "//input[@id='mase-cache-duration']"
    static final String ADVANCED_MINIFY_CSS = "//input[@id='mase-minify-css']"
    static final String ADVANCED_MOBILE_OPTIMIZE = "//input[@id='mase-mobile-optimize']"
    
    // ========== ZAKŁADKA ADVANCED - DOSTĘPNOŚĆ ==========
    static final String ADVANCED_HIGH_CONTRAST = "//input[@id='mase-high-contrast']"
    static final String ADVANCED_KEYBOARD_NAV = "//input[@id='mase-keyboard-nav']"
    static final String ADVANCED_SCREEN_READER = "//input[@id='mase-screen-reader']"
    static final String ADVANCED_FOCUS_INDICATORS = "//input[@id='mase-focus-indicators']"
    
    // ========== ZAKŁADKA ADVANCED - SKRÓTY KLAWISZOWE ==========
    static final String ADVANCED_SHORTCUTS_ENABLE = "//input[@id='mase-shortcuts-enable']"
    static final String ADVANCED_SHORTCUT_SAVE = "//input[@id='mase-shortcut-save']"
    static final String ADVANCED_SHORTCUT_PREVIEW = "//input[@id='mase-shortcut-preview']"
    static final String ADVANCED_SHORTCUT_RESET = "//input[@id='mase-shortcut-reset']"
    
    // ========== ZAKŁADKA IMPORT/EXPORT ==========
    static final String IMPORT_TEXTAREA = "//textarea[@id='mase-import-data']"
    static final String IMPORT_BUTTON = "//button[@id='mase-import-settings']"
    static final String EXPORT_BUTTON = "//button[@id='mase-export-settings']"
    static final String EXPORT_TEXTAREA = "//textarea[@id='mase-export-data']"
    static final String BACKUP_CREATE = "//button[@id='mase-create-backup']"
    static final String BACKUP_RESTORE = "//button[@id='mase-restore-backup']"
    static final String BACKUP_LIST = "//select[@id='mase-backup-list']"
    static final String BACKUP_DELETE = "//button[@id='mase-delete-backup']"
    
    // ========== PRZYCISKI AKCJI ==========
    static final String ACTION_SAVE_ALL = "//button[@id='mase-save-all-settings']"
    static final String ACTION_RESET_ALL = "//button[@id='mase-reset-all-settings']"
    static final String ACTION_RESET_TAB = "//button[@class='mase-reset-tab']"
    static final String ACTION_PREVIEW_TOGGLE = "//button[@id='mase-toggle-preview']"
    
    // ========== MODALNE OKNA ==========
    static final String MODAL_CONFIRM = "//div[@class='mase-modal-confirm']"
    static final String MODAL_CONFIRM_YES = "//button[@class='mase-modal-yes']"
    static final String MODAL_CONFIRM_NO = "//button[@class='mase-modal-no']"
    static final String MODAL_CLOSE = "//button[@class='mase-modal-close']"
    
    // ========== POWIADOMIENIA ==========
    static final String NOTICE_SUCCESS = "//div[contains(@class,'notice-success')]"
    static final String NOTICE_ERROR = "//div[contains(@class,'notice-error')]"
    static final String NOTICE_WARNING = "//div[contains(@class,'notice-warning')]"
    static final String NOTICE_INFO = "//div[contains(@class,'notice-info')]"
    static final String NOTICE_DISMISS = "//button[@class='notice-dismiss']"
    
    // ========== LOADING INDICATORS ==========
    static final String LOADING_SPINNER = "//div[@class='mase-loading-spinner']"
    static final String LOADING_OVERLAY = "//div[@class='mase-loading-overlay']"
    
    // ========== WALIDACJA FORMULARZY ==========
    static final String VALIDATION_ERROR = "//span[@class='mase-validation-error']"
    static final String VALIDATION_SUCCESS = "//span[@class='mase-validation-success']"
    
    // ========== PODGLĄD NA ŻYWO ==========
    static final String PREVIEW_FRAME = "//iframe[@id='mase-preview-frame']"
    static final String PREVIEW_ADMINBAR = "//div[@id='wpadminbar']"
    static final String PREVIEW_MENU = "//div[@id='adminmenu']"
    static final String PREVIEW_CONTENT = "//div[@id='wpbody-content']"
}
