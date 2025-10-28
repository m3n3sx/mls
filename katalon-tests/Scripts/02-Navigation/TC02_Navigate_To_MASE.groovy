import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import internal.GlobalVariable as GlobalVariable

/**
 * TC02: Nawigacja do strony ustawień MASE
 * Cel: Weryfikacja dostępu do strony ustawień wtyczki
 * Wymagania: Użytkownik musi być zalogowany (TC01)
 */

// Krok 1: Kliknij w menu MASE
WebUI.comment('Krok 1: Kliknięcie w menu Modern Admin Styler')
WebUI.click(findTestObject('MASE/MenuLink'))
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/05_mase_menu_clicked.png')

// Krok 2: Poczekaj na załadowanie strony
WebUI.waitForPageLoad(GlobalVariable.default_timeout)

// Krok 3: Weryfikacja załadowania strony MASE
WebUI.comment('Krok 2: Weryfikacja załadowania strony ustawień')
WebUI.verifyElementPresent(findTestObject('MASE/PageTitle'), GlobalVariable.default_timeout)
WebUI.verifyElementText(findTestObject('MASE/PageTitle'), 'Modern Admin Styler Enterprise')

// Krok 4: Weryfikacja obecności wszystkich zakładek
WebUI.comment('Krok 3: Weryfikacja obecności zakładek nawigacyjnych')
def tabs = [
    'General',
    'Admin Bar', 
    'Admin Menu',
    'Content Area',
    'Typography',
    'Visual Effects',
    'Advanced',
    'Import/Export'
]

tabs.each { tabName ->
    WebUI.verifyElementPresent(findTestObject("MASE/Tab_${tabName.replaceAll(' ', '')}"), 5)
    WebUI.comment("Zakładka '${tabName}' jest obecna")
}

// Krok 5: Weryfikacja obecności przycisków akcji
WebUI.comment('Krok 4: Weryfikacja przycisków akcji')
WebUI.verifyElementPresent(findTestObject('MASE/SaveButton'), 5)
WebUI.verifyElementPresent(findTestObject('MASE/ResetButton'), 5)
WebUI.verifyElementPresent(findTestObject('MASE/LivePreviewToggle'), 5)

// Krok 6: Zrzut ekranu strony głównej MASE
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/06_mase_main_page_loaded.png')

// Krok 7: Weryfikacja wersji wtyczki
WebUI.comment('Krok 5: Weryfikacja wersji wtyczki')
def version = WebUI.getText(findTestObject('MASE/VersionInfo'))
WebUI.verifyMatch(version, '1\\.2\\.\\d+', true)
WebUI.comment("Wersja wtyczki: ${version}")

WebUI.comment('Test nawigacji do MASE zakończony pomyślnie')
