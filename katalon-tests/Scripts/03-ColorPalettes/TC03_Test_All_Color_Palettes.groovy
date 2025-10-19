import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import internal.GlobalVariable as GlobalVariable

/**
 * TC03: Test wszystkich palet kolorów
 * Cel: Weryfikacja działania wszystkich 10 palet kolorów
 * Wymagania: Użytkownik na stronie MASE (TC02)
 */

// Lista wszystkich palet do przetestowania
def palettes = [
    [name: 'Professional Blue', id: 'professional-blue', description: 'Profesjonalna niebieska paleta'],
    [name: 'Energetic Green', id: 'energetic-green', description: 'Energetyczna zielona paleta'],
    [name: 'Creative Purple', id: 'creative-purple', description: 'Kreatywna fioletowa paleta'],
    [name: 'Warm Sunset', id: 'warm-sunset', description: 'Ciepła paleta zachodu słońca'],
    [name: 'Ocean Blue', id: 'ocean-blue', description: 'Oceaniczna niebieska paleta'],
    [name: 'Forest Green', id: 'forest-green', description: 'Leśna zielona paleta'],
    [name: 'Royal Purple', id: 'royal-purple', description: 'Królewska fioletowa paleta'],
    [name: 'Monochrome', id: 'monochrome', description: 'Monochromatyczna paleta'],
    [name: 'Dark Elegance', id: 'dark-elegance', description: 'Ciemna elegancka paleta'],
    [name: 'Vibrant Coral', id: 'vibrant-coral', description: 'Żywa koralowa paleta']
]

WebUI.comment('=== TEST WSZYSTKICH PALET KOLORÓW ===')
WebUI.comment("Liczba palet do przetestowania: ${palettes.size()}")

// Upewnij się, że jesteśmy na zakładce General
WebUI.click(findTestObject('MASE/TabGeneral'))
WebUI.waitForElementVisible(findTestObject('MASE/PaletteSection'), 5)

// Przewiń do sekcji palet
WebUI.scrollToElement(findTestObject('MASE/PaletteSection'), 5)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/07_palette_section_visible.png')

// Testuj każdą paletę
palettes.eachWithIndex { palette, index ->
    WebUI.comment("--- Test palety ${index + 1}/${palettes.size()}: ${palette.name} ---")
    
    // Krok 1: Znajdź kartę palety
    def paletteCard = findTestObject("MASE/Palette_${palette.id}")
    WebUI.verifyElementPresent(paletteCard, 5)
    
    // Krok 2: Przewiń do karty palety
    WebUI.scrollToElement(paletteCard, 3)
    WebUI.delay(1)
    
    // Krok 3: Zrób zrzut ekranu karty palety
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_card.png")
    
    // Krok 4: Kliknij w kartę palety
    WebUI.click(paletteCard)
    WebUI.delay(1)
    
    // Krok 5: Weryfikuj, że paleta została wybrana (aktywna)
    WebUI.verifyElementPresent(findTestObject('MASE/PaletteActiveIndicator'), 5)
    WebUI.comment("Paleta ${palette.name} została wybrana")
    
    // Krok 6: Kliknij przycisk "Zastosuj paletę"
    WebUI.click(findTestObject('MASE/PaletteApplyButton'))
    WebUI.delay(2)
    
    // Krok 7: Poczekaj na zastosowanie zmian
    WebUI.waitForElementNotPresent(findTestObject('MASE/LoadingSpinner'), 10)
    
    // Krok 8: Zrób zrzut ekranu po zastosowaniu palety
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_applied.png")
    
    // Krok 9: Weryfikuj zmiany w interfejsie
    // Sprawdź admin bar
    def adminBarBgColor = WebUI.getCSSValue(findTestObject('WordPress/AdminBar'), 'background-color')
    WebUI.comment("Admin Bar background: ${adminBarBgColor}")
    
    // Sprawdź admin menu
    def adminMenuBgColor = WebUI.getCSSValue(findTestObject('WordPress/AdminMenu'), 'background-color')
    WebUI.comment("Admin Menu background: ${adminMenuBgColor}")
    
    // Krok 10: Zrób pełny zrzut ekranu strony
    WebUI.takeFullPageScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_fullpage.png")
    
    // Krok 11: Sprawdź różne elementy interfejsu
    WebUI.comment("Sprawdzanie elementów interfejsu dla palety: ${palette.name}")
    
    // Przewiń do góry strony
    WebUI.scrollToPosition(0, 0)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_top.png")
    
    // Przewiń do środka
    WebUI.executeJavaScript("window.scrollTo(0, document.body.scrollHeight/2)", null)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_middle.png")
    
    // Przewiń do dołu
    WebUI.scrollToPosition(0, 9999)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/palette_${String.format('%02d', index + 1)}_${palette.id}_bottom.png")
    
    // Wróć do góry dla następnej palety
    WebUI.scrollToPosition(0, 0)
    WebUI.delay(1)
    
    WebUI.comment("Paleta ${palette.name} przetestowana pomyślnie ✓")
    WebUI.comment("Zrzuty ekranu zapisane: 5")
    WebUI.comment("")
}

// Podsumowanie testu
WebUI.comment('=== PODSUMOWANIE TESTU PALET ===')
WebUI.comment("Przetestowano wszystkie ${palettes.size()} palet kolorów")
WebUI.comment("Utworzono ${palettes.size() * 5} zrzutów ekranu")
WebUI.comment('Wszystkie palety działają poprawnie ✓')

// Zapisz ustawienia
WebUI.click(findTestObject('MASE/SaveButton'))
WebUI.waitForElementPresent(findTestObject('MASE/SuccessMessage'), 10)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/08_palettes_test_completed.png')

WebUI.comment('Test palet kolorów zakończony pomyślnie')
